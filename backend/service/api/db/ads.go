package db

import (
	"aham/common/c"
	"aham/common/cdn"
	"context"
	"errors"
	"time"
)

type Ad struct {
	ID          int64     `json:"id"`
	Category    int64     `json:"category,omitempty"`
	Owner       int64     `json:"owner,omitempty"`
	Title       string    `json:"title,omitempty"`
	Description string    `json:"description,omitempty"`
	Pictures    []string  `json:"pictures,omitempty"`
	Price       int64     `json:"price,omitempty"`
	Currency    string    `json:"currency,omitempty"`
	City        int64     `json:"city,omitempty"`
	URL         *string   `json:"string,omitempty"`
	Messages    bool      `json:"messages,omitempty"`
	ShowPhone   bool      `json:"show_phone,omitempty"`
	Phone       *string   `json:"phone,omitempty"`
	Props       *c.D      `json:"props,omitempty"`
	Status      string    `json:"status,omitempty"`
	Created     time.Time `json:"created,omitempty"`
}

func (ad *Ad) Save() error {

	if ad.Category == 0 {
		return errors.New("alege o categorie validă")
	}

	if ad.City == 0 {
		return errors.New("alege un oraș valid")
	}

	if ad.Title == "" {
		return errors.New("titlul este obligatoriu")
	}

	if ad.Description == "" {
		return errors.New("descrierea este obligatorie")
	}

	if ad.Currency == "" {
		ad.Currency = "RON"
	}

	if len(ad.Pictures) == 0 {
		return errors.New("adaugă o imagine")
	}

	for _, upload := range ad.Pictures {
		if err := cdn.Persist(upload); err != nil {
			return err
		}
	}

	_, err := c.DB().Exec(
		context.Background(),
		`INSERT INTO ads (title, description, category, "owner", city, price, currency, pictures) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		ad.Title,
		ad.Description,
		ad.Category,
		ad.Owner,
		ad.City,
		ad.Price,
		ad.Currency,
		ad.Pictures,
	)

	return err
}

func GetAd(id int64) (ad *Ad, err error) {

	ad = &Ad{}

	row := c.DB().QueryRow(
		context.TODO(),
		`
		SELECT
			id,
			category,
			owner,
			title,
			description,
			pictures,
			city,
			price,
			currency,
			created_at,
			url,
			messages,
			show_phone,
			phone,
			status
		FROM
			ads
		WHERE
			id = $1 AND
			status = 'published'
		LIMIT 1
		`,
		id,
	)

	err = row.Scan(
		&ad.ID,
		&ad.Category,
		&ad.Owner,
		&ad.Title,
		&ad.Description,
		&ad.Pictures,
		&ad.City,
		&ad.Price,
		&ad.Currency,
		&ad.Created,
		&ad.URL,
		&ad.Messages,
		&ad.ShowPhone,
		&ad.Phone,
		&ad.Status,
	)

	return
}
