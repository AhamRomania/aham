package db

import (
	"aham/common/c"
	"context"
	"slices"
	"sort"
	"strings"
	"time"

	"github.com/gosimple/slug"
)

type Category struct {
	ID          int64       `json:"id,omitempty"`
	Name        string      `json:"name,omitempty"`
	Slug        string      `json:"slug,omitempty"`
	Href        string      `json:"href,omitempty"`
	Path        string      `json:"path,omitempty"`
	Description string      `json:"description,omitempty"`
	Parent      *int64      `json:"parent,omitempty"`
	Sort        int64       `json:"sort,omitempty"`
	Pricing     bool        `json:"pricing,omitempty"`
	Hidden      bool        `json:"hidden,omitempty"`
	Children    []*Category `json:"children,omitempty"`
}

type SearchCategory struct {
	ID   int64    `json:"id,omitempty"`
	Path []string `json:"path,omitempty"`
}

func (category *Category) WithID(id int64) *Category {

	for _, c := range category.Children {

		if c.ID == id {
			return c
		}

		if found := c.WithID(id); found != nil {
			return found
		}
	}

	return nil
}

func (category *Category) Search(query string) (results []*Category) {

	results = make([]*Category, 0)

	for _, cat := range category.Children {

		if strings.Contains(c.Normalize(cat.Name), strings.ToLower(query)) {
			results = append(results, cat)
		}

		if len(cat.Children) > 0 {
			results = append(results, cat.Search(query)...)
		}
	}

	return
}

func (category *Category) Link() string {
	return c.URLF(c.Web, "/%s", slug.Make(category.Slug))
}

func (c *Category) LastModified() string {
	return time.Now().Format("2006-01-02")
}

func GetCategoryByID(id int64) *Category {

	if id == 0 {
		return nil
	}

	row := c.DB().QueryRow(
		context.Background(),
		`
		select
			id,
			name,
			slug,
			description,
			parent,
			sort,
			pricing
		from categories
		where hidden=false and id = $1
		`,
		id,
	)

	category := &Category{}

	err := row.Scan(
		&category.ID,
		&category.Name,
		&category.Slug,
		&category.Description,
		&category.Parent,
		&category.Sort,
		&category.Pricing,
	)

	if err != nil {
		c.Log().Error(err)
		return nil
	}

	return category
}

func GetCategoryBySlug(slug string) *Category {

	row := c.DB().QueryRow(
		context.Background(),
		"select id,name,slug,description,parent,sort,pricing from categories where hidden=false and slug = $1",
		slug,
	)

	c := Category{}

	err := row.Scan(
		&c.ID,
		&c.Name,
		&c.Slug,
		&c.Description,
		&c.Parent,
		&c.Sort,
		&c.Pricing,
	)

	if err != nil {
		return nil
	}

	return &c
}

func GetCategory(id int64) *Category {

	root := Category{
		Children: GetCategoryTree(GetCategoriesFlat(), nil),
	}

	return root.WithID(id)
}

func SearchCategoryTree(keyword string) (categories []*Category) {

	root := Category{
		Children: GetCategoryTree(GetCategoriesFlat(), nil),
	}

	return root.Search(keyword)
}

func GetCategoryByPath(path string) (category *Category) {

	row := c.DB().QueryRow(
		context.Background(),
		`select id from categories where get_category_href(id) = $1`,
		path,
	)

	var id int64

	if err := row.Scan(&id); err != nil {
		c.Log().Error(err)
		return
	}

	return GetCategoryByID(id)
}

func SearchCategoryPaths(keyword string) (categories []*SearchCategory) {

	keyword = c.Normalize(keyword)

	categories = make([]*SearchCategory, 0)

	rows, err := c.DB().Query(
		context.Background(),
		`
		SELECT * FROM (
			SELECT
				id,
				get_category_path(id)::text AS path
			FROM
				categories
		) subquery
		WHERE lower(path) LIKE '%' || $1 || '%'
		`,
		keyword,
	)

	if err != nil {
		c.Log().Error(err)
		return categories
	}

	for rows.Next() {

		category := SearchCategory{}

		var path string

		err = rows.Scan(
			&category.ID,
			&path,
		)

		category.Path = strings.Split(path, " > ")

		if err != nil {
			c.Log().Error(err)
			return categories
		}

		categories = append(categories, &category)
	}

	sort.Slice(categories, func(i, j int) bool {
		return len(categories[i].Path) > len(categories[j].Path)
	})

	if len(categories) > 5 {
		return categories[:5]
	}

	return categories
}

func GetCategoriesFlat() (categories []*Category) {

	categories = make([]*Category, 0)

	rows, err := c.DB().Query(
		context.Background(),
		`select
			id,
			name,
			slug,
			description,
			parent,
			sort,
			pricing
		from
			categories
		where hidden=false
		`,
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
			&category.Parent,
			&category.Sort,
			&category.Pricing,
		)

		if err != nil {
			c.Log().Error(err)
			return categories
		}

		categories = append(categories, &category)
	}

	return
}

func GetCategoryTree(flat []*Category, parent *int64) (categories []*Category) {

	root := &Category{
		Children: make([]*Category, 0),
	}

	sort.Slice(flat, func(i, j int) bool {
		return flat[i].ID < flat[j].ID
	})

	for _, c := range flat {

		if c.Parent == nil {
			root.Children = append(root.Children, c)
			continue
		}

		if cur := root.WithID(*c.Parent); cur != nil {
			cur.Children = append(cur.Children, c)
		}
	}

	if parent != nil {
		rc := root.WithID(*parent)
		if rc != nil {
			return rc.Children
		}
	}

	return root.Children
}

func GetCategoryInheritedProps(categoryID int64) (props []*MetaProp) {

	props = make([]*MetaProp, 0)

	var path []*Category = make([]*Category, 0)

	from := GetCategoryByID(categoryID)

	for from != nil {

		path = append(path, from)

		if from.Parent != nil {
			from = GetCategoryByID(*from.Parent)
			continue
		}

		from = nil
	}

	slices.Reverse(path)

	hasProp := func(search *MetaProp) bool {
		for _, prop := range props {
			if prop.Name == search.Name {
				return true
			}
		}
		return false
	}

	for _, category := range path {
		for _, prop := range GetCategoryProps(category.ID) {
			if !hasProp(prop) {
				prop.Inherited = category.ID != categoryID
				if !prop.Inherited && prop.Sort != nil {
					// show parent props first
					prop.Sort = c.Int64P(*prop.Sort + 1)
				}
				props = append(props, prop)
			}
		}
	}

	slices.SortFunc(props, func(a, b *MetaProp) int {

		if a.Sort == nil && b.Sort == nil {
			return 0
		}

		if a.Sort != nil && b.Sort == nil {
			return 1
		}

		if a.Sort == nil && b.Sort != nil {
			return -1
		}

		if int(*a.Sort) == int(*b.Sort) {
			return 0
		}

		if int(*a.Sort) > int(*b.Sort) {
			return 1
		}

		if int(*a.Sort) < int(*b.Sort) {
			return -1
		}

		return 0
	})

	return
}

func GetCategoryProps(category int64) (metaProps []*MetaProp) {

	sql := `
		select
			mp.id,
			mp.name,
			mp.title,
			mp.group,
			mp.required,
			mp.template,
			mp.description,
			mp.help,
			mp.type,
			mp.options,
			mp.microdata,
			mp.sort
		from
			meta_assign as ma
		left join meta_props as mp on ma.meta = mp.id
		where
			ma.category = $1
		order by sort
	`

	metaProps = make([]*MetaProp, 0)

	rows, err := c.DB().Query(
		context.Background(),
		sql,
		category,
	)

	if err != nil {
		c.Log().Error(err)
		return
	}

	for rows.Next() {

		metaProp := &MetaProp{}

		var template, description, help *string

		err = rows.Scan(
			&metaProp.ID,
			&metaProp.Name,
			&metaProp.Title,
			&metaProp.Group,
			&metaProp.Required,
			&template,
			&description,
			&help,
			&metaProp.Type,
			&metaProp.Options,
			&metaProp.Microdata,
			&metaProp.Sort,
		)

		if template != nil {
			metaProp.Template = template
		}
		if description != nil {
			metaProp.Description = description
		}
		if help != nil {
			metaProp.Help = help
		}

		if err != nil {
			c.Log().Error(err)
			return
		}

		metaProps = append(metaProps, metaProp)
	}

	return metaProps
}
