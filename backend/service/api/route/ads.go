package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/vo"
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
}

func AdsRoutes(r chi.Router) {
	r.Post("/", c.Guard(CreateAd))
	r.Get("/", GetAds)
	r.Get("/{id}", GetAd)
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

	user := db.GetUserByID(userID)

	ad := db.Ad{
		Owner:       userID,
		CategoryID:  p.Category,
		Slug:        slug.Make(p.Title),
		Title:       p.Title,
		Description: p.Description,
		Pictures:    p.Pictures,
		Messages:    p.Messages,
		ShowPhone:   p.ShowPhone,
		Phone:       p.Phone,
		Price:       p.Price * 100,
		Currency:    p.Currency,
		CityID:      user.City,
	}

	if err := ad.Save(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, ad)
}

func GetAd(w http.ResponseWriter, r *http.Request) {

	ad, err := db.GetAd(c.ID(r, "id"))

	if err != nil {
		http.Error(w, "Eroare 404: anunțul nu a fost găsit.", http.StatusNotFound)
		return
	}

	render.JSON(w, r, vo.NewAd(ad))
}

func GetAds(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetAds())
}
