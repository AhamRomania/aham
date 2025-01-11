package db

import (
	"aham/c"
	"context"
	"time"
)

type User struct {
	ID                   int        `json:"id"`
	Email                string     `json:"email"`
	Password             string     `json:"-"`
	GivenName            string     `json:"given_name"`
	FamilyName           string     `json:"family_name"`
	Phone                string     `json:"phone"`
	City                 int64      `json:"city"`
	Picture              *string    `json:"picture"`
	EmailActivationToken *string    `json:"email_activation_token"`
	PhoneActivationToken *string    `json:"phone_activation_token"`
	EmailActivatedAt     *time.Time `json:"email_activated_at"`
	PhoneActivatedAt     *time.Time `json:"phone_activated_at"`
	CreatedAt            time.Time  `json:"created_at"`
}

func (u *User) Activated() bool {
	return u.EmailActivatedAt != nil
}

func (u *User) ToEmail() string {
	return u.Email
}

func (u *User) ToName() string {
	return u.GivenName + " " + u.FamilyName
}

func (u *User) Create() error {
	_, err := c.DB().Exec(
		context.Background(),
		"INSERT INTO users (email, password, given_name, family_name, phone, city, email_activation_token) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		u.Email, u.Password, u.GivenName, u.FamilyName, u.Phone, u.City, u.EmailActivationToken,
	)

	return err
}

// VerifyEmailExists checks if the email exists in the database
func VerifyEmailExists(email string) bool {

	var found int

	c.DB().QueryRow(
		context.Background(),
		"SELECT count(email) FROM users WHERE email = $1",
		email,
	).Scan(&found)

	return found > 0
}

func GetUserByEmail(email string) (*User, error) {
	var user User

	err := c.DB().QueryRow(
		context.Background(),
		"SELECT id, email, password, given_name, family_name, phone, city, email_activation_token, phone_activation_token, created_at, email_activated_at FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Email, &user.Password, &user.GivenName, &user.FamilyName, &user.Phone, &user.City, &user.EmailActivationToken, &user.PhoneActivationToken, &user.CreatedAt, &user.EmailActivatedAt)

	return &user, err
}

func GetUserByID(id int64) (*User, error) {
	var user User

	err := c.DB().QueryRow(
		context.Background(),
		"SELECT id, email, password, given_name, family_name, phone, city, email_activation_token, phone_activation_token, created_at, email_activated_at FROM users WHERE id = $1",
		id,
	).Scan(&user.ID, &user.Email, &user.Password, &user.GivenName, &user.FamilyName, &user.Phone, &user.City, &user.EmailActivationToken, &user.PhoneActivationToken, &user.CreatedAt, &user.EmailActivatedAt)

	return &user, err
}
