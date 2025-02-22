package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"bytes"
	"net/http"
	"time"
)

func Sitemap(res http.ResponseWriter, req *http.Request) {

	b := bytes.NewBufferString(`<?xml version="1.0" encoding="UTF-8"?>`)
	b.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)

	for _, c := range db.GetCategoriesFlat() {
		writeLoc(b, c.Link(), time.Now().Format("2006-01-02"))
	}

	for _, ad := range db.GetAds(0, db.Filter{}) {
		writeLoc(b, c.URLF(c.Web, "/"+ad.Href), ad.Created.Format("2006-01-02"))
	}

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
