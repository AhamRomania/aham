package route

import (
	"aham/common/c"
	"aham/common/emails"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GcmRoutes(r chi.Router) {
	r.Get("/template", renderTemplate)
}

func renderTemplate(w http.ResponseWriter, r *http.Request) {

	layout := r.URL.Query().Get("layout")

	if layout == "" {
		layout = "empty"
	}

	err := emails.Render(w, layout, r.URL.Query().Get("source"), map[string]string{
		"NAME": "Jhon",
	})

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am găsit continutul", http.StatusNotFound)
	}
}
