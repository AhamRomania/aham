package vo

import (
	"aham/common/c"
	"aham/service/api/db"
	"time"
)

type Ad struct {
	ID          int64     `json:"id"`
	Category    Category  `json:"category"`
	Owner       User      `json:"owner"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Pictures    []string  `json:"pictures"`
	Price       int64     `json:"price"`
	Currency    string    `json:"currency"`
	City        City      `json:"city"`
	Props       *c.D      `json:"props,omitempty"`
	Created     time.Time `json:"created"`
}

func AdFromDB(src *db.Ad) Ad {
	return Ad{
		ID:          src.ID,
		Category:    Category(*db.GetCategory(src.Category)),
		Owner:       UserFromDB(*db.GetUserByID(src.Owner)),
		Title:       src.Title,
		Description: src.Description,
		Pictures:    src.Pictures,
		Price:       src.Price,
		Currency:    src.Currency,
		City:        City(*db.GetCity(src.City)),
		Props:       src.Props,
		Created:     src.Created,
	}
}
