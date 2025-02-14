package main

import (
	"aham/common/c"
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/TwiN/go-color"
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
		return
	}

	createTableSQL := `CREATE TABLE IF NOT EXISTS urls (
        "id" TEXT NOT NULL PRIMARY KEY,
        "url" TEXT NOT NULL
    );`

	_, err = _db.Exec(createTableSQL)
	if err != nil {
		c.Log().Error(err)
		return
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
			http.Redirect(w, r, "https://aham.ro", http.StatusFound)
			return
		}

		shortID := r.URL.Path[1:] // Obtain the short ID from the path
		if longURL, exists := getURL(shortID); exists {
			body := strings.ReplaceAll(redirectPage, "LINK", longURL)
			w.Write([]byte(body))
			// http.Redirect(w, r, longURL, http.StatusFound)
			return
		}
		http.Error(w, "URL not found", http.StatusNotFound)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	http.HandleFunc("/", handler)
	listen := os.Getenv("LISTEN")
	if listen == "" {
		c.Log().Error("listen env expected")
		os.Exit(1)
	}
	c.Log().Infof("Listen on %s", listen)
	if err := http.ListenAndServe(listen, corsMiddleware(http.DefaultServeMux)); err != nil {
		c.Log().Error(err)
	}
}

const redirectPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
        }
        .container {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Redirecționare...</h1>
        <p>Vă rugăm așteptați, ve-ți fi redirecționat într-o clipă.</p>
        <p>Dacă nu ești redirecționat apasă, <a href="LINK">aici</a>.</p>
    </div>

    <script>
        const shortUrl = 'LINK';
        const delay = 2420;
        setTimeout(function() {
            window.location.href = shortUrl;
        }, delay);
        document.getElementById('link').href = shortUrl;
    </script>
</body>
</html>
`
