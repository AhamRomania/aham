package service

import (
	"aham/common/c"
	"aham/service/api/db"
	"context"
	"time"
)

// - Update expired ads
func ProcessRuntimeUpdates() {

	workers := c.NewDeferedWorkers()

	workers.Push("AD Completer", func(worker *c.DeferdWorker) {

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

			ad := db.GetAd(id)

			c.Log().Infof("Finishing %s", ad.Href)

			if err := ad.Finish(); err != nil {
				c.Log().Error(err)
			}
		}

		row := conn.QueryRow(
			context.TODO(),
			`select valid_through from ads where status = 'published' order by valid_through ASC LIMIT 1`,
		)

		var after time.Time

		if err := row.Scan(&after); err == nil {
			worker.RunAfter(after)
		}
	})

	workers.Run()

	c.Log().Info("ProcessRuntimeUpdates Completed")
}
