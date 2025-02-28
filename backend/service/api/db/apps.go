package db

import (
	"aham/common/c"
	. "aham/service/api/db/aham/public/table"
	"context"
	"errors"
	"time"

	. "github.com/go-jet/jet/v2/postgres"
)

type UserApp struct {
	ID      int64 `json:"id"`
	OwnerID int64 `json:"owner_id"`
	// Use from select use OwnerID for saving
	Owner   *UserMin  `json:"owner"`
	Name    string    `json:"name"`
	Key     string    `json:"key"`
	Enabled bool      `json:"enabled"`
	Created time.Time `json:"created"`
}

func (ua *UserApp) Delete() (err error) {

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		`delete from applications where id = $1`,
		ua.ID,
	)

	if err != nil {
		return err
	}

	return
}

func (ua *UserApp) Save() (err error) {

	ua.Created = time.Time{}

	if ua.OwnerID == 0 {
		return errors.New("provide owner")
	}

	if ua.Name == "" {
		ua.Name = c.GenerateRandomName()
	}

	in := Applications.INSERT(
		Applications.Owner,
		Applications.Name,
		Applications.Key,
		Applications.Enabled,
		Applications.Created,
	).VALUES(
		ua.OwnerID,
		ua.Name,
		ua.Key,
		true,
		time.Now(),
	)

	sql, params := in.Sql()

	conn := c.DB()
	defer conn.Release()

	_, err = conn.Exec(
		context.TODO(),
		sql,
		params...,
	)

	if err != nil {
		return err
	}

	return
}

func GetApp(id int64) (app *UserApp) {

	stmt := Applications.SELECT(
		Applications.ID,
		Applications.Owner,
		Applications.Name,
		Applications.Key,
		Applications.Enabled,
		Applications.Created,
	).WHERE(
		Applications.ID.EQ(Int(id)),
	)

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(
		context.TODO(),
		sql,
		params...,
	)

	app = &UserApp{}

	err := row.Scan(
		&app.ID,
		&app.OwnerID,
		&app.Name,
		&app.Key,
		&app.Enabled,
		&app.Created,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return
}

func GetUserApps(userID int64) (apps []UserApp) {

	stmt := Applications.SELECT(
		Applications.ID,
		Applications.Owner,
		Applications.Name,
		Applications.Key,
		Applications.Enabled,
		Applications.Created,
	).WHERE(
		Applications.Owner.EQ(Int(userID)),
	)

	sql, params := stmt.Sql()

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
		context.TODO(),
		sql,
		params...,
	)

	if err != nil {
		c.Log().Error(err)
		return apps
	}

	for rows.Next() {
		a := UserApp{}
		err = rows.Scan(
			&a.ID,
			&a.OwnerID,
			&a.Name,
			&a.Key,
			&a.Enabled,
			&a.Created,
		)
		if err != nil {
			c.Log().Error(err)
			return apps
		}
		apps = append(apps, a)
	}

	return
}
