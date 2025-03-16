package service

import (
	"aham/common/c"
	"aham/service/api/db"
	"context"
	"time"
)

func ProcessRuntimeUpdates() {
	ticker := time.NewTicker(time.Second * 42)
	defer ticker.Stop()
	for range ticker.C {
		verifyCompletedAds()
	}
}

func verifyCompletedAds() {

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
			continue
		}

		ad := db.GetAd(0, id)

		c.Log().Infof("Finishing %s", ad.Href)

		if err := ad.Finish(); err != nil {
			c.Log().Error(err)
		}
	}
}
