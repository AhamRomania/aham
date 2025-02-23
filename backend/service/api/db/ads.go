package db

import (
	"aham/common/c"
	"aham/common/cdn"
	"aham/common/emails"
	"aham/common/ws"
	. "aham/service/api/db/aham/public/table"
	"context"
	"fmt"
	"regexp"
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

type ListingPeriod struct {
	From        time.Time `json:"from"`
	To          time.Time `json:"to"`
	Cycle       int       `json:"cycle"`
	Transaction *int64    `json:"transaction"`
}

type Ad struct {
	ID int64 `json:"id"`
	// Use Category.ID
	CategoryID int64     `json:"category_id,omitempty"`
	Category   *Category `json:"category,omitempty"`
	// Use Owner.ID
	OwnerID      int64           `json:"owner_id,omitempty"`
	Owner        *UserMin        `json:"owner,omitempty"`
	Slug         string          `json:"slug,omitempty"`
	Title        string          `json:"title,omitempty"`
	Description  string          `json:"description,omitempty"`
	Pictures     []string        `json:"pictures,omitempty"`
	Price        int64           `json:"price,omitempty"`
	Currency     string          `json:"currency,omitempty"`
	CityID       int64           `json:"city,omitempty"`
	CityName     string          `json:"city_name,omitempty"`
	URL          *string         `json:"string,omitempty"`
	Href         string          `json:"href,omitempty"`
	Location     *Location       `json:"location,omitempty"`
	Messages     bool            `json:"messages,omitempty"`
	ShowPhone    bool            `json:"show_phone,omitempty"`
	Promotion    bool            `json:"promotion,omitempty"`
	Phone        *string         `json:"phone,omitempty"`
	Props        *c.D            `json:"props,omitempty"`
	Status       Status          `json:"status,omitempty"`
	History      []ListingPeriod `json:"history,omitempty"`
	Favourite    bool            `json:"favourite,omitempty"`
	Created      time.Time       `json:"created,omitempty"`
	Published    *time.Time      `json:"published,omitempty"`
	ValidThrough *time.Time      `json:"valid_through,omitempty"`
	Cycle        int             `json:"cycle,omitempty"`
}

type Transaction struct {
	ID       int64     `json:"id"`
	Owner    *UserMin  `json:"owner,omitempty"`
	Ad       int64     `json:"ad,omitempty"`
	Cycle    int       `json:"cycle,omitempty"`
	From     time.Time `json:"from,omitempty"`
	To       time.Time `json:"to,omitempty"`
	Amount   int64     `json:"amount,omitempty"`
	Created  time.Time `json:"created,omitempty"`
	Approved time.Time `json:"approved,omitempty"`
}

// Get transaction by the cycle ID from self or history
func (ad *Ad) GetTransaction(cycle int) (t *Transaction) {

	t = &Transaction{
		Owner: &UserMin{},
	}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		`select
			t.id,
			u.id as user_id,
			u.given_name as given_name,
			u.family_name as family_name,
			t.ad_id,
			t.ad_cycle,
			t.ad_from,
			t.ad_to,
			t.amount,
			t.created,
			t.approved
		from
			transactions as t
		left join users as u on u.id = t.owner
		where
			owner = $1 and
			ad_id = $2 and
			ad_cycle = $3
		`,
		ad.Owner.ID,
		ad.ID,
		ad.Cycle,
	)

	err := row.Scan(
		&t.ID,
		&t.Owner.ID,
		&t.Owner.GivenName,
		&t.Owner.FamilyName,
		&t.Ad,
		&t.Cycle,
		&t.From,
		&t.To,
		&t.Amount,
		&t.Created,
		&t.Approved,
	)

	if err != nil {
		return nil
	}

	return
}

func (ad *Ad) Clone() (clone *Ad, err error) {

	conn := c.DB()
	defer conn.Release()

	tx, err := conn.BeginTx(
		context.TODO(),
		pgx.TxOptions{},
	)

	if err != nil {
		return nil, err
	}

	err = ad.Save(tx)
	clone = ad
	return
}

func (ad *Ad) Delete() (err error) {

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		`delete from ads where id = $1`,
		ad.ID,
	)

	if err != nil {
		return err
	}

	return
}

func (ad *Ad) Reject() (err error) {

	if ad.Status == STATUS_REJECTED {
		return errors.New("already rejected")
	}

	conn := c.DB()
	defer conn.Release()

	cmd, err := conn.Exec(
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

	if ad.Status != STATUS_PENDING {
		return errors.New("only pending ads can be approved")
	}

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

	// send first on socket
	err = ws.Send(ad.Owner.ID, ws.NewEvent("ad.approve", &c.D{
		"ad":    ad.ID,
		"title": ad.Title,
	}))

	// fallback on email
	if err != nil {
		emails.OnAdApproved(
			GetUserByID(ad.Owner.ID).Recipient(),
			emails.OnAdApprovedProps{
				Title: ad.Title,
				Href:  c.URLF(c.Web, "/u/anunturi?id=%d", ad.ID),
			},
		)
	}

	return
}

func (ad *Ad) PrePublish() (err error) {

	if ad.Status != STATUS_DRAFT {
		return errors.New("only draft status ads can be published")
	}

	conn := c.DB()
	defer conn.Release()

	cmd, err := conn.Exec(
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

func (ad *Ad) Publish(tx pgx.Tx) (err error) {

	if ad.Status == STATUS_PUBLISHED {
		return errors.New("already published")
	}

	user := GetUserByID(ad.Owner.ID)

	if user == nil {
		return errors.New("user expected")
	}

	active := GetAds(user.ID, Filter{
		Mode:  "published",
		Owner: &user.ID,
	})

	if len(active)+1 > user.Meta.GetInt(UserPrefActiveAds, 2) {
		return errors.New("ads limit exceeded")
	}

	if ad.Status == STATUS_PENDING {
		return errors.New("can't publish before approved")
	}

	if ad.Status != STATUS_COMPLETED && ad.Status != STATUS_APPROVED {
		return errors.New("invalid state, only approved|completed -> published is accepted")
	}

	now := time.Now()

	adLifetimeMinutes := user.Meta.GetInt(UserPrefAdLifetime, 24*7)

	validThrough := now.Add(time.Duration(adLifetimeMinutes) * time.Minute)

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

	transaction := ad.GetTransaction(ad.Cycle)

	if transaction != nil {
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
			c.Log().Error(err)
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
	Query    *string `json:"query"`
	Mode     string  `json:"mode"`
	Limit    *int64  `json:"limit"`
	Offset   *int64  `json:"offset"`
	Category *int64  `json:"category"`
	Owner    *int64  `json:"owner"`
}

func GetPromotionAds(me int64, filter Filter) (ads []*Ad) {
	ads = make([]*Ad, 0)

	smtp := getAdSqlBuilder(me).WHERE(
		Ads.Status.EQ(String("published")).AND(
			Transactions.Amount.GT(Float(0)),
		),
	).ORDER_BY(
		Raw("ad_promotion_index(transactions.amount, ads.published, ads.valid_through) DESC"),
	).WHERE(
		BoolExp(Raw("ad_promotion_index(transactions.amount, ads.published, ads.valid_through) > 0")),
	)

	if filter.Limit != nil && *filter.Limit > 0 {
		smtp = smtp.LIMIT(*filter.Limit)
	}

	if filter.Offset != nil && *filter.Offset >= 0 {
		smtp = smtp.OFFSET(*filter.Offset)
	}

	sql, params := smtp.Sql()

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(context.TODO(), sql, params...)

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

func GetFavouriteAds(me int64, offset, limit int64) (ads []*Ad) {

	if limit == 0 {
		limit = 10000 //todo
	}

	ads = make([]*Ad, 0)

	stmt := Ads.SELECT(
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
		Raw("ad_promotion_index(COALESCE(transactions.amount, 0), ads.published, ads.valid_through) > 0 as promotion"),
		Ads.Cycle,
		Ads.Published,
		Ads.ValidThrough,
		Raw("(EXISTS (SELECT 1 FROM favourites WHERE favourites.ad_id = ads.id AND favourites.user_id = USERID)) AS favourite", map[string]interface{}{"USERID": me}),
	).FROM(
		Ads.AS("ads").LEFT_JOIN(Users.AS("users").Table, Users.ID.EQ(Ads.Owner)).
			LEFT_JOIN(Categories.AS("categories").Table, Categories.ID.EQ(Ads.Category)).
			LEFT_JOIN(Cities.AS("cities").Table, Cities.ID.EQ(Ads.City)).
			LEFT_JOIN(Counties.AS("counties").Table, Counties.ID.EQ(Cities.County)).
			LEFT_JOIN(Transactions.AS("transactions").Table, Transactions.AdID.EQ(Ads.ID)).
			LEFT_JOIN(Favourites.Table, Favourites.AdID.EQ(Ads.ID)),
	).ORDER_BY(
		Raw("ad_promotion_index(COALESCE(transactions.amount, 0), ads.published, ads.valid_through) DESC"),
	).WHERE(
		Favourites.UserID.EQ(Int64(me)),
	).OFFSET(
		offset,
	).LIMIT(
		limit,
	)

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
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

func GetAds(me int64, filter Filter) (ads []*Ad) {

	if filter.Mode == "" {
		filter.Mode = "published"
	}

	ads = make([]*Ad, 0)

	stmt := getAdSqlBuilder(me)

	if filter.Limit != nil && *filter.Limit > 0 {
		stmt = stmt.LIMIT(*filter.Limit)
	}

	if filter.Offset != nil && *filter.Offset >= 0 {
		stmt = stmt.OFFSET(*filter.Offset)
	}

	var where []BoolExpression = make([]BoolExpression, 0)

	if filter.Mode == "published" {

		where = append(where, Ads.Status.EQ(
			String(string(STATUS_PUBLISHED)),
		))

		where = append(where, Ads.ValidThrough.GT(
			TimestampT(time.Now()),
		))
	} else if filter.Mode != "" {
		where = append(where, Ads.Status.EQ(String(filter.Mode)))
	}

	if filter.Owner != nil {
		where = append(where, Ads.Owner.EQ(Int64(*filter.Owner)))
	}

	if filter.Query != nil && *filter.Query != "" {
		query := StringExp(Raw(fmt.Sprintf("'%s'", regexp.QuoteMeta(*filter.Query))))
		where = append(where, Ads.Title.REGEXP_LIKE(query).OR(Ads.Description.REGEXP_LIKE(query)))
	}

	if filter.Category != nil {

		root := Category{
			Name:     "root",
			Children: GetCategoryTree(GetCategoriesFlat(), nil),
		}

		var ids []Expression = make([]Expression, 0)

		for _, cur := range root.InIDS(*filter.Category) {
			ids = append(ids, Int64(cur))
		}

		where = append(where, Ads.Category.IN(ids...))
	}

	stmt = stmt.WHERE(AND(where...))

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
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

func GetAdCount(filter Filter) (count int64) {

	stmt := Ads.SELECT(
		Raw("count(*)"),
	)

	var where []BoolExpression = make([]BoolExpression, 0)

	if filter.Mode == "published" {

		where = append(where, Ads.Status.EQ(
			String(string(STATUS_PUBLISHED)),
		))

		where = append(where, Ads.ValidThrough.GT(
			TimestampT(time.Now()),
		))
	} else if filter.Mode != "" {
		where = append(where, Ads.Status.EQ(String(filter.Mode)))
	}

	if filter.Owner != nil {
		where = append(where, Ads.Owner.EQ(Int64(*filter.Owner)))
	}

	if filter.Query != nil && *filter.Query != "" {
		query := StringExp(Raw(fmt.Sprintf("'%s'", regexp.QuoteMeta(*filter.Query))))
		where = append(where, Ads.Title.REGEXP_LIKE(query).OR(Ads.Description.REGEXP_LIKE(query)))
	}

	if filter.Category != nil {

		root := Category{
			Name:     "root",
			Children: GetCategoryTree(GetCategoriesFlat(), nil),
		}

		var ids []Expression = make([]Expression, 0)

		for _, cur := range root.InIDS(*filter.Category) {
			ids = append(ids, Int64(cur))
		}

		where = append(where, Ads.Category.IN(ids...))
	}

	stmt = stmt.WHERE(AND(where...))

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		sql,
		params...,
	)

	if err := row.Scan(&count); err != nil {
		return 0
	}

	return
}

func GetFavouriteCount(owner int64) (count int64) {

	stmt := Favourites.SELECT(
		Raw("count(*)"),
	).WHERE(
		Favourites.UserID.EQ(Int64(owner)),
	)

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		sql,
		params...,
	)

	if err := row.Scan(&count); err != nil {
		return 0
	}

	return
}

func GetAdCounts(owner int64) *c.D {
	return &c.D{
		"drafts":    GetAdCount(Filter{Mode: "draft", Owner: &owner}),
		"pending":   GetAdCount(Filter{Mode: "pending", Owner: &owner}),
		"rejected":  GetAdCount(Filter{Mode: "rejected", Owner: &owner}),
		"fixing":    GetAdCount(Filter{Mode: "fixing", Owner: &owner}),
		"published": GetAdCount(Filter{Mode: "published", Owner: &owner}),
		"completed": GetAdCount(Filter{Mode: "completed", Owner: &owner}),
		"favourite": GetFavouriteCount(owner),
	}
}

func GetAd(me int64, id int64) (ad *Ad) {

	ad = &Ad{
		Owner:    &UserMin{},
		Category: &Category{},
		Location: &Location{},
	}

	sql, params := getAdSqlBuilder(me).WHERE(
		Ads.ID.EQ(Int64(id)),
	).Sql()

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		sql,
		params...,
	)

	if err := scanAd(row, ad); err != nil {
		c.Log().Error(err)
		return nil
	}

	return
}

func getAdSqlBuilder(me int64) SelectStatement {
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
		Raw("CONCAT('/',get_category_href(ads.category)::text, '/', ads.slug, '-', ads.id) as href"),
		Raw("ad_promotion_index(COALESCE(transactions.amount, 0), ads.published, ads.valid_through) > 0 as promotion"),
		Ads.Cycle,
		Ads.Published,
		Ads.ValidThrough,
		Raw("(EXISTS (SELECT 1 FROM favourites WHERE favourites.ad_id = ads.id AND favourites.user_id = USERID)) AS favourite", map[string]interface{}{"USERID": me}),
	).FROM(
		Ads.AS("ads").LEFT_JOIN(Users.AS("users").Table, Users.ID.EQ(Ads.Owner)).
			LEFT_JOIN(Categories.AS("categories").Table, Categories.ID.EQ(Ads.Category)).
			LEFT_JOIN(Cities.AS("cities").Table, Cities.ID.EQ(Ads.City)).
			LEFT_JOIN(Counties.AS("counties").Table, Counties.ID.EQ(Cities.County)).
			LEFT_JOIN(Transactions.AS("transactions").Table, Transactions.AdID.EQ(Ads.ID)),
	).ORDER_BY(
		Raw("ad_promotion_index(COALESCE(transactions.amount, 0), ads.published, ads.valid_through) DESC"),
	)
}

type SQLScanner interface {
	Scan(dest ...any) error
}

func scanAd(scanner SQLScanner, ad *Ad) (err error) {

	var promotion *bool

	err = scanner.Scan(
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
		&promotion,
		&ad.Cycle,
		&ad.Published,
		&ad.ValidThrough,
		&ad.Favourite,
	)

	if promotion != nil {
		ad.Promotion = *promotion
	}

	return
}

func (ad *Ad) Finish() (err error) {

	if ad.Status != STATUS_PUBLISHED {
		return errors.New("ad must be published")
	}

	if ad.Published == nil {
		return errors.New("published date can't be null")
	}

	if ad.ValidThrough == nil {
		return errors.New("valid_through date can't be null")
	}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		`select history from ads where id = $1`,
		ad.ID,
	)

	if err := row.Scan(&ad.History); err != nil {
		return err
	}

	historyGap := ListingPeriod{
		From:  *ad.Published,
		To:    *ad.ValidThrough,
		Cycle: ad.Cycle,
	}

	if transaction := ad.GetTransaction(ad.Cycle); transaction != nil {
		historyGap.Transaction = &transaction.ID
	}

	ad.History = append(ad.History, historyGap)

	cmd, err := conn.Exec(
		context.TODO(),
		`
		update ads set
			cycle = cycle + 1,
			status = 'completed',
			published = null,
			valid_through = null,
			history = $1
		where
			id = $2
		`,
		ad.History,
		ad.ID,
	)

	if err != nil {
		return err
	}

	if cmd.RowsAffected() == 0 {
		return errors.New("nothin updated")
	}

	go func() {

		// send on socket first
		err = ws.Send(ad.Owner.ID, ws.NewEvent("ad.complete", &c.D{
			"ad":    ad.ID,
			"title": ad.Title,
		}))

		// fallback to email
		if err != nil {
			emails.OnAdCompleted(
				GetUserByID(ad.Owner.ID).Recipient(),
				emails.OnAdCompletedParams{
					Title: ad.Title,
					Href:  c.URLF(c.Web, "/u/anunturi/disponibile?id=%d", ad.ID),
				},
			)
		}
	}()

	return
}
