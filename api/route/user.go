package route

import (
	"aham/c"
	"aham/db"
	"aham/service/emails"
	"net/http"
	"unicode"

	"github.com/go-chi/render"
	"golang.org/x/crypto/bcrypt"
)

type CreateUserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Phone    string `json:"phone"`
	City     int64  `json:"city"`
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
		c.Error(w, http.StatusBadRequest, "Failed to decode request body for user creation")
		return
	}

	if db.VerifyEmailExists(req.Email) {
		c.Log().Info("Email already exists: ", req.Email)
		c.Error(w, http.StatusBadRequest, "Email already exists")
		return
	}

	if !isPasswordComplex(req.Password) {
		c.Error(w, http.StatusBadRequest, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.")
		return
	}

	password, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)

	if err != nil {
		c.Error(w, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	if req.Name == "" {
		c.Error(w, http.StatusBadRequest, "Name cannot be empty")
		return
	}

	if req.Phone == "" {
		c.Error(w, http.StatusBadRequest, "Phone number cannot be empty")
		return
	}

	user := &db.User{
		Email:    req.Email,
		Password: string(password),
		Name:     req.Name,
		Phone:    req.Phone,
		City:     req.City,
	}

	if err := user.Create(); err != nil {
		c.Log().Info("Failed to create user", "error", err)
		c.Error(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	emails.Send(user, emails.WELCOME, &emails.Args{
		"ACTIVATION_URL": "https://aham.ro/activare?secret=ABC",
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
