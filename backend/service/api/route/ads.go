package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
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
	r.Get("/{id}", GetAd)
	r.Post("/{id}/reject", c.Guard(reject))
	r.Post("/{id}/publish", c.Guard(publishAd))
	r.Get("/{id}/contact", c.Guard(getContactDetails))
	r.Get("/{id}/metrics", getAdMetrics)
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

	ad, err := db.GetAd(c.ID(r, "id"))

	if err != nil {
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

func publishAd(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ad, err := db.GetAd(c.ID(r, "id"))

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if ad.Owner.ID != userID || !Can(r, sam.ADS, sam.PermPublish) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	tx, err := c.DB().BeginTx(
		context.TODO(),
		pgx.TxOptions{},
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := ad.Accept(tx); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := ad.Publish(tx, 7); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(context.TODO()); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func getContactDetails(w http.ResponseWriter, r *http.Request) {

	ad, err := db.GetAd(c.ID(r, "id"))

	if err != nil {
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

	tx, err := c.DB().Begin(
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

	ad, err := db.GetAd(c.ID(r, "id"))

	if err != nil {
		http.Error(w, "anunțul nu a fost găsit.", http.StatusNotFound)
		c.Log().Error(err)
		return
	}

	render.JSON(w, r, ad)
}

func GetAds(w http.ResponseWriter, r *http.Request) {

	pending := r.URL.Query().Get("pending") == "true"
	offset := c.QueryIntParam(r, "offset", 0)
	limit := c.QueryIntParam(r, "limit", 10)

	filter := db.AdsFilter{
		Status: "published",
		Offset: offset,
		Limit:  limit,
	}

	if pending {
		filter.Status = "pending"
	}

	render.JSON(w, r, db.GetAds(filter))
}
