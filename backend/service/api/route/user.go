package route

import (
	"aham/common/c"
	"aham/common/emails"
	"aham/service/api/db"
	"aham/service/api/vo"
	"context"
	"fmt"
	"net/http"
	"unicode"

	"github.com/go-chi/render"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	GivenName  string `json:"given_name"`
	FamilyName string `json:"family_name"`
	Phone      string `json:"phone"`
	City       int64  `json:"city"`
}

func UserBalance(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	user := db.GetUserByID(userID)

	if user == nil {
		http.Error(w, "forbidden", http.StatusNotFound)
		return
	}

	balance, err := user.Balance()

	if err != nil {
		http.Error(w, "forbidden", http.StatusForbidden)
		c.Log().Error(err)
		return
	}

	w.Write([]byte(fmt.Sprint(balance)))
}

func ActivateUser(w http.ResponseWriter, r *http.Request) {

	ref := r.URL.Query().Get("ref")

	if ref == "" {
		http.Error(w, "invalid ref", http.StatusBadRequest)
		return
	}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.Background(),
		`UPDATE
			users
		SET
			email_activation_token = NULL,
			email_activated_at = now()
		WHERE
			email_activation_token = $1
		RETURNING id`,
		ref,
	)

	var id int64

	if err := row.Scan(&id); err != nil {
		http.Error(w, "E01: nu am putut activa contul", http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	user := db.GetUserByID(id)

	if user == nil {
		http.Error(w, "E02: nu am putut activa contul", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, c.URLF(c.Web, "/cont/succes?name=%s", user.GivenName), http.StatusTemporaryRedirect)
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	if id, err := c.UserID(r); err == nil {
		me := db.GetUserByID(id)
		if me == nil {
			c.Log().Errorf("expected user since jwt has id: %d", id)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		render.JSON(w, r, vo.NewUser(me))
	}
}

func CreateUser(w http.ResponseWriter, r *http.Request) {

	var req CreateUserRequest

	if err := render.DecodeJSON(r.Body, &req); err != nil {
		http.Error(w, "Failed to decode request body for user creation", http.StatusBadRequest)
		return
	}

	if db.VerifyEmailExists(req.Email) {
		c.Log().Info("Adresa de email există deja: ", req.Email)
		http.Error(w, "Adresa de email există deja", http.StatusBadRequest)
		return
	}

	if !isPasswordComplex(req.Password) {
		http.Error(w, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.", http.StatusBadRequest)
		return
	}

	password, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	if req.GivenName == "" {
		http.Error(w, "Given name cannot be empty", http.StatusBadRequest)
		return
	}

	if req.Phone == "" {
		http.Error(w, "Phone number cannot be empty", http.StatusBadRequest)
		return
	}

	user := &db.User{
		Email:                req.Email,
		Password:             string(password),
		GivenName:            req.GivenName,
		FamilyName:           req.FamilyName,
		Phone:                req.Phone,
		City:                 req.City,
		Source:               "native",
		EmailActivationToken: c.String(uuid.NewString()),
		Preferences: db.UserPreferences{
			db.UserPrefActiveAds:  2,
			db.UserPrefAdLifetime: 60 * 24 * 10,
		},
	}

	if err := user.Create(); err != nil {
		c.Log().Info("Failed to create user", "error", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	if err := user.UpdateBalance("Registration Gift", 0, 100); err != nil {
		c.Log().Error(err)
	}

	emails.Welcome(
		user.Recipient(),
		emails.WelcomeParams{
			ActivationURL: c.URLF(c.Api, "/v1/activate?ref=%s", *user.EmailActivationToken),
		},
	)

	render.JSON(w, r, map[string]any{
		"id":          user.ID,
		"given_name":  user.GivenName,
		"family_name": user.FamilyName,
	})
}

func isPasswordComplex(password string) bool {
	var (
		hasMinLen  = false
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	if len(password) >= 8 {
		hasMinLen = true
	}

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	return hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial
}
