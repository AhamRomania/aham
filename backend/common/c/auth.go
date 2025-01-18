package c

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Create a wrapper for http handler to check if the user is authenticated
func Guard(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if _, err := UserID(r); err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		h(w, r)
	}
}

func UserID(r *http.Request) (id int64, err error) {

	authHeader := r.Header.Get("Authorization")

	if authHeader == "" {
		return 0, fmt.Errorf("authorization header is required")
	}

	tokenString := authHeader[len("Bearer "):]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate the algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(JWT_KEY), nil
	})

	if err != nil {
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, err := strconv.Atoi(fmt.Sprintf("%v", claims["user"]))
		if err != nil {
			return 0, fmt.Errorf("invalid token")
		}
		return int64(userID), nil
	}

	return 0, fmt.Errorf("invalid token")
}

func JWTUserID(id int64) (string, error) {

	type Claims struct {
		UserID string `json:"user"`
		jwt.StandardClaims
	}

	var jwtKey = []byte(JWT_KEY)

	claims := &Claims{
		UserID: fmt.Sprint(id),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(JWT_EXPIRE).Unix(),
			Subject:   "auth",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
