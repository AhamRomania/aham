package db

import (
	"aham/common/c"
	"aham/common/cdn"
	"context"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/pkg/errors"
)

type Status string

const (
	STATUS_DRAFT     Status = "draft"
	STATUS_PENDING   Status = "pending"
	STATUS_APPROVED  Status = "approved"
	STATUS_REJECTED  Status = "rejected"
	STATUS_PUBLISHED Status = "published"
	STATUS_COMPLETED Status = "completed"
	STATUS_ARCHIVED  Status = "archived"
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
	OwnerID      int64     `json:"owner_id,omitempty"`
	Owner        *UserMin  `json:"owner,omitempty"`
	Slug         string    `json:"slug,omitempty"`
	Title        string    `json:"title,omitempty"`
	Description  string    `json:"description,omitempty"`
	Pictures     []string  `json:"pictures,omitempty"`
	Price        int64     `json:"price,omitempty"`
	Currency     string    `json:"currency,omitempty"`
	CityID       int64     `json:"city,omitempty"`
	CityName     string    `json:"city_name,omitempty"`
	URL          *string   `json:"string,omitempty"`
	Href         string    `json:"href,omitempty"`
	Location     *Location `json:"location,omitempty"`
	Messages     bool      `json:"messages,omitempty"`
	ShowPhone    bool      `json:"show_phone,omitempty"`
	Promotion    bool      `json:"promotion,omitempty"`
	Phone        *string   `json:"phone,omitempty"`
	Props        *c.D      `json:"props,omitempty"`
	Status       Status    `json:"status,omitempty"`
	Created      time.Time `json:"created,omitempty"`
	Published    time.Time `json:"published,omitempty"`
	ValidThrough time.Time `json:"valid_through,omitempty"`
	Cycle        int       `json:"cycle,omitempty"`
}

func (ad *Ad) Reject() (err error) {

	cmd, err := c.DB().Exec(
		context.TODO(),
		`update ads set status = 'rejected' where id = $1`,
		ad.ID,
	)

	if err != nil {
		return errors.Wrap(err, "can't reject ad")
	}

	if cmd.RowsAffected() == 0 {
		return errors.Wrap(err, "didn't rejected ad")
	}

	ad.Status = STATUS_REJECTED

	return
}

func (ad *Ad) Accept(tx pgx.Tx) (err error) {

	cmd, err := tx.Exec(
		context.TODO(),
		`update ads set status = 'approved' where id = $1`,
		ad.ID,
	)

	if err != nil {
		return errors.Wrap(err, "can't accept ad")
	}

	if cmd.RowsAffected() == 0 {
		return errors.Wrap(err, "didn't accepted ad")
	}

	ad.Status = STATUS_APPROVED

	return
}

func (ad *Ad) PrePublish() (err error) {

	if ad.Status != STATUS_DRAFT {
		return errors.New("only draft status ads can be published")
	}

	cmd, err := c.DB().Exec(
		context.TODO(),
		`update ads set status = $1 where id = $2`,
		STATUS_PENDING,
		ad.ID,
	)

	if err != nil {
		return errors.Wrap(err, "can't publish ad")
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("nothing changed, can't publish ad")
	}

	return
}

func (ad *Ad) Publish(tx pgx.Tx, days int) (err error) {

	if ad.Status == STATUS_PENDING {
		return errors.New("can't publish before approved")
	}

	if ad.Status != STATUS_COMPLETED && ad.Status != STATUS_APPROVED {
		return errors.New("invalid state, only approved|completed -> published is accepted")
	}

	if ad.Published.After(time.Now()) {

		if ad.Status != STATUS_PUBLISHED {
			c.Log().Error("Ad is not published still published date is after now")
		}

		return errors.New("ad publish date is after now")
	}

	now := time.Now()
	validThrough := now.AddDate(0, 0, days)

	cmd, err := tx.Exec(
		context.TODO(),
		`update ads set status = $1, published = $2, valid_through = $3 where id = $4`,
		STATUS_PUBLISHED,
		now,
		validThrough,
		ad.ID,
	)

	if err != nil {
		return errors.Wrap(err, "can't publish ad")
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("nothing changed, can't publish ad")
	}

	row := tx.QueryRow(
		context.TODO(),
		`select id from transactions where owner = $1 and ad_id = $2 and ad_cycle = $3`,
		ad.Owner.ID,
		ad.ID,
		ad.Cycle,
	)

	var transactionID int64

	if err := row.Scan(&transactionID); err != nil {
		c.Log().Error("can't get transaction for ad:", ad.ID)
	}

	if transactionID > 0 {
		cmd, err := tx.Exec(
			context.TODO(),
			`
				update transactions set
					ad_from = $1,
					ad_to = $2
				where
					owner = $3 and
					ad_id = $4 and
					ad_cycle = $5
			`,
			now,
			validThrough,
			ad.Owner.ID,
			ad.ID,
			ad.Cycle,
		)

		if err != nil {
			c.Log().Error(err)
			return err
		}

		if cmd.RowsAffected() != 1 {
			return errors.New("can't update transaction for ad")
		}
	}

	return
}

// Check ad is completed and update
func (ad *Ad) CheckCompleted() (err error) {
	return
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
				pictures
			) 
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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

type Filter struct {
	Mode   string `json:"mode"`
	Limit  int64  `json:"limit"`
	Offset int64  `json:"offset"`
}

func GetPromotionAds(filter Filter) (ads []*Ad) {
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
			ads.created,
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
		LEFT JOIN transactions as t ON t.ad_id = ads.id
		WHERE
			ads.status = 'published' AND
			t.amount > 0
		ORDER BY ad_promotion_index(t.amount, ads.published, ads.valid_through) DESC
		LIMIT $1
		OFFSET $2
		`,
		filter.Limit,
		filter.Offset,
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

		ad.Promotion = true

		if err != nil {
			c.Log().Error(err)
			return ads
		}

		ads = append(ads, ad)
	}

	return ads
}

func GetRecommendedAds(filter Filter) (ads []*Ad) {
	return
}

func GetAds(filter Filter) (ads []*Ad) {

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
			ads.created,
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
			ads.status = $1
		ORDER BY ads.created DESC
		LIMIT $2
		OFFSET $3
		`,
		filter.Mode,
		filter.Limit,
		filter.Offset,
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
			ads.created,
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
			CONCAT(get_category_href(ads.category)::text, '/', ads.slug,'-',ads.id) as href,
			ads.cycle
		FROM
			ads
		LEFT JOIN users ON users.id = ads.owner
		LEFT JOIN categories ON categories.id = ads.category
		LEFT JOIN cities ON cities.id = ads.city
		LEFT JOIN counties ON counties.id = cities.county
		WHERE
			ads.id = $1
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
		&ad.Cycle,
	)

	return
}
