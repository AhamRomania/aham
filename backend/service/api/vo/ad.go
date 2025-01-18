package vo

import (
	"aham/common/c"
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
	City        int64     `json:"city"`
	Props       *c.D      `json:"props,omitempty"`
	Created     time.Time `json:"created"`
}
