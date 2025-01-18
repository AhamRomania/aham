package db

import (
	"aham/common/c"
	"context"
	"time"

	"github.com/gosimple/slug"
)

type Category struct {
	ID          int64  `json:"id,omitempty"`
	Name        string `json:"name,omitempty"`
	Slug        string `json:"slug,omitempty"`
	Description string `json:"description,omitempty"`
	Pricing     bool   `json:"pricing,omitempty"`
}

func (category *Category) Link() string {
	return c.URLF("/category/%s", slug.Make(category.Slug))
}

func (c *Category) LastModified() string {
	return time.Now().Format("2006-01-02")
}

func SearchCategory(q string) (categories []*Category, err error) {

	rows, err := c.DB().Query(
		context.Background(),
		"select id,name,slug,description from categories where hidden=false and slug LIKE '%' || $1 || '%' OR name LIKE '%' || $1 || '%'",
		q,
	)

	if err != nil {
		return categories, err
	}

	for rows.Next() {

		category := Category{}

		err = rows.Scan(
			&category.ID,
			&category.Name,
			&category.Slug,
			&category.Description,
		)

		if err != nil {
			return categories, err
		}

		categories = append(categories, &category)
	}

	return categories, nil
}

func GetCategoryBySlug(slug string) *Category {

	row := c.DB().QueryRow(
		context.Background(),
		"select id,name,slug,description from categories where hidden=false and slug = $1",
		slug,
	)

	c := Category{}

	err := row.Scan(
		&c.ID,
		&c.Name,
		&c.Slug,
		&c.Description,
	)

	if err != nil {
		return nil
	}

	return &c
}

func GetCategory(id int64) *Category {

	row := c.DB().QueryRow(
		context.Background(),
		"select id,name,slug,description,pricing from categories where hidden=false and id = $1",
		id,
	)

	c := Category{}

	err := row.Scan(
		&c.ID,
		&c.Name,
		&c.Slug,
		&c.Description,
		&c.Pricing,
	)

	if err != nil {
		return nil
	}

	return &c
}

func GetCategories() (categories []*Category) {

	rows, err := c.DB().Query(
		context.Background(),
		"select id,name,slug,description from categories where hidden=false",
	)

	if err != nil {
		c.Log().Error(err)
		return categories
	}

	for rows.Next() {

		category := Category{}

		err = rows.Scan(
			&category.ID,
			&category.Name,
			&category.Slug,
			&category.Description,
		)

		if err != nil {
			return categories
		}

		categories = append(categories, &category)
	}

	return
}
