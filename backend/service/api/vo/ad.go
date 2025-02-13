package vo

import (
	"aham/common/c"
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
