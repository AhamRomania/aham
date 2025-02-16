package route

import (
	"aham/common/c"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

type SeoEntry struct {
	ID          int64     `json:"id"`
	URI         string    `json:"uri,omitempty"`
	Title       string    `json:"title,omitempty"`
	Description string    `json:"description,omitempty"`
	Keywords    string    `json:"keywords,omitempty"`
	Image       string    `json:"image,omitempty"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
}

func SeoRotues(r chi.Router) {
	r.Get("/", seoInfo)
	r.Post("/", seoCreate)
	r.Put("/{id}", seoUpdate)
}

func seoInfo(w http.ResponseWriter, r *http.Request) {

	if r.URL.Query().Get("uri") != "" {

		var entry SeoEntry = SeoEntry{}

		row := c.DB().QueryRow(
			context.TODO(),
			`select * from seo where uri = $1 LIMIT 1`,
			r.URL.Query().Get("uri"),
		)

		err := row.Scan(
			&entry.ID,
			&entry.URI,
			&entry.Title,
			&entry.Description,
			&entry.Keywords,
			&entry.Image,
			&entry.UpdatedAt,
		)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			c.Log().Error(err)
			return
		}

		render.JSON(w, r, entry)
		return
	}

	rows, err := c.DB().Query(
		context.TODO(),
		`select * from seo`,
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	var items []*SeoEntry = make([]*SeoEntry, 0)

	for rows.Next() {

		entry := &SeoEntry{}

		err := rows.Scan(
			&entry.ID,
			&entry.URI,
			&entry.Title,
			&entry.Description,
			&entry.Keywords,
			&entry.Image,
			&entry.UpdatedAt,
		)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			c.Log().Error(err)
			return
		}

		items = append(items, entry)
	}

	render.JSON(w, r, items)
}

func seoCreate(w http.ResponseWriter, r *http.Request) {

	payload := SeoEntry{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	sql := `
		insert into seo
			(uri, title, description, keywords, image, updated_at)
		values
			($1, $2, $3, $4, $5, $6)
	`

	_, err := c.DB().Exec(
		context.TODO(),
		sql,
		payload.URI,
		payload.Title,
		payload.Description,
		payload.Keywords,
		payload.Image,
		time.Now(),
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
}

func seoUpdate(w http.ResponseWriter, r *http.Request) {

	payload := SeoEntry{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	sql := `
		update seo set
			title = $2,
			description = $3,
			keywords = $4,
			image = $5,
			updated_at = $6
		where id = $1
	`

	_, err := c.DB().Exec(
		context.TODO(),
		sql,
		c.ID(r, "id"),
		payload.URI,
		payload.Title,
		payload.Description,
		payload.Keywords,
		payload.Image,
		payload.UpdatedAt,
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
}
