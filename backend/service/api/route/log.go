package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"net/http"

	"github.com/go-chi/render"
)

func GetCity(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCity(c.ID(r, "city")))
}

func GetCities(w http.ResponseWriter, r *http.Request) {

	q := r.URL.Query().Get("q")

	if r.URL.Query().Get("group") != "" {
		render.JSON(w, r, db.GetCitiesGroup(q))
		return
	}

	render.JSON(w, r, db.GetCitiesFlat(q))
}

func GetCounties(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCounties())
}

func GetCounty(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCities(c.ID(r, "county")))
}
