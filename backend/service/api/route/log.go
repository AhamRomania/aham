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

func GetCounties(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCounties())
}

func GetCounty(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCities(c.ID(r, "county")))
}
