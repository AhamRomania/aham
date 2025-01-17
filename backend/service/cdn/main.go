package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {

	mux := chi.NewMux()

	mux.Get("/cdn/*", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("CDN"))
	})

	http.ListenAndServe(":8080", mux)
}
