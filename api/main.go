package main

import (
	"aham/route"
	"flag"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {

	rest := chi.NewMux()

	rest.Post("/ad", route.CreateAd)
	rest.Get("/ad/{id}", route.GetAd)

	port := flag.String("port", ":8080", "Rest api http port")

	flag.Parse()

	http.ListenAndServe(*port, rest)
}
