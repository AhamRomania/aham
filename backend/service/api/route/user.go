package route

import (
	"aham/common/c"
	"aham/common/emails"
	"aham/service/api/db"
	"context"
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

func ActivateUser(w http.ResponseWriter, r *http.Request) {

	ref := r.URL.Query().Get("ref")

	if ref == "" {
		http.Error(w, "invalid ref", http.StatusBadRequest)
		return
	}

	rows, err := c.DB().Query(
		context.Background(),
		`UPDATE
			users
		SET
			email_activation_token = NULL,
			email_activated_at = now()
		WHERE
			email_activation_token = $1`,
		ref,
	)

	if err != nil {
		c.Log().Error(err.Error())
		http.Error(w, "Failed to activate user", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	if rows.CommandTag().RowsAffected() == 0 {
		http.Error(w, "Invalid activation token", http.StatusBadRequest)
		return
	}
}

func GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	if id, err := c.UserID(r); err == nil {
		if user, err := db.GetUserByID(id); err == nil {
			render.JSON(w, r, user)
		}
	}
}

func CreateUser(w http.ResponseWriter, r *http.Request) {

	var req CreateUserRequest

	if err := render.DecodeJSON(r.Body, &req); err != nil {
		http.Error(w, "Failed to decode request body for user creation", http.StatusBadRequest)
		return
	}

	if db.VerifyEmailExists(req.Email) {
		c.Log().Info("Email already exists: ", req.Email)
		http.Error(w, "Email already exists", http.StatusBadRequest)
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
		EmailActivationToken: c.String(uuid.NewString()),
	}

	if err := user.Create(); err != nil {
		c.Log().Info("Failed to create user", "error", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	emails.Send(user, emails.WELCOME, &emails.Args{
		"ACTIVATION_URL": c.URLF("/activare?ref=%s", *user.EmailActivationToken),
	})

	render.JSON(w, r, req)
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
