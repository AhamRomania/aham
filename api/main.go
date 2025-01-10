package main

import (
	"aham/c"
	"aham/route"
	"flag"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {

	rest := chi.NewMux()

	rest.Use(middleware.RealIP)

	rest.Route("/v1", func(r chi.Router) {
		r.Post("/users", route.CreateUser)
		r.Get("/users/me", c.Guard(route.GetCurrentUser))
		r.Get("/activate", route.ActivateUser)
		r.Post("/auth", route.Auth)
		r.Post("/upload", route.Upload)
		r.Post("/ads", route.CreateAd)
		r.Get("/ads/{id}", route.GetAd)
		r.Post("/report", route.Report)
	})

	port := flag.String("port", ":8080", "Rest api http port")

	flag.Parse()

	fmt.Println("Server is running on port", *port)

	http.ListenAndServe(*port, rest)
}
