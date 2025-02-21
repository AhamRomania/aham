package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/gosimple/slug"
)

func CategoriesRoutes(r chi.Router) {
	r.Get("/", GetCategories)
	r.Get("/search", SearchCategory)
	r.Get("/{id}", GetCategory)
	r.Put("/{id}", c.Guard(updateCategory))
	r.Delete("/{id}", c.Guard(deleteCategory))
	r.Get("/{id}/props", GetCategoryProps)
	r.Post("/", createCategory)
}

type updateCategoryRequest struct {
	Name   *string `json:"name"`
	Slug   *string `json:"slug"`
	Parent *int64  `json:"parent"`
}

func updateCategory(w http.ResponseWriter, r *http.Request) {

	uid, _ := c.UserID(r)

	user := db.GetUserByID(uid)

	if !user.SamVerify(sam.CATEGORIES, sam.PermWrite) {
		http.Error(w, "Can't write categories", http.StatusUnauthorized)
		return
	}

	payload := updateCategoryRequest{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	if payload.Name == nil || *payload.Name == "" {
		http.Error(w, "invalid name", http.StatusBadRequest)
		return
	}

	var slugv = payload.Slug

	if slugv == nil {
		s := slug.Make(*payload.Name)
		slugv = &s
	}

	if !slug.IsSlug(*slugv) {
		v := slug.Make(*slugv)
		slugv = &v
	}

	conn := c.DB()
	defer conn.Release()

	conn.Exec(
		r.Context(),
		`
			update categories set name = $1, slug = $2, parent = $3 where id = $4
		`,
		payload.Name,
		slugv,
		payload.Parent,
		chi.URLParam(r, "id"),
	)

	category := db.GetCategoryByID(c.ID(r, "id"))

	if category == nil {
		http.Error(w, "failed to add category", http.StatusBadRequest)
		return
	}

	render.JSON(w, r, category)

	w.WriteHeader(http.StatusOK)
}

func deleteCategory(w http.ResponseWriter, r *http.Request) {
	conn := c.DB()
	defer conn.Release()

	conn.Exec(
		context.TODO(),
		`delete from categories where id = $1`,
		chi.URLParam(r, "id"),
	)
}

type createCategoryRequest struct {
	Name   string  `json:"name"`
	Slug   *string `json:"slug"`
	Parent *int64  `json:"parent"`
}

func createCategory(w http.ResponseWriter, r *http.Request) {

	uid, _ := c.UserID(r)

	user := db.GetUserByID(uid)

	if !user.SamVerify(sam.CATEGORIES, sam.PermWrite) {
		http.Error(w, "Can't write categories", http.StatusUnauthorized)
		return
	}

	payload := createCategoryRequest{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	if payload.Name == "" {
		http.Error(w, "invalid name", http.StatusBadRequest)
		return
	}

	var slugv = payload.Slug

	if slugv == nil || *slugv == "" {
		s := slug.Make(payload.Name)
		slugv = &s
	}

	if !slug.IsSlug(*slugv) {
		http.Error(w, "invalid slug", http.StatusBadRequest)
		return
	}

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
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

	w.WriteHeader(http.StatusCreated)
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
	render.JSON(w, r, db.GetCategoryInheritedProps(c.ID(r, "id")))
}

func GetCategories(w http.ResponseWriter, r *http.Request) {

	if path := r.URL.Query().Get("path"); path != "" {

		category := db.GetCategoryByPath(path)

		if category != nil {
			render.JSON(w, r, category)
			return
		}

		http.Error(w, "category not found", http.StatusNotFound)
		return
	}

	flat := db.GetCategoriesFlat()

	var parent *int64

	n, err := strconv.ParseInt(r.URL.Query().Get("parent"), 10, 64)

	if err == nil {
		parent = &n
	}

	render.JSON(w, r, db.GetCategoryTree(flat, parent))
}
