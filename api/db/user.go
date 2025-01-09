package db

import (
	"aham/c"
	"context"
)

type User struct {
	ID              int    `json:"id"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	Name            string `json:"name"`
	Phone           string `json:"phone"`
	City            int64  `json:"city"`
	EmailActivation string `json:"email_activation"`
	PhoneActivation string `json:"phone_activation"`
	RegisteredAt    string `json:"registered_at"`
}

func (u *User) Create() error {
	_, err := c.DB().Exec(
		context.Background(),
		"INSERT INTO users (email, password, name, phone, city) VALUES ($1, $2, $3, $4, $5)",
		u.Email, u.Password, u.Name, u.Phone, u.City,
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
