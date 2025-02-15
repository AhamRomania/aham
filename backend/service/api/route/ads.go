package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/gosimple/slug"
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
	r.Get("/{id}/contact", c.Guard(getContactDetails))
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
	render.JSON(w, r, db.GetAds())
}
