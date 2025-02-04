package main

import (
	"aham/common/c"
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/TwiN/go-color"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"github.com/teris-io/shortid"
)

var redisc *redis.Client

func init() {

	godotenv.Load()

	opts, err := redis.ParseURL(os.Getenv("REDIS"))

	if err != nil {
		panic(err)
	}

	opts.UnstableResp3 = true

	c.Log().Infof("Connected to redis: %s", color.Ize(color.Yellow, opts.Addr))

	redisc = redis.NewClient(opts)

	redisc.Set(
		context.Background(),
		"URL_aham",
		"https://aham.ro",
		0,
	)
}

func storeURL(url string) (id string, err error) {

	cmd := redisc.Get(
		context.Background(),
		url,
	)

	if cmd.Val() != "" {
		return cmd.Val(), nil
	}

	id, err = shortid.Generate()

	if err != nil {
		return "", err
	}

	setvCMD := redisc.Set(
		context.Background(),
		"URL_"+id,
		url,
		0,
	)

	redisc.Set(
		context.Background(),
		url,
		id,
		0,
	)

	return id, setvCMD.Err()
}

func getURL(id string) (url string, exists bool) {

	cmd := redisc.Get(
		context.Background(),
		"URL_"+id,
	)

	url = cmd.Val()
	exists = cmd.Err() == nil

	return
}

func handler(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodPost {

		longURL := r.FormValue("url")

		shortID, err := storeURL(longURL)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		w.Write([]byte(fmt.Sprintf("%s/%s", os.Getenv("DOMAIN"), shortID)))

	} else if r.Method == http.MethodGet {
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

func main() {
	http.HandleFunc("/", handler)
	listen := os.Getenv("LISTEN")
	c.Log().Infof("Listen on %s", listen)
	if err := http.ListenAndServe(listen, nil); err != nil {
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
