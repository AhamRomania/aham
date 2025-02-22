package route

import (
	"aham/common/c"
	. "aham/service/api/db/aham/public/table"
	"aham/service/api/types"
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func NotifRoutes(r chi.Router) {
	r.Get("/", notifs)
	r.Patch("/{id}", markAsSeen)
}

func notifs(w http.ResponseWriter, r *http.Request) {

	offset := c.QueryIntParam(r, "offset", 0)
	limit := c.QueryIntParam(r, "limit", 0)

	conn := c.DB()
	defer conn.Release()

	stmt := Notifications.SELECT(
		Notifications.ID,
		Notifications.Variant,
		Notifications.Title,
		Notifications.Contents,
		Notifications.Href,
		Notifications.Actions,
		Notifications.Seen,
		Notifications.Created,
	).FROM(
		Notifications.Table,
	).ORDER_BY(
		Notifications.Created.DESC(),
	).OFFSET(
		offset,
	).LIMIT(
		limit,
	)

	sql, params := stmt.Sql()

	var notifs = make([]*types.Notif, 0)

	rows, err := conn.Query(
		context.Background(),
		sql,
		params...,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for rows.Next() {

		n := &types.Notif{}

		rows.Scan(
			&n.ID,
			&n.Variant,
			&n.Title,
			&n.Contents,
			&n.Href,
			&n.Actions,
			&n.Seen,
			&n.Created,
		)

		notifs = append(notifs, n)
	}

	render.JSON(w, r, notifs)
}

func markAsSeen(w http.ResponseWriter, r *http.Request) {
	id := c.ID(r, "id")
	conn := c.DB()
	defer conn.Release()
	conn.Exec(
		context.TODO(),
		`update notifications set seen = now() where id = $1`,
		id,
	)
}
