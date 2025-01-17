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
		c.Error(w, http.StatusBadRequest, "Failed to decode request body for report creation")
		return
	}

	reporter, err := c.UserID(r)

	if err != nil {

		if req.Email == "" {
			c.Error(w, http.StatusBadRequest, "Email is required for anonymous report")
			return
		}

		if req.Name == "" {
			c.Error(w, http.StatusBadRequest, "Name is required for anonymous report")
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
		c.Error(w, http.StatusInternalServerError, "Failed to create report")
		return
	}
}
