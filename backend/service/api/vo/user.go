package vo

type User struct {
	ID         int64   `json:"id"`
	Email      string  `json:"email"`
	GivenName  string  `json:"given_name"`
	FamilyName string  `json:"family_name"`
	Picture    *string `json:"picture"`
}
