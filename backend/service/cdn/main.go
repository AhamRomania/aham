package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

var redisc *redis.Client

func init() {

	opts, err := redis.ParseURL(os.Getenv("REDIS"))

	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to redis @", opts.Addr)

	redisc = redis.NewClient(opts)
}

func main() {

	mux := chi.NewMux()

	mux.Post("/", upload)

	mux.Get("/{uuid}", serve)

	listen := os.Getenv("LISTEN")

	fmt.Println("Server is listening on", listen)

	if err := http.ListenAndServe(listen, mux); err != nil {
		fmt.Println("Error starting server", err)
	}
}

func serve(w http.ResponseWriter, r *http.Request) {

	cmd := redisc.Get(
		context.Background(),
		chi.URLParam(r, "uuid"),
	)

	if cmd.Err() != nil {
		http.Error(w, "Nu am găsit resursa căutată. Eroare 404.", http.StatusNotFound)
		return
	}

	w.Write([]byte(cmd.Val()))
}

func upload(w http.ResponseWriter, r *http.Request) {
	rid := uuid.New().String()
	redisc.Set(context.Background(), rid, "hello", 0)
	w.Write([]byte(`{"uuid":"` + rid + `"}`))
}
