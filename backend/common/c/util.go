package c

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func NilID(id int64) *int64 {
	if id == 0 {
		return nil
	}
	return &id
}

func String(s string) *string {
	return &s
}

func URLF(s string, a ...any) string {

	xtr := append([]any{DOMAIN}, a...)

	return fmt.Sprintf(
		"https://%s"+s,
		xtr...,
	)
}

func NilString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func ID(r *http.Request, name string) int64 {

	n, err := strconv.ParseInt(chi.URLParam(r, name), 10, 64)

	if err != nil {
		Log().Error(err)
		return -0
	}

	return n
}

func Todo(todo string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Todo: " + todo))
	}
}
