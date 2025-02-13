package c

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"unicode"

	"github.com/go-chi/chi/v5"
	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

type D map[string]any
type M map[string]string

func (a D) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *D) Scan(value interface{}) error {

	if value == nil {
		return nil
	}

	b, ok := value.(string)

	if !ok {
		return errors.New("c.D type assertion to []byte failed")
	}

	return json.Unmarshal([]byte(b), &a)
}

func (a M) Value() (driver.Value, error) {
	return json.Marshal(a)
}

func (a *M) Scan(value interface{}) error {

	if value == nil {
		return nil
	}

	b, ok := value.(string)

	if !ok {
		return errors.New("c.M type assertion to []byte failed")
	}

	return json.Unmarshal([]byte(b), &a)
}

func NilID(id int64) *int64 {
	return Int64P(id)
}

func Int64P(v int64) *int64 {
	if v == 0 {
		return nil
	}
	return &v
}

func String(s string) *string {
	return &s
}

func Dev() bool {
	return os.Getenv("DEV") == "true"
}

type Subdomain string

const (
	Web Subdomain = "web"
	Api Subdomain = "api"
	Cdn Subdomain = "cdn"
)

func URLF(sd Subdomain, s string, a ...any) string {

	dev := os.Getenv("DEV") == "true"

	domains := map[Subdomain]string{
		Web: "https://aham.ro",
		Api: "https://api.aham.ro",
		Cdn: "https://cdn.aham.ro",
	}

	if dev {
		domains[Web] = "http://localhost:3000"
		domains[Api] = "http://localhost:8001"
		domains[Cdn] = "http://localhost:8002"
	}

	return fmt.Sprintf(domains[sd]+s, a...)
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
		w.WriteHeader(http.StatusNotImplemented)
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

func Normalize(s string) string {
	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	result, _, err := transform.String(t, s)
	if err != nil {
		return ""
	}
	return strings.ToLower(result)
}
