package route

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func ShareRoutes(r chi.Router) {
	r.Get("/", GetShares)
	r.Post("/", CreateShare)
}

func GetShares(w http.ResponseWriter, r *http.Request) {
}

type createShareRequest struct {
	AdID      int64    `json:"ad"`
	Content   string   `json:"content"`
	Platforms []string `json:"platforms"`
}

func CreateShare(w http.ResponseWriter, r *http.Request) {

}
