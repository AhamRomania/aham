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
	CategoryID  int64     `json:"category_id,omitempty"`
	Category    *Category `json:"category,omitempty"`
	Owner       int64     `json:"owner,omitempty"`
	Slug        string    `json:"slug,omitempty"`
	Title       string    `json:"title,omitempty"`
	Description string    `json:"description,omitempty"`
	Pictures    []string  `json:"pictures,omitempty"`
	Price       int64     `json:"price,omitempty"`
	Currency    string    `json:"currency,omitempty"`
	CityID      int64     `json:"city,omitempty"`
	CityName    string    `json:"city_name,omitempty"`
	URL         *string   `json:"string,omitempty"`
	Messages    bool      `json:"messages,omitempty"`
	ShowPhone   bool      `json:"show_phone,omitempty"`
	Phone       *string   `json:"phone,omitempty"`
	Props       *c.D      `json:"props,omitempty"`
	Status      string    `json:"status,omitempty"`
	Created     time.Time `json:"created,omitempty"`
}

func (ad *Ad) Save() error {

	if ad.CategoryID == 0 {
		return errors.New("alege o categorie validă")
	}

	if ad.CityID == 0 {
		return errors.New("alege un oraș valid")
	}

	if ad.Title == "" {
		return errors.New("titlul este obligatoriu")
	}

	if ad.Description == "" {
		return errors.New("descrierea este obligatorie")
	}

	if ad.Currency == "" {
		ad.Currency = "LEI"
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
		`INSERT INTO ads (slug, title, description, category, "owner", city, price, currency, pictures) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		ad.Slug,
		ad.Title,
		ad.Description,
		ad.CategoryID,
		ad.Owner,
		ad.CityID,
		ad.Price,
		ad.Currency,
		ad.Pictures,
	)

	return err
}

func GetAds() (ads []*Ad) {

	ads = make([]*Ad, 0)

	rows, err := c.DB().Query(
		context.TODO(),
		`
		SELECT
			ads.id,
			ads.category,
			categories.id,
			categories.name,
			categories.slug,
			ads.owner,
			ads.slug,
			ads.title,
			ads.description,
			ads.pictures,
			ads.city,
			CONCAT(counties.name, '/', cities.name) as city_name,
			ads.price,
			ads.currency,
			ads.created_at,
			ads.url,
			ads.messages,
			ads.show_phone,
			ads.phone,
			ads.status
		FROM
			ads
		LEFT JOIN cities ON cities.id = ads.city
		LEFT JOIN counties ON counties.id = cities.county
		LEFT JOIN categories ON categories.id = ads.category
		WHERE
			status = 'published'
		`,
	)

	if err != nil {
		c.Log().Error(err)
		return ads
	}

	for rows.Next() {

		ad := &Ad{
			Category: &Category{},
		}

		err = rows.Scan(
			&ad.ID,
			&ad.CategoryID,
			&ad.Category.ID,
			&ad.Category.Name,
			&ad.Category.Slug,
			&ad.Owner,
			&ad.Slug,
			&ad.Title,
			&ad.Description,
			&ad.Pictures,
			&ad.CityID,
			&ad.CityName,
			&ad.Price,
			&ad.Currency,
			&ad.Created,
			&ad.URL,
			&ad.Messages,
			&ad.ShowPhone,
			&ad.Phone,
			&ad.Status,
		)

		if err != nil {
			c.Log().Error(err)
			return ads
		}

		ads = append(ads, ad)
	}

	return ads
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
			CONCAT(counties.name, '/', cities.name) as city_name,
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
		LEFT JOIN cities ON cities.id = ads.city
		LEFT JOIN counties ON counties.id = cities.county
		WHERE
			id = $1 AND
			status = 'published'
		LIMIT 1
		`,
		id,
	)

	err = row.Scan(
		&ad.ID,
		&ad.CategoryID,
		&ad.Owner,
		&ad.Title,
		&ad.Description,
		&ad.Pictures,
		&ad.CityID,
		&ad.CityName,
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
