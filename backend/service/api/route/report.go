package route

import (
	"aham/common/c"
	"context"
	"net/http"

	"github.com/go-chi/render"
)

type ReportRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Reference string `json:"reference"`
	Reason    string `json:"reason"`
	Comments  string `json:"comments"`
}

func Report(w http.ResponseWriter, r *http.Request) {

	var req ReportRequest

	if err := render.DecodeJSON(r.Body, &req); err != nil {
		http.Error(w, "Failed to decode request body for report creation", http.StatusBadRequest)
		return
	}

	reporter, err := c.UserID(r)

	if err != nil {

		if req.Email == "" {
			http.Error(w, "Email is required for anonymous report", http.StatusBadRequest)
			return
		}

		if req.Name == "" {
			http.Error(w, "Name is required for anonymous report", http.StatusBadRequest)
			return
		}
	}

	_, err = c.DB().Exec(
		context.Background(),
		`INSERT INTO reports (reporter, reporter_name, reporter_email, reference, reason, comments, navitator, ip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		c.NilID(reporter),
		c.NilString(req.Name),
		c.NilString(req.Email),
		req.Reference,
		req.Reason,
		req.Comments,
		r.Header.Get("User-Agent"),
		r.RemoteAddr,
	)

	if err != nil {
		c.Log().Error(err.Error())
		http.Error(w, "Failed to create report", http.StatusInternalServerError)
		return
	}
}
