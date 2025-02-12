package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func PropsRoute(r chi.Router) {
	r.Get("/", getProps)
	r.Post("/", c.Guard(createProp))
	r.Put("/{id}", c.Guard(updateProp))
	r.Delete("/{id}", c.Guard(deleteProp))
	r.Post("/assign", c.Guard(assignProp))
	r.Delete("/assign/{prop}/{category}", c.Guard(removeAssign))
}

func createProp(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.PROPS, sam.PermWrite) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	payload := db.MetaProp{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `invalid payload`, http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	row := c.DB().QueryRow(
		context.TODO(),
		`
		insert into meta_props
			(name,
			title,
			"group",
			description,
			help,
			type,
			options,
			sort,
			microdata,
			template)
		values
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
		returning id
		`,
		payload.Name,
		payload.Title,
		payload.Group,
		payload.Description,
		payload.Help,
		payload.Type,
		payload.Options,
		payload.Sort,
		payload.Microdata,
		payload.Template,
	)

	var id int64

	if err := row.Scan(&id); err != nil {
		http.Error(w, `can't add prop`, http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	render.JSON(w, r, db.GetPropByID(id))
}

func deleteProp(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.PROPS, sam.PermDelete) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	_, err := c.DB().Exec(context.TODO(), `delete from meta_props where id = $1`, c.ID(r, "id"))

	if err != nil {
		http.Error(w, `invalid payload`, http.StatusBadRequest)
		c.Log().Error(err)
		return
	}
}

func updateProp(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.PROPS, sam.PermWrite) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	payload := db.MetaProp{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `invalid payload`, http.StatusBadRequest)
		c.Log().Error(err)
		return
	}

	_, err := c.DB().Exec(
		context.TODO(),
		`
		update meta_props set
			name = $2,
			title = $3,
			"group" = $4,
			description = $5,
			help = $6,
			type = $7,
			options = $8,
			sort = $9,
			microdata = $10,
			template = $11
		where id = $1
		`,
		c.ID(r, "id"),
		payload.Name,
		payload.Title,
		payload.Group,
		payload.Description,
		payload.Help,
		payload.Type,
		payload.Options,
		payload.Sort,
		payload.Microdata,
		payload.Template,
	)

	if err != nil {
		http.Error(w, `can't update prop`, http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	render.JSON(w, r, db.GetPropByID(c.ID(r, "id")))
}

func getProps(w http.ResponseWriter, r *http.Request) {
	render.JSON(w, r, db.GetProps())
}

type categoryPropChangePayload struct {
	PropID     int64 `json:"prop"`
	CategoryID int64 `json:"category"`
}

func assignProp(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.PROPS, sam.PermPublish) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	payload := categoryPropChangePayload{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, `invalid payload`, http.StatusBadRequest)
		return
	}

	_, err := c.DB().Exec(
		context.TODO(),
		`insert into meta_assign (category, meta) values ($1, $2)`,
		payload.CategoryID,
		payload.PropID,
	)

	if err != nil {
		http.Error(w, `nu am putut atribui o proprietate dynamica categoriei`, http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
}

func removeAssign(w http.ResponseWriter, r *http.Request) {

	if !Can(r, sam.PROPS, sam.PermDelete) {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	_, err := c.DB().Exec(
		context.TODO(),
		`delete from meta_assign where category = $1 and meta = $2`,
		c.ID(r, "category"),
		c.ID(r, "prop"),
	)

	if err != nil {
		http.Error(w, `nu am putut sterge o proprietate dynamica`, http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
}
