package db

import (
	"aham/common/c"
	"context"
)

type County struct {
	ID   int64  `json:"id"`
	Auto string `json:"auto"`
	Name string `json:"name"`
}

type City struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	County     int64  `json:"county,omitempty"`
	CountyName string `json:"county_name,omitempty"`
}

func GetCity(id int64) *City {

	sql := `
	select 
		c.id,
		c.name,
		co.id,
		co.name
	from cities as c
	left join counties as co on co.id = c.county
	where c.id = $1
	`

	row := c.DB().QueryRow(context.TODO(), sql, id)

	city := City{}

	err := row.Scan(
		&city.ID,
		&city.Name,
		&city.County,
		&city.CountyName,
	)

	if err != nil {
		return nil
	}

	return &city
}

func GetCounties() []County {

	counties := make([]County, 0)

	rows, err := c.DB().Query(
		context.Background(),
		"select id,auto,name from counties order by name asc",
	)

	if err != nil {
		c.Log().Error(err)
		return counties
	}

	for rows.Next() {

		county := County{}

		err := rows.Scan(
			&county.ID,
			&county.Auto,
			&county.Name,
		)

		if err != nil {
			c.Log().Error(err)
			return counties
		}

		counties = append(counties, county)
	}

	return counties
}

func GetCities(county int64) []City {

	cities := make([]City, 0)

	rows, err := c.DB().Query(
		context.TODO(),
		"select id,name from cities where county=$1 order by name asc",
		county,
	)

	if err != nil {
		c.Log().Error(err)
		return cities
	}

	for rows.Next() {

		city := City{}

		err := rows.Scan(
			&city.ID,
			&city.Name,
		)

		if err != nil {
			c.Log().Error(err)
			return cities
		}

		cities = append(cities, city)
	}

	return cities
}
