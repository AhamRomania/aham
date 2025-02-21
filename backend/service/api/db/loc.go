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

	conn := c.DB()
	defer conn.Release()

	row := conn.QueryRow(context.TODO(), sql, id)

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

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
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

type Group struct {
	ID     int64   `json:"id"`
	Name   string  `json:"name"`
	Cities []*City `json:"cities"`
}

func GetCitiesFlat(query string) (cities []*City) {

	cities = make([]*City, 0)

	conn := c.DB()
	defer conn.Release()

	rows, err := conn.Query(
		context.TODO(),
		`select
			cities.id,
			cities.name,
			cities.county,
			counties.name
		from cities
		left join counties on counties.id = cities.county
		where lower(unaccent(cities.name)) like '%' || $1 || '%'
		order by counties.name asc
		`,
		query,
	)

	if err != nil {
		c.Log().Error(err)
		return cities
	}

	for rows.Next() {

		city := &City{}

		err = rows.Scan(
			&city.ID,
			&city.Name,
			&city.County,
			&city.CountyName,
		)

		if err != nil {
			c.Log().Error(err)
			return cities
		}

		cities = append(cities, city)
	}

	return
}

func GetCitiesGroup(query string) (flat []*Group) {

	flat = make([]*Group, 0)
	conn := c.DB()
	defer conn.Release()
	rows, err := conn.Query(
		context.TODO(),
		`select
			cities.id,
			cities.name,
			cities.county,
			counties.name
		from cities
		left join counties on counties.id = cities.county
		where lower(unaccent(cities.name)) like '%' || $1 || '%'
		order by counties.name asc
		`,
		query,
	)

	if err != nil {
		c.Log().Error(err)
		return flat
	}

	n := make(map[int64]string, 0)
	m := make(map[int64][]*City, 0)

	for rows.Next() {

		city := &City{}

		err = rows.Scan(
			&city.ID,
			&city.Name,
			&city.County,
			&city.CountyName,
		)

		if err != nil {
			c.Log().Error(err)
			return flat
		}

		n[city.County] = city.CountyName
		m[city.County] = append(m[city.County], city)
	}

	for id, cities := range m {
		flat = append(flat, &Group{
			ID:     id,
			Name:   n[id],
			Cities: cities,
		})
	}

	return flat
}

func GetCities(county int64) []City {

	cities := make([]City, 0)
	conn := c.DB()
	defer conn.Release()
	rows, err := conn.Query(
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
