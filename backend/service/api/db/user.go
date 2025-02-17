package db

import (
	"aham/common/c"
	"aham/common/emails"
	"aham/service/api/sam"
	"context"
	"time"
)

type UserMin struct {
	ID         int64  `json:"id"`
	GivenName  string `json:"given_name,omitempty"`
	FamilyName string `json:"family_name,omitempty"`
}

type User struct {
	ID                    int64      `json:"id"`
	Email                 string     `json:"email,omitempty"`
	Password              string     `json:"-"`
	GivenName             string     `json:"given_name"`
	FamilyName            string     `json:"family_name"`
	Phone                 string     `json:"phone,omitempty"`
	City                  int64      `json:"city,omitempty"`
	Picture               *string    `json:"picture,omitempty"`
	Source                string     `json:"source,omitempty"`
	Role                  string     `json:"role,omitempty"`
	ThirdPartyAccessToken string     `json:"third_pary_access_token,omitempty"`
	Settled               bool       `json:"settled,omitempty"`
	EmailActivationToken  *string    `json:"email_activation_token,omitempty"`
	PhoneActivationToken  *string    `json:"phone_activation_token,omitempty"`
	EmailActivatedAt      *time.Time `json:"email_activated_at,omitempty"`
	PhoneActivatedAt      *time.Time `json:"phone_activated_at,omitempty"`
	CreatedAt             time.Time  `json:"created_at,omitempty"`
}

func (u *User) Min() UserMin {
	return UserMin{
		ID:         u.ID,
		GivenName:  u.GivenName,
		FamilyName: u.FamilyName,
	}
}

func (user *User) SamVerify(resource sam.Resource, permission sam.Perm) bool {

	if user == nil {
		panic("Expected User")
	}

	row := c.DB().QueryRow(
		context.TODO(),
		`
			select
				count(*),
				(permission & $3) as can
			from sam
				where user_id = $1 
				and resource_id = $2
			group by permission;
		`,
		user.ID,
		resource,
		permission,
	)

	var count int64
	var can sam.Perm

	if err := row.Scan(&count, &can); err != nil || count == 0 {
		return false
	}

	if can != permission {
		return false
	}

	return true
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
			role,
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
		&user.Role,
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
