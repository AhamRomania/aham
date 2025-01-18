package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"net/http"

	"github.com/go-chi/render"
)

func GetCategories(w http.ResponseWriter, r *http.Request) {

	var categories []*db.Category
	var err error

	q := r.URL.Query().Get("q")

	if q != "" {
		categories, err = db.SearchCategory(q)
	} else {
		categories = db.GetCategories()
	}

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "can't get categories", http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, categories)
}
