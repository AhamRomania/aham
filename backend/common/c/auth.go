package c

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/pkg/errors"
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

func getAccessToken(r *http.Request) string {
	// Check Authorization header
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	// Check query parameter
	queryToken := r.URL.Query().Get("access_token")
	if queryToken != "" {
		return queryToken
	}

	// No token found
	return ""
}

func getAppOwnerFromRequest(r *http.Request) (owner int64, err error) {

	conn := DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		`select owner from applications from key = $1`,
		getAccessToken(r),
	)

	err = row.Scan(&owner)

	return
}

func UserID(r *http.Request) (id int64, err error) {

	token, err := jwt.Parse(getAccessToken(r), func(token *jwt.Token) (interface{}, error) {
		// Validate the algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(JWT_KEY), nil
	})

	if err != nil {

		if owner, err := getAppOwnerFromRequest(r); err == nil {
			return owner, nil
		}

		return 0, errors.Wrap(err, "can't parse jwt")
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
