package vo

import "aham/service/api/db"

type User struct {
	ID         int64   `json:"id"`
	Email      string  `json:"email,omitempty"`
	Role       string  `json:"role,omitempty"`
	GivenName  string  `json:"given_name,omitempty"`
	FamilyName string  `json:"family_name,omitempty"`
	Picture    *string `json:"picture,omitempty"`
}

func NewUser(u *db.User) User {
	return User{
		ID:         u.ID,
		Role:       u.Role,
		GivenName:  u.GivenName,
		FamilyName: u.FamilyName,
		Picture:    u.Picture,
	}
}
