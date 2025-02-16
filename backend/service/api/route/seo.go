package route

import (
	"aham/common/c"
	"aham/service/api/sam"
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
	r.Post("/", c.Guard(seoCreate))
	r.Put("/{id}", c.Guard(seoUpdate))
	r.Delete("/{id}", c.Guard(seoDelete))
}

func seoDelete(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.SEO, sam.PermDelete) {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	cmd, err := c.DB().Exec(
		context.TODO(),
		`delete from seo where id = $1`,
		c.ID(r, "id"),
	)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	if cmd.RowsAffected() == 0 {
		w.WriteHeader(http.StatusNotFound)
		c.Log().Error(err)
		return
	}
}

func seoInfo(w http.ResponseWriter, r *http.Request) {

	uri := r.URL.Query().Get("uri")

	if uri != "" {

		var entry SeoEntry = SeoEntry{
			URI:       uri,
			UpdatedAt: time.Now(),
		}

		row := c.DB().QueryRow(
			context.TODO(),
			`select * from seo where uri = $1 LIMIT 1`,
			uri,
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

			sql := `
				insert into seo
					(uri, title, description, keywords, image, updated_at)
				values
					($1, '', '', '', '', now())
				returning id
			`

			row := c.DB().QueryRow(
				context.TODO(),
				sql,
				uri,
			)

			if err := row.Scan(&entry.ID); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				c.Log().Error(err)
				return
			}
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

	if !Can(r, sam.SEO, sam.PermWrite) {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	payload := SeoEntry{
		UpdatedAt: time.Now(),
	}

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
		returning id
	`

	row := c.DB().QueryRow(
		context.TODO(),
		sql,
		payload.URI,
		payload.Title,
		payload.Description,
		payload.Keywords,
		payload.Image,
		payload.UpdatedAt,
	)

	var id int64

	if err := row.Scan(&id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	payload.ID = id

	render.JSON(w, r, payload)
}

func seoUpdate(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.SEO, sam.PermWrite) {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	payload := SeoEntry{
		ID:        c.ID(r, "id"),
		UpdatedAt: time.Now(),
	}

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

	cmd, err := c.DB().Exec(
		context.TODO(),
		sql,
		payload.ID,
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

	if cmd.RowsAffected() == 0 {
		w.WriteHeader(http.StatusNotFound)
		c.Log().Error(err)
		return
	}

	render.JSON(w, r, payload)
}
