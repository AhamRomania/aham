package route

import (
	"aham/service/api/db"
	"bytes"
	"fmt"
	"net/http"
	"time"
)

func Sitemap(res http.ResponseWriter, req *http.Request) {

	b := bytes.NewBufferString(`<?xml version="1.0" encoding="UTF-8"?>`)
	b.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)

	for _, cat := range db.GetCategories() {
		writeLoc(b, fmt.Sprintf("https://aham.ro/%s", cat.Slug), time.Now().Format("2006-01-02"))
	}

	/*
		for _, ad := range service.GetAds().Query(service.AdQuery{}) {
			writeLoc(b, fmt.Sprintf("https://aham.ro/%s/%s", ad.CategorySlug, ad.Link()), ad.CreatedAt.Format("2006-01-02"))
		}
	*/

	b.WriteString(`</urlset>`)
	res.Write(b.Bytes())
}

func writeLoc(b *bytes.Buffer, loc, lastmod string) {
	b.WriteString(`<url>`)
	b.WriteString(`<loc>`)
	b.WriteString(loc)
	b.WriteString(`</loc>`)
	b.WriteString(`<lastmod>`)
	b.WriteString(lastmod)
	b.WriteString(`</lastmod>`)
	b.WriteString(`</url>`)
}
