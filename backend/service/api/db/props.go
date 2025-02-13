package db

import (
	"aham/common/c"
	"context"
	"fmt"
	"slices"
)

type MetaProp struct {
	ID          int64   `json:"id,omitempty"`
	Name        string  `json:"name,omitempty"`
	Title       string  `json:"title,omitempty"`
	Group       string  `json:"group,omitempty"`
	Required    bool    `json:"required,omitempty"`
	Template    *string `json:"template,omitempty"`
	Description *string `json:"description,omitempty"`
	Help        *string `json:"help,omitempty"`
	Type        string  `json:"type,omitempty"`
	Sort        *int64  `json:"sort,omitempty"`
	Options     *c.D    `json:"options,omitempty"`
	Microdata   string  `json:"microdata,omitempty"`
	Inherited   bool    `json:"inherited,omitempty"`
}

func GetPropValues(id int64) (values []string) {

	// cache

	mp := GetPropByID(id)

	values = make([]string, 0)

	if mp == nil {
		c.Log().Error("expected prop exist")
		return values
	}

	sql := fmt.Sprintf(
		`select distinct props->>'%s' as v from ads`,
		mp.Name,
	)

	rows, err := c.DB().Query(context.TODO(), sql)

	if err != nil {
		c.Log().Error(err)
		return
	}

	for rows.Next() {

		var v *string

		if err := rows.Scan(&v); err != nil {
			c.Log().Error(err)
			return
		}

		if v != nil {
			values = append(values, c.Ucfirst(string(*v)))
		}
	}

	return slices.Compact(values)
}

func GetPropByName(name string) *MetaProp {

	sql := `
		select 
			id,
			name,
			title,
			"group",
			description,
			help,
			type,
			options,
			sort,
			microdata,
			template
		from
			meta_props
		where
			name = $1
	`

	row := c.DB().QueryRow(context.TODO(), sql, name)

	prop := &MetaProp{}

	err := row.Scan(
		&prop.ID,
		&prop.Name,
		&prop.Title,
		&prop.Group,
		&prop.Description,
		&prop.Help,
		&prop.Type,
		&prop.Options,
		&prop.Sort,
		&prop.Microdata,
		&prop.Template,
	)

	if err != nil {
		return nil
	}

	return prop
}

func GetPropByID(id int64) *MetaProp {

	sql := `
		select 
			id,
			name,
			title,
			"group",
			description,
			help,
			type,
			options,
			sort,
			microdata,
			template
		from
			meta_props
		where
			id = $1
	`

	row := c.DB().QueryRow(context.TODO(), sql, id)

	prop := &MetaProp{}

	err := row.Scan(
		&prop.ID,
		&prop.Name,
		&prop.Title,
		&prop.Group,
		&prop.Description,
		&prop.Help,
		&prop.Type,
		&prop.Options,
		&prop.Sort,
		&prop.Microdata,
		&prop.Template,
	)

	if err != nil {
		return nil
	}

	return prop
}

func GetProps() (props []*MetaProp) {

	props = make([]*MetaProp, 0)

	rows, err := c.DB().Query(
		context.TODO(),
		`select 
			id,
			name,
			title,
			"group",
			description,
			help,
			type,
			options,
			sort,
			microdata,
			template
		from meta_props	`,
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	defer rows.Close()

	for rows.Next() {

		prop := &MetaProp{}

		err := rows.Scan(
			&prop.ID,
			&prop.Name,
			&prop.Title,
			&prop.Group,
			&prop.Description,
			&prop.Help,
			&prop.Type,
			&prop.Options,
			&prop.Sort,
			&prop.Microdata,
			&prop.Template,
		)

		if err != nil {
			c.Log().Error(err)
			return props
		}

		props = append(props, prop)
	}

	return
}
