package db

import (
	"aham/common/c"
	"aham/common/emails"
	"context"
	"time"
)

type User struct {
	ID                    int64      `json:"id"`
	Email                 string     `json:"email"`
	Password              string     `json:"-"`
	GivenName             string     `json:"given_name"`
	FamilyName            string     `json:"family_name"`
	Phone                 string     `json:"phone"`
	City                  int64      `json:"city"`
	Picture               *string    `json:"picture"`
	Source                string     `json:"source"`
	ThirdPartyAccessToken string     `json:"third_pary_access_token"`
	Settled               bool       `json:"settled"`
	EmailActivationToken  *string    `json:"email_activation_token"`
	PhoneActivationToken  *string    `json:"phone_activation_token"`
	EmailActivatedAt      *time.Time `json:"email_activated_at"`
	PhoneActivatedAt      *time.Time `json:"phone_activated_at"`
	CreatedAt             time.Time  `json:"created_at"`
}

func (user *User) Activated() bool {
	return user.EmailActivatedAt != nil
}

func (u *User) Recipient() *emails.UserRecipient {
	return emails.NewUserRecipient(u.GivenName, u.Email)
}

func (u *User) SetPicture(picture string) (err error) {
	_, err = c.DB().Exec(context.TODO(), `update users set picture = $1 where id = $2`, picture, u.ID)
	if err != nil {
		return err
	}
	return nil
}

func (u *User) Create() error {

	row := c.DB().QueryRow(
		context.Background(),
		`INSERT INTO users 
			(
				email,
				password,
				given_name,
				family_name,
				phone,
				city,
				source,
				third_pary_access_token,
				email_activation_token
			)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
		u.Email,
		u.Password,
		u.GivenName,
		u.FamilyName,
		u.Phone,
		u.City,
		u.Source,
		u.ThirdPartyAccessToken,
		u.EmailActivationToken,
	)

	err := row.Scan(&u.ID)

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

func GetUserByEmail(email string) (user *User, err error) {

	user = &User{}

	err = c.DB().QueryRow(
		context.TODO(),
		`SELECT
			id,
			email,
			password,
			given_name,
			family_name,
			phone,
			city,
			picture,
			email_activation_token,
			phone_activation_token,
			email_activated_at,
			created_at			
		FROM
			users
		WHERE
			email = $1`,
		email,
	).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.GivenName,
		&user.FamilyName,
		&user.Phone,
		&user.City,
		&user.Picture,
		&user.EmailActivationToken,
		&user.PhoneActivationToken,
		&user.EmailActivatedAt,
		&user.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return
}

func GetUserByID(id int64) *User {

	var user User = User{}

	row := c.DB().QueryRow(
		context.Background(),
		`SELECT
			id,
			email,
			password,
			given_name,
			family_name,
			phone,
			city,
			email_activation_token,
			phone_activation_token,
			created_at,
			email_activated_at
		FROM
			users
		WHERE
			id = $1`,
		id,
	)

	err := row.Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.GivenName,
		&user.FamilyName,
		&user.Phone,
		&user.City,
		&user.EmailActivationToken,
		&user.PhoneActivationToken,
		&user.CreatedAt,
		&user.EmailActivatedAt,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return &user
}
