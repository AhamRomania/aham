package c

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v4"
)

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
		userID, err := strconv.Atoi(fmt.Sprintf("%v", claims["user_id"]))
		if err != nil {
			return 0, fmt.Errorf("invalid token")
		}
		return int64(userID), nil
	}

	return 0, fmt.Errorf("invalid token")
}
