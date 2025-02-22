package main

import (
	"aham/common/c"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/TwiN/go-color"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"github.com/teris-io/shortid"
)

var db *sql.DB

func init() {

	godotenv.Load()

	dbfile := filepath.Join(os.Getenv("DBPATH"), "urls.db")

	c.Log().Infof("Using db %s", dbfile)

	var err error
	_db, err := sql.Open("sqlite3", dbfile)
	if err != nil {
		c.Log().Error(err)
		os.Exit(1)
	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS urls (
        "id" TEXT NOT NULL PRIMARY KEY,
        "url" TEXT NOT NULL
    );`

	_, err = _db.Exec(createTableSQL)
	if err != nil {
		c.Log().Error(err)
		os.Exit(1)
	}

	if err := _db.Ping(); err != nil {
		c.Log().Errorf("can't ping db: %s", err.Error())
		os.Exit(1)
	}

	c.Log().Info(color.Ize(color.Yellow, "Connected to database"))

	db = _db
}

func storeURL(url string) (id string, err error) {

	if url == "" {
		return id, errors.New("url can't be empty")
	}

	var existingID string
	err = db.QueryRow("SELECT id FROM urls WHERE url = ?", url).Scan(&existingID)
	if err == nil {
		return existingID, nil
	}

	id, err = shortid.Generate()
	if err != nil {
		return "", err
	}

	_, err = db.Exec("INSERT INTO urls (id, url) VALUES (?, ?)", id, url)
	if err != nil {
		return "", err
	}

	return id, nil
}

func getURL(id string) (url string, exists bool) {
	err := db.QueryRow("SELECT url FROM urls WHERE id = ?", id).Scan(&url)
	if err != nil {
		return "", false
	}
	return url, true
}

func handler(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodPost {

		longURL := r.FormValue("url")

		shortID, err := storeURL(longURL)

		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		c.Log().Infof("%s <- %s", shortID, longURL)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(fmt.Sprintf("%s/%s", os.Getenv("DOMAIN"), shortID)))

	} else if r.Method == http.MethodGet {

		if r.URL.Path == "/" {

			if external := r.URL.Query().Get("external"); external != "" {
				externalPage(w, external)
				return
			}

			http.Redirect(w, r, "https://aham.ro", http.StatusPermanentRedirect)
			return
		}

		shortID := r.URL.Path[1:]

		if longURL, exists := getURL(shortID); exists {
			http.Redirect(w, r, longURL, http.StatusPermanentRedirect)
			c.Log().Info(shortID, " -> ", longURL)
			return
		}

		c.Log().Info(shortID, " -> NULL")

		http.Redirect(w, r, "https://aham.ro", http.StatusTemporaryRedirect)
	}
}

func main() {

	mux := chi.NewMux()
	mux.Use(c.CORS())
	mux.HandleFunc("/*", handler)

	listen := os.Getenv("LISTEN")
	if listen == "" {
		c.Log().Error("listen env expected")
		os.Exit(1)
	}

	if err := http.ListenAndServe(listen, mux); err != nil {
		c.Log().Error(err)
	}
}

func externalPage(w http.ResponseWriter, url string) {
	html := `
		<!DOCTYPE html>
		<html lang="en">
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Link exterior | Aham</title>
			<style>
				body {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100vh;
					margin: 0;
					background-color: #f0f0f0;
					font-family: Arial, sans-serif;
				}
				.message {
					font-size: 18px;
					color: #333;
				}
				.message p {
					width: 500px;
					text-align: center;
				}
			</style>
		</head>
			<body>
				<div class="message">
					<p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAANJQTFRFAAAA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7oW/d+S/7sW/7QA/7QA/tNo/PTZ/7QA/7QA/7QA/tVx/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/7QA/tRu/7QA/7QA/7QA/78k/eu6/7QA/7QA/7YF/7QA/7QA/7QA/7oU/eOf/7QA/7QA/7QA/tJm/tJl/7QA/7QA/shC/PTY/7QA/7UC/sU6/7QA/7QA/7QA/7QA/7QA/7UAQLiuiAAAAEZ0Uk5TABp0GeT/mDoDyFtcE9aDKuv///8Eqv//qU/3/wfGYf0S3pHzJLb/pkT8//8L0f9n/ur//+kCif//NPD//5P//5Kop1myAoOuGIsAAAFPSURBVHic7dDvS8JAGAfw51GpZeGILCr8kWFQ9EMKFkj0or87iF4ERhISGQWJOYuKCsrIspo9nctt53bn1nvvxT333D5873YIgQcOqGgPgSgQDZu0HYQOdRLxKwAd/jFL6NOXKmiYNUItPxr9tu7R9KFjaIUp9Nafxj7s5chrX6pis5MMyNgoNfrQOL6weZy96zOrE8aTnM7gI5unDIg8sDpJd1KawHvgKEzTjYym8LaHzlJdQufwL8SmkKCamM5fg4tCsiqkarzuoSmsCKiStA7LNEC9sk7SW166aAcssHe97K6zdOGhK2jvwRKcOwlUdtMcnoFoLNOJi4bXyvbXVXaBU7vLldo9VMOSE7RRg8yx065Tkad5LDrfNlnqkdNqVODp9iF3vTyjBa7f2ufpzoHwn7o5ezyNpitSmdXfearFUJfINIV2eRpkDOg/6C9VO2QrFwCaMQAAAABJRU5ErkJggg==" /></p>
					<p>Adresa pe care vrei să o accesezi este pe un alt website decât <a href="https://aham.ro">aham.ro</a>, te rugăm verifică cu atenție adresa web înainte de a da click: <strong><a href="%s">%s</a></strong></p>
				</div>
			</body>
		</html>
	`

	w.Write([]byte(fmt.Sprintf(html, url, url)))
}
