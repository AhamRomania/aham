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

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(fmt.Sprintf("%s/%s", os.Getenv("DOMAIN"), shortID)))

	} else if r.Method == http.MethodGet {

		if r.URL.Path == "/" {
			http.Redirect(w, r, "https://aham.ro", http.StatusPermanentRedirect)
			return
		}

		shortID := r.URL.Path[1:]

		fmt.Print(shortID, " -> ")

		if longURL, exists := getURL(shortID); exists {
			http.Redirect(w, r, longURL, http.StatusPermanentRedirect)
			fmt.Print(longURL, "\n")
			return
		}

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
	c.Log().Infof("Listen on %s", listen)
	if err := http.ListenAndServe(listen, mux); err != nil {
		c.Log().Error(err)
	}
}
