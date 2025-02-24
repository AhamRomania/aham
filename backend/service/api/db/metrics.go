package db

import (
	"aham/common/c"
	"context"
	"net"
	"os"
	"slices"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type MetricsEvent struct {
	UUID   uuid.UUID `json:"uuid"`
	Kind   string    `json:"kind"`
	UserID int64     `json:"user_id"`
	User   *UserMin  `json:"user"`
	Meta   *c.D      `json:"meta"`
	IP     net.IP    `json:"ip"`
	Agent  string    `json:"agent"`
	Time   time.Time `json:"time"`
}

func GetAdFavouriteCount(ad *Ad) int64 {
	if ad == nil {
		c.Log().Error("ad is nil")
		return 0
	}
	conn := c.DB()
	defer conn.Release()
	row := conn.QueryRow(
		context.Background(),
		`select count(*) from favourites where ad_id = $1`,
		ad.ID,
	)
	var count int64
	row.Scan(&count)
	return count
}

func GetAdMessagesCount(ad *Ad) int64 {
	if ad == nil {
		c.Log().Error("ad is nil")
		return 0
	}
	conn := c.DB()
	defer conn.Release()
	row := conn.QueryRow(
		context.Background(),
		`select count(*) from chats where reference = $1 and context = 'ad'`,
		ad.ID,
	)
	var count int64
	row.Scan(&count)
	return count
}

func GetAdTotalViews(ad *Ad) int64 {

	if ad == nil {
		c.Log().Error("ad is nil")
		return 0
	}

	conn, err := pgx.Connect(context.Background(), os.Getenv("METRICS"))

	if err != nil {
		c.Log().Errorf("Can't get metrics db connection:", err)
		return 0
	}

	if err := conn.Ping(context.TODO()); err != nil {
		c.Log().Errorf("Can't ping metrics db connection:", err)
		return 0
	}

	row := conn.QueryRow(
		context.TODO(),
		`select count(*) from events where kind = 'ad/view' and metadata->>'ad' = ($1::int)::text`,
		ad.ID,
	)

	var count int64

	if err := row.Scan(&count); err != nil {
		c.Log().Error(err)
	}

	return count
}

func GetAdLastWeekViews(ad *Ad) (stats []int64) {

	stats = []int64{0, 0, 0, 0, 0, 0, 0}

	if ad == nil {
		return stats
	}

	conn, err := pgx.Connect(context.Background(), os.Getenv("METRICS"))

	if err != nil {
		c.Log().Errorf("Can't get metrics db connection:", err)
		return stats
	}

	if err := conn.Ping(context.TODO()); err != nil {
		c.Log().Errorf("Can't ping metrics db connection:", err)
		return stats
	}

	rows, err := conn.Query(
		context.TODO(),
		`select * from events where time >= DATE_TRUNC('week', NOW()) and kind = 'ad/view' and metadata->>'ad' = ($1::int)::text`,
		ad.ID,
	)

	if err != nil {
		c.Log().Error(err)
		return stats
	}

	var events = make([]MetricsEvent, 0)
	var filter = make(map[int][]string)

	for rows.Next() {

		var ev = MetricsEvent{}

		err := rows.Scan(
			&ev.UUID,
			&ev.Kind,
			&ev.UserID,
			&ev.Meta,
			&ev.IP,
			&ev.Agent,
			&ev.Time,
		)

		if err != nil {
			c.Log().Error(err)
			return stats
		}

		events = append(events, ev)
	}

	conn.Close(context.TODO())

	var unique bool = false

	for _, e := range events {

		day := (int(e.Time.Weekday()) + 6) % 7

		if unique {

			if _, exists := filter[day]; !exists {
				filter[day] = make([]string, 0)
			}

			if slices.Index[[]string](filter[day], e.IP.String()) != -1 {
				continue
			}

			filter[day] = append(filter[day], e.IP.String())
		}

		stats[day]++
	}

	return
}
