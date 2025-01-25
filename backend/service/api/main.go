package main

import (
	"aham/common/c"
	"aham/common/ws"
	"aham/service/api/route"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {

	rest := chi.NewMux()

	rest.Use(c.CORS())
	rest.Use(middleware.RealIP)

	rest.Route("/v1", func(r chi.Router) {

		r.Post("/users", route.CreateUser)
		r.Get("/me", c.Guard(route.GetCurrentUser))
		r.Get("/activate", route.ActivateUser)
		r.Post("/auth", route.Auth)

		r.Get("/uicfg", route.Setup)

		r.Get("/counties", route.GetCounties)
		r.Get("/counties/{county}", route.GetCounty)
		r.Get("/cities/{city}", route.GetCity)
		r.Get("/cities", route.GetCities)

		r.Get("/categories", route.GetCategories)
		r.Get("/categories/{id}", route.GetCategory)
		r.Get("/categories/{id}/props", route.GetCategoryProps)

		r.Post("/ads", c.Guard(route.CreateAd))
		r.Get("/ads/{id}", route.GetAd)
		r.Get("/ads", route.GetAds)
		r.Post("/report", route.Report)

		r.Post("/qa", c.Todo("create a question"))
		r.Post("/qa/{id}", c.Todo("post an answer"))
		r.Get("/qa/{id}", c.Todo("get a question"))

		r.Get("/sitemap", route.Sitemap)

		r.HandleFunc("/ws", ws.GetHandler())
	})

	listen := os.Getenv("LISTEN")

	if listen == "" {
		panic("LISTEN env is required")
	}

	c.Log().Info("Server is listening on", listen)

	if err := http.ListenAndServe(listen, rest); err != nil {
		c.Log().Info("Error starting server", err)
	}
}
