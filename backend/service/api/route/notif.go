package route

import (
	"aham/common/c"
	. "aham/service/api/db/aham/public/table"
	"aham/service/api/types"
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	. "github.com/go-jet/jet/v2/postgres"
)

func NotifRoutes(r chi.Router) {
	r.Get("/", c.Guard(notifs))
	r.Patch("/{id}", c.Guard(markAsSeen))
}

func notifs(w http.ResponseWriter, r *http.Request) {

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	offset := c.QueryIntParam(r, "offset", 0)
	limit := c.QueryIntParam(r, "limit", 10)
	count := r.URL.Query().Get("count") == "true"

	conn := c.DB()
	defer conn.Release()

	if count {

		stmt := Notifications.SELECT(
			COUNT(String("*")),
		).WHERE(
			Notifications.Owner.EQ(Int(userID)).AND(
				Notifications.Seen.IS_NULL(),
			),
		)

		sql, params := stmt.Sql()

		row := conn.QueryRow(context.TODO(), sql, params...)

		var count int64

		if err := row.Scan(&count); err != nil {
			c.Log().Error(err)
		}

		w.Write([]byte(fmt.Sprint(count)))
		return
	}

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
	).WHERE(
		Notifications.Owner.EQ(Int(userID)).AND(
			Notifications.Seen.GT_EQ(
				TimestampExp(Raw("NOW() - INTERVAL '7 days'")),
			).OR(
				Notifications.Seen.IS_NULL(),
			),
		),
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

	userID, err := c.UserID(r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	id := c.ID(r, "id")
	conn := c.DB()
	defer conn.Release()
	conn.Exec(
		context.TODO(),
		`update notifications set seen = now() where id=$1 and owner=$2`,
		id, userID,
	)
}
