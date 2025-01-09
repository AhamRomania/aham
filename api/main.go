package main

import (
	"aham/c"
	"aham/route"
	"flag"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func main() {

	rest := chi.NewMux()

	rest.Post("/users", route.CreateUser)
	rest.Get("/users/me", c.Guard(route.GetCurrentUser))
	rest.Post("/auth", route.Auth)
	rest.Post("/ads", route.CreateAd)
	rest.Get("/ads/{id}", route.GetAd)

	port := flag.String("port", ":8080", "Rest api http port")

	flag.Parse()

	fmt.Println("Server is running on port", *port)

	http.ListenAndServe(*port, rest)
}
