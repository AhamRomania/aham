package vo

import "aham/service/api/db"

type User struct {
	ID         int64   `json:"id"`
	Email      string  `json:"email"`
	GivenName  string  `json:"given_name,omitempty"`
	FamilyName string  `json:"family_name,omitempty"`
	Picture    *string `json:"picture,omitempty"`
}

func NewUser(db db.User) User {
	return User{
		ID:         db.ID,
		Email:      db.Email,
		GivenName:  db.GivenName,
		FamilyName: db.FamilyName,
		Picture:    db.Picture,
	}
}
