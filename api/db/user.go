package db

import (
	"aham/c"
	"context"
	"time"
)

type User struct {
	ID                   int       `json:"id"`
	Email                string    `json:"email"`
	Password             string    `json:"-"`
	Name                 string    `json:"name"`
	Phone                string    `json:"phone"`
	City                 int64     `json:"city"`
	EmailActivationToken *string   `json:"email_activation_token"`
	PhoneActivationToken *string   `json:"phone_activation_token"`
	CreatedAt            time.Time `json:"created_at"`
}

func (u *User) ToEmail() string {
	return u.Email
}

func (u *User) ToName() string {
	return u.Name
}

func (u *User) Create() error {
	_, err := c.DB().Exec(
		context.Background(),
		"INSERT INTO users (email, password, name, phone, city, email_activation_token) VALUES ($1, $2, $3, $4, $5, $6)",
		u.Email, u.Password, u.Name, u.Phone, u.City, u.EmailActivationToken,
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
		"SELECT id, email, password, name, phone, city, email_activation_token, phone_activation_token, created_at FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Phone, &user.City, &user.EmailActivationToken, &user.PhoneActivationToken, &user.CreatedAt)

	return &user, err
}

func GetUserByID(id int64) (*User, error) {
	var user User

	err := c.DB().QueryRow(
		context.Background(),
		"SELECT id, email, password, name, phone, city, email_activation_token, phone_activation_token, created_at FROM users WHERE id = $1",
		id,
	).Scan(&user.ID, &user.Email, &user.Password, &user.Name, &user.Phone, &user.City, &user.EmailActivationToken, &user.PhoneActivationToken, &user.CreatedAt)

	return &user, err
}
