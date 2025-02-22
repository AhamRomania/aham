package service

import (
	"aham/common/c"
	"aham/service/api/db"
	"context"
	"time"
)

func ProcessRuntimeUpdates() {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for range ticker.C {
		verifyCompletedAds(ticker)
	}
}

func verifyCompletedAds(ticker *time.Ticker) {

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
		context.TODO(),
		`select id from ads where status = 'published' and valid_through < $1`,
		time.Now(),
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	for rows.Next() {

		var id int64

		if err := rows.Scan(&id); err != nil {
			c.Log().Error(err)
			return
		}

		ad := db.GetAd(0, id)

		c.Log().Infof("Finishing %s", ad.Href)

		if err := ad.Finish(); err != nil {
			c.Log().Error(err)
		}
	}

	row := conn.QueryRow(
		context.TODO(),
		`select valid_through from ads where status = 'published' order by valid_through ASC LIMIT 1`,
	)

	var nextValidThrough time.Time

	if err := row.Scan(&nextValidThrough); err == nil {
		wait := nextValidThrough.Sub(time.Now().Add(time.Hour * 2)) // fix
		if wait > 0 {
			ticker.Reset(wait)
		}
	} else {
		ticker.Reset(time.Second * 5)
	}
}
