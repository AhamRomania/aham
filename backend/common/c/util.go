package c

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type D map[string]any
type M map[string]string

func (a D) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *D) Scan(value interface{}) error {

	b, ok := value.([]byte)

	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(b, &a)
}

func (a M) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *M) Scan(value interface{}) error {

	b, ok := value.([]byte)

	if !ok {
		return errors.New("type assertion to []byte failed")
	}

	return json.Unmarshal(b, &a)
}

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

func Copy(dst, from any) error {

	data, err := json.Marshal(from)

	if err != nil {
		return err
	}

	return json.Unmarshal(data, dst)
}
