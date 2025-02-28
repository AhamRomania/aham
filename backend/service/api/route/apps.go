package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func AppsRouter(r chi.Router) {
	r.Post("/", c.Guard(createApp))
	r.Get("/", c.Guard(getAppList))
	r.Patch("/{id}", c.Guard(updateApp))
	r.Delete("/{id}", c.Guard(deleteApp))
}

type updateAppRequest struct {
	Name string `json:"name"`
}

func deleteApp(w http.ResponseWriter, r *http.Request) {

	_, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	app := db.GetApp(c.ID(r, "id"))

	if app == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	if err := app.Delete(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func updateApp(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	app := db.GetApp(userID)

	if app == nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	p := updateAppRequest{}

	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		http.Error(w, "can't parse payload", http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		`update applications set name = $1 where id = $2`,
		p.Name,
		app.ID,
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	render.JSON(w, r, app)
}

func getAppList(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	render.JSON(w, r, db.GetUserApps(userID))
}

func createApp(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	app := db.UserApp{
		OwnerID: userID,
		Key:     c.MustGenerateNonce(64),
	}

	if err := app.Save(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, app)
}
