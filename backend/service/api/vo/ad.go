package vo

import (
	"aham/common/c"
	"aham/service/api/db"
	"time"
)

type Ad struct {
	ID           int64     `json:"id"`
	Category     Category  `json:"category,omitempty"`
	CategoryPath string    `json:"category_path,omitempty"`
	CategoryHref string    `json:"category_href,omitempty"`
	Owner        User      `json:"owner,omitempty"`
	Title        string    `json:"title,omitempty"`
	Description  string    `json:"description,omitempty"`
	Pictures     []string  `json:"pictures,omitempty"`
	Price        int64     `json:"price,omitempty"`
	Currency     string    `json:"currency,omitempty"`
	City         City      `json:"city,omitempty"`
	URL          *string   `json:"url,omitempty"`
	Props        *c.D      `json:"props,omitempty"`
	Status       string    `json:"status,omitempty"`
	Created      time.Time `json:"created,omitempty"`
}

func NewAd(src *db.Ad) Ad {

	c := *db.GetCategory(src.CategoryID)

	return Ad{
		ID: src.ID,
		Category: Category{
			ID:          c.ID,
			Name:        c.Name,
			Description: c.Description,
			Pricing:     c.Pricing,
		},
		Owner:        NewUser(db.GetUserByID(src.Owner)),
		Title:        src.Title,
		Description:  src.Description,
		Pictures:     src.Pictures,
		Price:        src.Price,
		Currency:     src.Currency,
		City:         City(*db.GetCity(src.CityID)),
		URL:          src.URL,
		Props:        src.Props,
		Status:       src.Status,
		Created:      src.Created,
		CategoryPath: src.CategoryPath,
		CategoryHref: src.CategoryHref,
	}
}
