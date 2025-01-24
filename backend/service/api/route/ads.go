package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/vo"
	"encoding/json"
	"net/http"

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
	URL         string   `json:"url"`
	Messages    bool     `json:"messages"`
	ShowPhone   bool     `json:"show_phone"`
	Phone       string   `json:"phone"`
}

func CreateAd(w http.ResponseWriter, r *http.Request) {

	user, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	p := CreateAdRequest{}

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "can't parse payload", http.StatusBadRequest)
		return
	}

	ad := db.Ad{
		CategoryID:  1,
		Owner:       user,
		Slug:        slug.Make(p.Title),
		Title:       p.Title,
		Description: p.Description,
		Pictures:    p.Pictures,
		Price:       p.Price,
		Currency:    p.Currency,
		CityID:      1,
	}

	if err := ad.Save(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
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
