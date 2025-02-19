package db

import (
	"aham/common/c"
	"aham/common/cdn"
	. "aham/service/api/db/aham/public/table"
	"context"
	"time"

	. "github.com/go-jet/jet/v2/postgres"
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
	Mode     string `json:"mode"`
	Limit    int64  `json:"limit"`
	Offset   int64  `json:"offset"`
	Category *int64 `json:"category"`
}

func GetPromotionAds(filter Filter) (ads []*Ad) {
	ads = make([]*Ad, 0)

	sql, params := getAdSqlBuilder().WHERE(
		Ads.Status.EQ(String("published")).AND(
			Transactions.Amount.GT(Float(0)),
		),
	).ORDER_BY(
		Raw("ad_promotion_index(t.amount, ads.published, ads.valid_through) DESC"),
	).LIMIT(
		filter.Limit,
	).OFFSET(
		filter.Offset,
	).Sql()

	rows, err := c.DB().Query(context.TODO(), sql, params...)

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

		err = scanAd(rows, ad)

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

	smtp := getAdSqlBuilder().WHERE(
		Ads.Status.EQ(String(filter.Mode)),
	).ORDER_BY(
		Ads.Created.DESC(),
	).LIMIT(
		filter.Limit,
	).OFFSET(
		filter.Offset,
	)

	if filter.Category != nil {

		root := Category{
			Name:     "root",
			Children: GetCategoryTree(GetCategoriesFlat(), nil),
		}

		var ids []Expression = make([]Expression, 0)

		for _, cur := range root.InIDS(*filter.Category) {
			ids = append(ids, Int64(cur))
		}

		smtp = smtp.WHERE(Ads.Category.IN(ids...))
	}

	sql, params := smtp.Sql()

	rows, err := c.DB().Query(
		context.Background(),
		sql,
		params...,
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

		err = scanAd(rows, ad)

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

	sql, params := getAdSqlBuilder().WHERE(
		Ads.ID.EQ(Int64(id)),
	).Sql()

	row := c.DB().QueryRow(
		context.TODO(),
		sql,
		params...,
	)

	err = scanAd(row, ad)

	return
}

func getAdSqlBuilder() SelectStatement {
	return Ads.SELECT(
		Ads.ID,
		Ads.Title,
		Ads.Description,
		Ads.Props,
		Ads.Pictures,
		Raw("CONCAT(counties.name,' / ',cities.name) as location_text"),
		Raw("lower(unaccent(CONCAT(counties.name, '/', cities.name))) as location_href"),
		Raw("ARRAY[counties.id, cities.id] as location_refs"),
		Ads.Price,
		Ads.Currency,
		Ads.Created,
		Ads.URL,
		Ads.Messages,
		Ads.ShowPhone,
		Ads.Phone,
		Ads.Status,
		Categories.ID,
		Categories.Name,
		Raw("get_category_path(ads.category)::text AS category_path"),
		Raw("get_category_href(ads.category)::text AS category_href"),
		Raw("users.id"),
		Raw("users.given_name"),
		Raw("users.family_name"),
		Raw("CONCAT(get_category_href(ads.category)::text, '/', ads.slug, '-', ads.id) as href"),
	).FROM(
		Ads.AS("ads").LEFT_JOIN(Users.AS("users").Table, Users.ID.EQ(Ads.Owner)).
			LEFT_JOIN(Categories.AS("categories").Table, Categories.ID.EQ(Ads.Category)).
			LEFT_JOIN(Cities.AS("cities").Table, Cities.ID.EQ(Ads.City)).
			LEFT_JOIN(Counties.AS("counties").Table, Counties.ID.EQ(Cities.County)).
			LEFT_JOIN(Transactions.AS("transactions").Table, Transactions.AdID.EQ(Ads.ID)),
	)
}

type SQLScanner interface {
	Scan(dest ...any) error
}

func scanAd(scanner SQLScanner, ad *Ad) (err error) {
	return scanner.Scan(
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
}
