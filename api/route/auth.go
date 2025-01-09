package route

import (
	"aham/c"
	"aham/db"
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
		c.Error(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	render.JSON(w, r, map[string]string{"token": tokenString})
}
