package route

import (
	"aham/common/c"
	"aham/common/cdn"
	"aham/common/emails"
	"aham/common/ws"
	"aham/service/api/db"
	"aham/service/api/sam"
	"aham/service/api/types"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/jackc/pgx/v5"
)

type CreateAdRequest struct {
	Category    int64    `json:"category"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Price       int64    `json:"price"`
	Currency    string   `json:"currency"`
	Pictures    []string `json:"pictures"`
	URL         *string  `json:"url"`
	Messages    bool     `json:"messages"`
	ShowPhone   bool     `json:"show_phone"`
	Phone       *string  `json:"phone"`
	Props       *c.D     `json:"props"`
}

func AdsRoutes(r chi.Router) {
	r.Post("/", c.Guard(CreateAd))
	r.Get("/", GetAds)
	r.Get("/counts", c.Guard(GetAdCounts))
	r.Get("/{id}", GetAd)
	r.Delete("/{id}", c.Guard(RemoveAd))
	r.Post("/{id}/reject", c.Guard(reject))
	r.Post("/{id}/approve", c.Guard(approve))
	r.Post("/{id}/publish", c.Guard(publish))
	r.Get("/{id}/contact", c.Guard(getContactDetails))
	r.Get("/{id}/metrics", getAdMetrics)
	r.Post("/{id}/favourite", c.Guard(favouriteCreate))
	r.Delete("/{id}/favourite", c.Guard(favouriteDelete))
	r.Get("/favourites", c.Guard(getMyFavouriteAds))
}

func GetAdCounts(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, db.GetAdCounts(userID))
}

func RemoveAd(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if ad.Owner.ID != userID || !Can(r, sam.ADS, sam.PermDelete) {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	if err := ad.Delete(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, picture := range ad.Pictures {
		if err := cdn.Remove(ad.Owner.ID, picture); err != nil {
			c.Log().Error(err)
		}
	}
}

func getMyFavouriteAds(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, db.GetFavouriteAds(userID, 0, 0))
}

func favouriteCreate(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		`insert into favourites (user_id,ad_id) values ($1, $2)`,
		userID,
		ad.ID,
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func favouriteDelete(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		`delete from favourites where user_id = $1 and ad_id = $2`,
		userID,
		ad.ID,
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func getAdMetrics(w http.ResponseWriter, r *http.Request) {
	// todo
	render.JSON(w, r, map[string]any{
		"views":      25,
		"messages":   20,
		"favourites": 5,
		"week":       []int{2, 4, 7, 7, 5, 5, 2},
	})
}

func reject(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if ad.Owner.ID != userID || !Can(r, sam.ADS, sam.PermWrite) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	if err := ad.Reject(); err != nil {
		http.Error(w, "can't reject", http.StatusInternalServerError)
		return
	}
}

func approve(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if !Can(r, sam.ADS, sam.PermPublish) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	conn := c.DB()
	defer conn.Release()

	tx, err := conn.Begin(context.TODO())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := ad.Accept(tx); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(context.TODO()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func publish(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if ad.Owner.ID == userID && ad.Status == db.STATUS_DRAFT {
		if err := ad.PrePublish(); err != nil {
			http.Error(w, "can't publish ad", http.StatusInternalServerError)
			return
		}
		return
	}

	if !Can(r, sam.ADS, sam.PermPublish) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	conn := c.DB()
	defer conn.Release()

	tx, err := conn.BeginTx(
		context.TODO(),
		pgx.TxOptions{},
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// todo use /approve
	if ad.Status == db.STATUS_PENDING {
		if err := ad.Accept(tx); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if err := ad.Publish(tx); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(context.TODO()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = ws.Send(userID, ws.NewEvent("ad.publish", &c.D{
		"id":    ad.ID,
		"title": ad.Title,
		"href":  ad.Href,
	}))

	if err != nil {
		emails.OnAdPublished(db.GetUserByID(userID).Recipient(), emails.OnAdPublishedParams{
			Title: ad.Title,
			Href:  ad.Href,
		})
	}

	if user := db.GetUserByID(userID); user != nil {
		user.Notify(
			fmt.Sprintf("Anunțul '%s' a fost publicat", ad.Title),
			fmt.Sprintf("Anunțul '%s' a fost publicat și se poate vedea deja pe website.", ad.Title),
			types.NotifInfo,
			ad.Href,
		)
	}
}

func getContactDetails(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad := db.GetAd(userID, c.ID(r, "id"))

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var phone = ad.Phone

	if phone == nil {
		user := db.GetUserByID(ad.Owner.ID)
		if user == nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		phone = &user.Phone
	}

	w.Write([]byte(*phone))
}

func CreateAd(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	p := CreateAdRequest{}

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "can't parse payload", http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	if len(p.Pictures) == 0 {
		http.Error(w, "expected at least one image", http.StatusBadRequest)
		return
	}

	for _, picture := range p.Pictures {
		if _, err := uuid.Parse(picture); err != nil {
			http.Error(w, "pictures must be a list of uuid's", http.StatusBadRequest)
			return
		}
	}

	conn := c.DB()
	defer conn.Release()

	tx, err := conn.Begin(
		context.TODO(),
	)

	if err != nil {
		http.Error(w, "nu am putut crea tranzactia", http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	user := db.GetUserByID(userID)

	ad := db.Ad{
		OwnerID:     userID,
		CategoryID:  p.Category,
		Slug:        slug.Make(p.Title),
		Title:       p.Title,
		Description: p.Description,
		Pictures:    p.Pictures,
		Messages:    p.Messages,
		ShowPhone:   p.ShowPhone,
		Phone:       p.Phone,
		Price:       p.Price,
		Currency:    p.Currency,
		CityID:      user.City,
		Props:       p.Props,
	}

	if err := ad.Save(tx); err != nil {
		http.Error(w, "nu am putut salva anunțul", http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	if err := tx.Commit(context.TODO()); err != nil {
		c.Log().Error(err)
		if err := tx.Rollback(context.TODO()); err != nil {
			c.Log().Error(err)
		}
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, ad)
}

func GetAd(w http.ResponseWriter, r *http.Request) {

	var meID int64 = 0

	if id, err := c.UserID(r); err == nil && id > 0 {
		meID = id
	}

	redirect := r.URL.Query().Get("redirect") == "true"
	ad := db.GetAd(meID, c.ID(r, "id"))

	if ad == nil {
		if redirect {
			//todo: would be nice to show some content for this since is used from chat
			http.Redirect(w, r, c.URLF(c.Web, "?adred=%d", ad), http.StatusTemporaryRedirect)
			return
		}
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if ad.Status != db.STATUS_PUBLISHED {
		w.Header().Add("X-Aham-Unpublished", fmt.Sprint(ad.Cycle))
		if redirect {
			//todo: would be nice to show some content for this
			http.Redirect(w, r, c.URLF(c.Web, "?adred=%d&cycle=%d", ad.ID, ad.Cycle), http.StatusTemporaryRedirect)
			return
		}
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if redirect {
		http.Redirect(w, r, c.URLF(c.Web, ad.Href), http.StatusPermanentRedirect)
		return
	}

	render.JSON(w, r, ad)
}

func GetAds(w http.ResponseWriter, r *http.Request) {

	query := r.URL.Query().Get("query")
	mode := r.URL.Query().Get("mode")
	offset := c.QueryIntParam(r, "offset", -1)
	limit := c.QueryIntParam(r, "limit", -1)
	from := c.QueryIntParam(r, "from", 0)
	skipOwner := r.URL.Query().Get("skip-owner") == "true"

	if mode == "" {
		mode = "published"
	}

	filter := db.Filter{
		Mode: mode,
	}

	if offset != -1 {
		filter.Offset = c.Int64P(offset)
	}

	if limit != -1 {
		filter.Limit = c.Int64P(limit)
	}

	userID, errUserID := c.UserID(r)

	if !skipOwner {
		if errUserID == nil {
			filter.Owner = &userID
		}
	}

	if query != "" {
		filter.Query = c.String(query)
		q, err := json.Marshal(query)
		if err == nil {
			Track(&userID, "ads/search/query", fmt.Sprintf(`{"query":"%s"}`, string(q)))
		}
	}

	if from != 0 {
		filter.Category = &from
	}

	if mode == "promotion" {
		render.JSON(w, r, db.GetPromotionAds(userID, filter))
		return
	}

	if mode == "recommended" {
		render.JSON(w, r, db.GetRecommendedAds(filter))
		return
	}

	if filter.Mode == string(db.STATUS_DRAFT) {

		userID, errUserID := c.UserID(r)

		if errUserID != nil {
			http.Error(w, "getting drafs requires user to be logged in", http.StatusBadRequest)
			return
		}

		if !skipOwner {
			filter.Owner = &userID
		}
	}

	if (skipOwner || filter.Owner == nil) && filter.Mode != string(db.STATUS_PUBLISHED) && !Can(r, sam.ADS, sam.PermRead) {
		c.Log().Infof("Mode %s requires authorization to read", filter.Mode)
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	render.JSON(w, r, db.GetAds(userID, filter))
}
