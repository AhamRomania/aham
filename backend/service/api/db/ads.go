package db

import (
	"aham/common/c"
	"aham/common/cdn"
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
)

type Location struct {
	Href        string    `json:"href,omitempty"`
	Text        string    `json:"text,omitempty"`
	Refs        []int64   `json:"refs,omitempty"`
	Coordinates []float64 `json:"coordinates,omitempty"`
}

type Ad struct {
	ID int64 `json:"id"`
	// Use Category.ID
	CategoryID int64     `json:"category_id,omitempty"`
	Category   *Category `json:"category,omitempty"`
	// Use Owner.ID
	OwnerID     int64     `json:"owner_id,omitempty"`
	Owner       *UserMin  `json:"owner,omitempty"`
	Slug        string    `json:"slug,omitempty"`
	Title       string    `json:"title,omitempty"`
	Description string    `json:"description,omitempty"`
	Pictures    []string  `json:"pictures,omitempty"`
	Price       int64     `json:"price,omitempty"`
	Currency    string    `json:"currency,omitempty"`
	CityID      int64     `json:"city,omitempty"`
	CityName    string    `json:"city_name,omitempty"`
	URL         *string   `json:"string,omitempty"`
	Href        string    `json:"href,omitempty"`
	Location    *Location `json:"location,omitempty"`
	Messages    bool      `json:"messages,omitempty"`
	ShowPhone   bool      `json:"show_phone,omitempty"`
	Phone       *string   `json:"phone,omitempty"`
	Props       *c.D      `json:"props,omitempty"`
	Status      string    `json:"status,omitempty"`
	Created     time.Time `json:"created,omitempty"`
}

func (ad *Ad) Save(tx pgx.Tx) error {

	if ad.CategoryID == 0 {
		return errors.New("alege o categorie validă")
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

	row := tx.QueryRow(
		context.Background(),
		`
		INSERT INTO ads 
			(
				slug,
				title,
				description,
				props,
				category,
				"owner",
				city,
				price,
				currency,
				pictures,
				status
			) 
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published')
		RETURNING id
		`,
		ad.Slug,
		ad.Title,
		ad.Description,
		ad.Props,
		ad.CategoryID,
		ad.OwnerID,
		ad.CityID,
		ad.Price,
		ad.Currency,
		ad.Pictures,
	)

	return row.Scan(&ad.ID)
}

func GetAds() (ads []*Ad) {

	ads = make([]*Ad, 0)

	rows, err := c.DB().Query(
		context.TODO(),
		`
		SELECT
			ads.id,
			ads.title,
			ads.description,
			ads.props,
			ads.pictures,
			CONCAT(counties.name, ' / ', cities.name) as location_text,
			lower(unaccent(CONCAT(counties.name, '/', cities.name))) as location_href,
			ARRAY[counties.id, cities.id] as location_refs,
			ads.price,
			ads.currency,
			ads.created_at,
			ads.url,
			ads.messages,
			ads.show_phone,
			ads.phone,
			ads.status,
			categories.id,
			categories.name,
			get_category_path(ads.category)::text AS category_path,
			get_category_href(ads.category)::text AS category_href,
			users.id,
			users.given_name,
			users.family_name,
			CONCAT(get_category_href(ads.category)::text, '/', ads.slug, '-', ads.id) as href
		FROM
			ads
		LEFT JOIN users ON users.id = ads.owner
		LEFT JOIN categories ON categories.id = ads.category
		LEFT JOIN cities ON cities.id = ads.city
		LEFT JOIN counties ON counties.id = cities.county
		WHERE
			ads.status = 'published'
		`,
	)

	if err != nil {
		c.Log().Error(err)
		return ads
	}

	for rows.Next() {

		ad := &Ad{
			Owner:    &UserMin{},
			Category: &Category{},
			Location: &Location{},
		}

		err = rows.Scan(
			&ad.ID,
			&ad.Title,
			&ad.Description,
			&ad.Props,
			&ad.Pictures,
			&ad.Location.Text,
			&ad.Location.Href,
			&ad.Location.Refs,
			&ad.Price,
			&ad.Currency,
			&ad.Created,
			&ad.URL,
			&ad.Messages,
			&ad.ShowPhone,
			&ad.Phone,
			&ad.Status,
			&ad.Category.ID,
			&ad.Category.Name,
			&ad.Category.Path,
			&ad.Category.Href,
			&ad.Owner.ID,
			&ad.Owner.GivenName,
			&ad.Owner.FamilyName,
			&ad.Href,
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

	ad = &Ad{
		Owner:    &UserMin{},
		Category: &Category{},
		Location: &Location{},
	}

	row := c.DB().QueryRow(
		context.TODO(),
		`
		SELECT
			ads.id,
			ads.title,
			ads.description,
			ads.props,
			ads.pictures,
			CONCAT(counties.name, ' / ', cities.name) as location_text,
			lower(unaccent(CONCAT(counties.name, '/', cities.name))) as location_href,
			ARRAY[counties.id, cities.id] as location_refs,
			ads.price,
			ads.currency,
			ads.created_at,
			ads.url,
			ads.messages,
			ads.show_phone,
			ads.phone,
			ads.status,
			categories.id,
			categories.name,
			get_category_path(ads.category)::text AS category_path,
			get_category_href(ads.category)::text AS category_href,
			users.id,
			users.given_name,
			users.family_name,
			CONCAT(get_category_href(ads.category)::text, '/', ads.slug,'-',ads.id) as href
		FROM
			ads
		LEFT JOIN users ON users.id = ads.owner
		LEFT JOIN categories ON categories.id = ads.category
		LEFT JOIN cities ON cities.id = ads.city
		LEFT JOIN counties ON counties.id = cities.county
		WHERE
			ads.id = $1 AND
			ads.status = 'published'
		LIMIT 1
		`,
		id,
	)

	err = row.Scan(
		&ad.ID,
		&ad.Title,
		&ad.Description,
		&ad.Props,
		&ad.Pictures,
		&ad.Location.Text,
		&ad.Location.Href,
		&ad.Location.Refs,
		&ad.Price,
		&ad.Currency,
		&ad.Created,
		&ad.URL,
		&ad.Messages,
		&ad.ShowPhone,
		&ad.Phone,
		&ad.Status,
		&ad.Category.ID,
		&ad.Category.Name,
		&ad.Category.Path,
		&ad.Category.Href,
		&ad.Owner.ID,
		&ad.Owner.GivenName,
		&ad.Owner.FamilyName,
		&ad.Href,
	)

	return
}
