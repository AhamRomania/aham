package route

import (
	"aham/common/c"
	"net/http"

	"github.com/go-chi/render"
)

func Setup(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, map[string]any{
		"GOOGLE_CLIENT_ID": c.GOOGLE_CLIENT_ID,
	})
}
