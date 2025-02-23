package route

import (
	"aham/common/c"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func MetricsRoutes(r chi.Router) {
	r.Get("/track", track)
}

func Track(user *int64, kind string, metadata string) (err error) {
	w := httptest.NewRecorder()
	u := &url.URL{Path: "/track"}
	q := u.Query()
	q.Add("kind", kind)
	q.Add("metadata", metadata)
	q.Add("user", fmt.Sprint(user))
	u.RawQuery = q.Encode()
	r, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return err
	}

	track(w, r)

	if w.Result().StatusCode != http.StatusOK {
		return errors.New("can't track event")
	}

	return nil
}

func track(w http.ResponseWriter, r *http.Request) {

	kind := r.URL.Query().Get("kind")
	user := c.QueryIntParam(r, "user", 0)
	metadata := r.URL.Query().Get("metadata")

	if kind == "" {
		pixel(w)
		return
	}

	go func() {

		conn, err := pgx.Connect(context.Background(), os.Getenv("METRICS"))

		if err != nil {
			c.Log().Errorf("Can't get metrics db connection:", err)
			return
		}

		if err := conn.Ping(context.TODO()); err != nil {
			c.Log().Errorf("Can't ping metrics db connection:", err)
			return
		}

		var data = c.D{}
		if err := json.Unmarshal([]byte(metadata), &data); err != nil {
			c.Log().Error(err)
			return
		}

		metadataJSON, err := json.Marshal(data)

		if err != nil {
			c.Log().Error(err)
			return
		}

		ip := c.IP(r)

		_, err = conn.Exec(
			context.Background(),
			`insert into events ("uuid","kind","user","metadata","ip","agent","time") values ($1,$2,$3,$4,$5,$6,$7)`,
			uuid.New().String(),
			kind,
			user,
			string(metadataJSON),
			ip,
			r.UserAgent(),
			time.Now(),
		)

		if err != nil {
			c.Log().Errorf("Can't insert metrics:", err)
			return
		}

		conn.Close(context.TODO())

	}()

	pixel(w)
}

func pixel(w http.ResponseWriter) {
	w.Write([]byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00})
	w.Header().Set("Content-Type", "image/png")
	w.WriteHeader(http.StatusOK)
}
