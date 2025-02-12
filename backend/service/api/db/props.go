package db

import (
	"aham/common/c"
	"context"
	"sync"
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
}

type AdProp struct {
	ID    int64    `json:"id,omitempty"`
	Prop  MetaProp `json:"prop,omitempty"`
	Value any      `json:"value,omitempty"`
}

func GetAdProps(ad *Ad) []AdProp {

	var props = make([]AdProp, 0)
	wg := sync.WaitGroup{}

	if ad == nil {
		c.Log().Error("empty ad")
		return props
	}

	if ad.Props == nil {
		return props
	}

	for k, v := range *ad.Props {
		wg.Add(1)
		go func(k string, v any) {
			full := GetPropByName(k)
			if full == nil {
				wg.Done()
				return
			}
			prop := AdProp{
				ID:    full.ID,
				Prop:  *full,
				Value: v,
			}
			props = append(props, prop)
			wg.Done()
		}(k, v)
	}

	wg.Wait()

	return props
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
