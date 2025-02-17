package main

import (
	"aham/common/c"
	"aham/common/ws"
	"aham/service/api/route"
	"aham/service/api/service"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {

	godotenv.Load()

	rest := chi.NewMux()

	rest.Use(service.SecurityFilter)
	rest.Use(c.CORS())
	rest.Use(middleware.RealIP)
	rest.Use(middleware.Logger)

	rest.Route("/v1", func(r chi.Router) {

		r.Post("/users", route.CreateUser)
		r.Get("/me", c.Guard(route.GetCurrentUser))
		r.Get("/activate", route.ActivateUser)
		r.Post("/auth", route.Auth)
		r.Post("/auth/google", route.AuthWithGoogle)
		r.Post("/auth/facebook", route.AuthWithFacebook)

		r.Get("/config", route.Setup)

		r.Route("/sam", route.SecureAccessMap)
		r.Route("/gcm", route.GcmRoutes)

		r.Route("/props", route.PropsRoute)
		r.Route("/categories", route.CategoriesRoutes)
		r.Route("/ads", route.AdsRoutes)
		r.Route("/seo", route.SeoRotues)
		r.Route("/chat", route.ChatRoutes)
		r.Route("/metrics", route.MetricsRoutes)

		r.Post("/report", route.Report)

		r.Get("/counties", route.GetCounties)
		r.Get("/counties/{county}", route.GetCounty)
		r.Get("/cities/{city}", route.GetCity)
		r.Get("/cities", route.GetCities)

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
