package main

import (
	"aham/common/c"
	"aham/service/api/route"
	"fmt"
	"net/http"
	"os"

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

	listen := os.Getenv("LISTEN")

	fmt.Println("Server is listening on", listen)

	if err := http.ListenAndServe(listen, rest); err != nil {
		fmt.Println("Error starting server", err)
	}
}
