package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/service"
	"net/http"

	"github.com/go-chi/render"
	"golang.org/x/crypto/bcrypt"
)

type ThirdPartySource string

const (
	Google   ThirdPartySource = "google"
	Facebook ThirdPartySource = "facebook"
)

type ThirdPartyAuthrequest struct {
	AccessToken string `json:"access_token"`
}

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Auth(w http.ResponseWriter, r *http.Request) {

	var req AuthRequest

	if err := render.DecodeJSON(r.Body, &req); err != nil {
		http.Error(w, "Failed to decode request body for user authentication", http.StatusBadRequest)
		return
	}

	user, err := db.GetUserByEmail(req.Email)

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "User account is not activated", http.StatusUnauthorized)
		return
	}

	if !user.Activated() {
		http.Error(w, "User account is not activated", http.StatusUnauthorized)
		return
	}

	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	authorize(w, r, user)
}

func AuthWithGoogle(w http.ResponseWriter, r *http.Request) {

	s := service.NewThirdPartySignIn(
		&service.GoogleAdapter{},
		r,
	)

	user, err := s.GetUser()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	authorize(w, r, user)
}

func AuthWithFacebook(w http.ResponseWriter, r *http.Request) {

	s := service.NewThirdPartySignIn(
		&service.FacebookAdapter{},
		r,
	)

	user, err := s.GetUser()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	authorize(w, r, user)
}

func authorize(w http.ResponseWriter, r *http.Request, user *db.User) {

	token, err := c.JWTUserID(user.ID)

	if err != nil {
		http.Error(w, "Failed to generate JWT token", http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, map[string]any{"token": token, "expire": 60})
}
