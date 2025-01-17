package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Auth(w http.ResponseWriter, r *http.Request) {

	gtoken := r.URL.Query().Get("google_token")

	if gtoken != "" {

		user, err := matchGoogleAccount(gtoken)

		if err != nil {
			c.Log().Error(err)
			c.Error(w, http.StatusUnauthorized, "Failed to fetch matching Google account")
			return
		}

		authorize(w, r, user)

		return
	}

	var req AuthRequest

	if err := render.DecodeJSON(r.Body, &req); err != nil {
		c.Error(w, http.StatusBadRequest, "Failed to decode request body for user authentication")
		return
	}

	user, err := db.GetUserByEmail(req.Email)

	if !user.Activated() {
		c.Error(w, http.StatusUnauthorized, "User account is not activated")
		return
	}

	if err != nil {
		c.Error(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.Error(w, http.StatusUnauthorized, "Invalid email or password")
		return
	}

	authorize(w, r, user)
}

func authorize(w http.ResponseWriter, r *http.Request, user *db.User) {

	type Claims struct {
		UserID string `json:"user_id"`
		jwt.StandardClaims
	}

	var jwtKey = []byte(c.JWT_KEY)

	claims := &Claims{
		UserID: fmt.Sprint(user.ID),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(c.JWT_EXPIRE).Unix(),
			Subject:   "auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		c.Error(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	if err != nil {
		c.Error(w, http.StatusInternalServerError, "Failed to generate access token")
		return
	}

	render.JSON(w, r, map[string]string{"token": tokenString})
}

func matchGoogleAccount(token string) (user *db.User, err error) {

	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+token, nil)

	if err != nil {
		return nil, err
	}

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to verify Google token")
	}

	type GoogleTokenInfo struct {
		Email      string `json:"email"`
		GivenName  string `json:"given_name"`
		FamilyName string `json:"family_name"`
		Picture    string `json:"picture"`
	}

	var data GoogleTokenInfo = GoogleTokenInfo{}

	if err := render.DecodeJSON(resp.Body, &data); err != nil {
		return nil, err
	}

	user, err = db.GetUserByEmail(data.Email)

	if err != nil {
		return nil, err
	}

	if user == nil {

		user = &db.User{
			Email:      data.Email,
			GivenName:  data.GivenName,
			FamilyName: data.FamilyName,
			Picture:    c.String(data.Picture),
		}

		if err := user.Create(); err != nil {
			return nil, err
		}
	}

	return user, nil
}
