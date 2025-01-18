package main

import (
	"aham/common/c"
	"context"
	"encoding/json"
	"fmt"
	"hash/crc32"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type Upload struct {
	UUID        uuid.UUID `json:"uuid"`
	UserID      int64     `json:"uid"`
	Filename    string    `json:"filename"`
	Size        int64     `json:"size"`
	CRC         string    `json:"crc"`
	Mime        string    `json:"mime"`
	CreatedTime string    `json:"ctime"`
}

var redisc *redis.Client

func init() {

	if s, err := os.Stat(os.Getenv("FILES")); err != nil || !s.IsDir() {
		panic("FILES must be a directory")
	}

	opts, err := redis.ParseURL(os.Getenv("REDIS"))

	if err != nil {
		panic(err)
	}

	opts.UnstableResp3 = true

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

	uuid := strings.Split(r.URL.String(), "/")

	if len(uuid) != 2 {
		http.Error(w, "Nu am găsit resursa căutată. Eroare 400.", http.StatusBadRequest)
		return
	}

	cmd := redisc.Get(
		context.Background(),
		uuid[1],
	)

	if cmd.Err() != nil {
		http.Error(w, "Nu am găsit resursa căutată. Eroare 404.", http.StatusNotFound)
		return
	}

	var u = &Upload{}

	if err := json.Unmarshal([]byte(cmd.Val()), u); err != nil {
		http.Error(w, "Invalid json", http.StatusInternalServerError)
		return
	}

	path := filepath.Join(os.Getenv("FILES"), fmt.Sprint(u.UserID), u.UUID.String(), "raw")

	data, err := os.ReadFile(path)

	if err != nil {
		http.Error(w, "Invalid data", http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", u.Mime)

	w.Write(data)
}

func upload(w http.ResponseWriter, r *http.Request) {

	uid, err := c.UserID(r)

	if err != nil {
		http.Error(w, "Nu sunteți autentificat. Eroare 401.", http.StatusUnauthorized)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		c.Log().Error(err)
		http.Error(w, "Fail to parse request", http.StatusBadRequest)
		return
	}

	f, h, err := r.FormFile("file")

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut citi fișierul încărcat. Eroare 400.", http.StatusBadRequest)
		return
	}

	data, err := io.ReadAll(f)

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut citi fișierul încărcat. Eroare 500.", http.StatusInternalServerError)
		return
	}

	f.Seek(0, 0)

	defer f.Close()

	table := crc32.MakeTable(crc32.IEEE)
	checksum := crc32.Checksum(data, table)

	mime := http.DetectContentType(data)

	exts := []string{".jpg", ".jpeg", ".png"}

	ext := filepath.Ext(h.Filename)

	if slices.Index(exts, ext) == -1 {
		http.Error(w, "Extensia fișierului nu este permisă.", http.StatusBadRequest)
		return
	}

	if !strings.Contains(mime, "image/") {
		http.Error(w, "Tipul fișierului nu este permis. Folosește doar image/{jpeg|png}", http.StatusBadRequest)
		return
	}

	rid := uuid.New().String()

	fpath := filepath.Join(os.Getenv("FILES"), fmt.Sprint(uid), rid)

	if err := os.MkdirAll(fpath, os.ModePerm); err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut încărca fișierul.", http.StatusInternalServerError)
		return
	}

	dst, err := os.Create(filepath.Join(fpath, "raw"))

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut salva fișierul încărcat. Eroare 500.", http.StatusInternalServerError)
		return
	}

	if _, err := io.Copy(dst, f); err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut salva fișierul încărcat. Eroare 500.", http.StatusInternalServerError)
		return
	}

	uinfo := `
		{
			"uuid":"` + rid + `",
			"uid":` + fmt.Sprintf("%d", uid) + `,
			"filename":"` + h.Filename + `",
			"size":` + fmt.Sprintf("%d", h.Size) + `,
			"crc":"` + fmt.Sprintf("%08x", checksum) + `",
			"mime":"` + mime + `",
			"ctime":"` + fmt.Sprint(time.Now().Unix()) + `"
		}
	`

	if cmd := redisc.Set(context.Background(), rid, uinfo, 0); cmd.Err() != nil {
		c.Log().Error(cmd.Err())
		http.Error(w, "Nu am putut salva metadatele fișierului încărcat. Eroare 500.", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Add("Content-Type", "application/json")
	w.Write([]byte(uinfo))
}
