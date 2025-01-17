package route

import "net/http"

type CreateAdRequest struct {
	Category    int64  `json:"category"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Price       int64  `json:"price"`
	Currency    string `json:"currency"`
}

func CreateAd(w http.ResponseWriter, r *http.Request) {
	// Create ad
}

func GetAd(w http.ResponseWriter, r *http.Request) {
	// Get ad
}
