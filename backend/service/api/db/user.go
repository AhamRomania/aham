package db

import (
	"aham/common/c"
	"aham/common/emails"
	"aham/service/api/sam"
	"context"
	"strings"
	"time"
)

type UserMin struct {
	ID         int64  `json:"id"`
	GivenName  string `json:"given_name,omitempty"`
	FamilyName string `json:"family_name,omitempty"`
}

type UserPref string

const (
	// Number of published ads
	UserPrefActiveAds UserPref = "active_ads"
	// Ad lifetime in minutes
	UserPrefAdLifetime UserPref = "ad_lifetime"
)

type UserPreferences map[UserPref]any

func (up UserPreferences) GetInt(key UserPref, def int) (res int) {
	if value, exists := up[key]; exists {
		return int(value.(float64))
	}
	return def
}

type User struct {
	ID                    int64           `json:"id"`
	Email                 string          `json:"email,omitempty"`
	Password              string          `json:"-"`
	GivenName             string          `json:"given_name"`
	FamilyName            string          `json:"family_name"`
	Phone                 string          `json:"phone,omitempty"`
	City                  int64           `json:"city,omitempty"`
	Picture               *string         `json:"picture,omitempty"`
	Source                string          `json:"source,omitempty"`
	Role                  string          `json:"role,omitempty"`
	ThirdPartyAccessToken string          `json:"third_pary_access_token,omitempty"`
	Settled               bool            `json:"settled,omitempty"`
	EmailActivationToken  *string         `json:"email_activation_token,omitempty"`
	PhoneActivationToken  *string         `json:"phone_activation_token,omitempty"`
	EmailActivatedAt      *time.Time      `json:"email_activated_at,omitempty"`
	PhoneActivatedAt      *time.Time      `json:"phone_activated_at,omitempty"`
	Preferences           UserPreferences `json:"preferences,omitempty"`
	CreatedAt             time.Time       `json:"created_at,omitempty"`
}

func (u *User) Min() UserMin {
	return UserMin{
		ID:         u.ID,
		GivenName:  u.GivenName,
		FamilyName: u.FamilyName,
	}
}

func (user *User) Balance() (balance float64, err error) {

	conn := c.DB()
	defer conn.Release()

	err = conn.QueryRow(
		context.TODO(),
		"SELECT balance FROM balance WHERE owner = $1 ORDER BY id desc",
		user.ID,
	).Scan(&balance)

	if err != nil && !strings.Contains(err.Error(), "no rows") {
		return balance, err
	}

	return balance, nil
}

func (user *User) UpdateBalance(description string, debit float64, credit float64) (err error) {

	balance, err := user.Balance()

	if err != nil {
		return err
	}

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.Background(),
		"INSERT INTO balance (owner, date, description, debit, credit, balance) VALUES ($1, $2, $3, $4, $5, $6)",
		user.ID,
		time.Now(),
		description,
		debit,
		credit,
		balance+credit-debit,
	)

	if err != nil {
		return err
	}

	return nil
}

func (user *User) SamVerify(resource sam.Resource, permission sam.Perm) bool {

	if user == nil {
		panic("Expected User")
	}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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
	conn := c.DB()
	defer conn.Release()
	_, err = conn.Exec(context.TODO(), `update users set picture = $1 where id = $2`, picture, u.ID)
	if err != nil {
		return err
	}
	return nil
}

func (u *User) Create() error {

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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
				email_activation_token,
				preferences
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
		u.Preferences,
	)

	err := row.Scan(&u.ID)

	return err
}

// VerifyEmailExists checks if the email exists in the database
func VerifyEmailExists(email string) bool {

	var found int
	conn := c.DB()
	defer conn.Release()

	conn.QueryRow(
		context.Background(),
		"SELECT count(email) FROM users WHERE email = $1",
		email,
	).Scan(&found)

	return found > 0
}

func GetUserByEmail(email string) (user *User, err error) {

	user = &User{}
	conn := c.DB()
	defer conn.Release()

	err = conn.QueryRow(
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

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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
			email_activated_at,
			preferences
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
		&user.Preferences,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return &user
}
