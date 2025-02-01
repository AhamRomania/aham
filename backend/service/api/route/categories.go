package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/gosimple/slug"
)

func CategoriesRoutes(r chi.Router) {
	r.Get("/", c.Guard(GetCategories))
	r.Get("/search", SearchCategory)
	r.Get("/{id}", GetCategory)
	r.Get("/{id}/props", GetCategoryProps)
	r.Post("/", createCategory)
}

type createCategoryRequest struct {
	Name      string  `json:"name"`
	Translate bool    `json:"translate"`
	Slug      *string `json:"slug"`
	Parent    *int64  `json:"parent"`
}

func createCategory(w http.ResponseWriter, r *http.Request) {

	payload := createCategoryRequest{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	var slugv = payload.Slug

	if slugv == nil {
		s := slug.Make(payload.Name)
		slugv = &s
	}

	if !slug.IsSlug(*slugv) {
		http.Error(w, "invalid slug", http.StatusBadRequest)
		return
	}

	row := c.DB().QueryRow(
		r.Context(),
		`
			insert into categories (name, slug, parent)
			values ($1, $2, $3)
			returning id
		`,
		payload.Name,
		*slugv,
		payload.Parent,
	)

	var id int64

	if err := row.Scan(&id); err != nil {
		c.Log().Error(err)
		http.Error(w, "failed to add category", http.StatusBadRequest)
		return
	}

	category := db.GetCategoryByID(id)

	if category == nil {
		http.Error(w, "failed to add category", http.StatusBadRequest)
		return
	}

	render.JSON(w, r, category)
}

func SearchCategory(w http.ResponseWriter, r *http.Request) {

	keyword := r.URL.Query().Get("q")

	if len(keyword) < 3 {
		http.Error(w, "q param required", http.StatusBadRequest)
		return
	}

	b := &bytes.Buffer{}

	encoder := json.NewEncoder(b)
	encoder.SetEscapeHTML(false)
	encoder.Encode(db.SearchCategoryPaths(keyword))

	w.Header().Set("Content-Type", "application/json")
	w.Write(b.Bytes())
}

func GetCategory(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCategory(c.ID(r, "id")))
}

func GetCategoryProps(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetCategoryProps(c.ID(r, "id")))
}

func GetCategories(w http.ResponseWriter, r *http.Request) {

	uid, _ := c.UserID(r)

	user := db.GetUserByID(uid)

	if !user.SamVerify(sam.CATEGORIES, sam.PermRead) {
		http.Error(w, "Can't read categories", http.StatusUnauthorized)
		return
	}

	flat := db.GetCategoriesFlat()

	if r.URL.Query().Get("tree") == "true" {
		render.JSON(w, r, db.GetCategoryTree(flat))
		return
	}

	render.JSON(w, r, flat)
}
