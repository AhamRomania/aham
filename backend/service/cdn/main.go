package main

import (
	"aham/common/c"
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"hash/crc32"
	"image"
	"image/color"
	"image/draw"
	_ "image/gif"
	_ "image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/httprate"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/nfnt/resize"
)

type MetaInfo struct {
	UUID     uuid.UUID `json:"uuid"`
	UID      int64     `json:"uid"`
	Filename string    `json:"filename"`
	Size     int64     `json:"size"`
	CRC      string    `json:"crc"`
	Mime     string    `json:"mime"`
	CTime    int64     `json:"ctime"`
}

var uploadRateLimiter = httprate.NewRateLimiter(100, time.Minute)

func main() {

	godotenv.Load()

	mux := chi.NewMux()

	mux.Use(c.CORS())
	mux.Use(middleware.RealIP)
	mux.Use(middleware.Logger)

	mux.Post("/", upload)

	mux.Get("/{uuid}", serve)

	mux.Trace("/{uuid}", trace)

	mux.Put("/{uuid}", persist)

	mux.Delete("/{uuid}", remove)

	listen := os.Getenv("LISTEN")

	c.Log().Infof("Server is listening on: %s", listen)

	if os.Getenv("HTTP2") == "" {
		if err := http.ListenAndServe(listen, mux); err != nil {
			c.Log().Errorf("Error starting server: %s", err.Error())
		}
		return
	}

	c.Log().Info("Using HTTP2")

	// Configure the TLS settings for HTTP/2
	tlsConfig := &tls.Config{
		NextProtos: []string{"h2"},
	}

	server := &http.Server{
		Addr:      listen,
		Handler:   mux,
		TLSConfig: tlsConfig,
	}

	cert, key := os.Getenv("CERT"), os.Getenv("KEY")

	c.Log().Infof("Cert %s", cert)
	c.Log().Infof("Key %s", key)

	if err := server.ListenAndServeTLS(cert, key); err != nil {
		c.Log().Errorf("Error starting server: %s", err.Error())
	}
}

func storePath(id uuid.UUID) string {
	return filepath.Join(
		os.Getenv("FILES"),
		id.String()[0:2],
		id.String()[2:4],
		id.String()[4:6],
		id.String()[6:8],
		id.String(),
	)
}

func trace(w http.ResponseWriter, r *http.Request) {

	id, err := uuid.Parse(chi.URLParam(r, "uuid"))

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	path := storePath(id)

	if fi, err := os.Stat(path); err != nil || !fi.IsDir() {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	meta, err := os.ReadFile(filepath.Join(path, "meta.json"))

	if err != nil {
		c.Log().Errorf("expected meta.json file on %s", path)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.Write(meta)
}

func persist(w http.ResponseWriter, r *http.Request) {
	// todo:
}

func remove(w http.ResponseWriter, r *http.Request) {

	id, err := uuid.Parse(chi.URLParam(r, "uuid"))

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if _, err := c.UserID(r); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	path := storePath(id)

	if fi, err := os.Stat(path); err != nil || !fi.IsDir() {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if err := os.RemoveAll(path); err != nil {
		c.Log().Errorf("can't remove path: %s", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusGone)
}

func watermark(img image.Image) image.Image {

	path := filepath.Join(os.Getenv("FILES"), "watermark.png")

	watermarkFile, err := os.Open(path)

	if err != nil {
		c.Log().Error("Error opening watermark:", err)
		return img
	}

	defer watermarkFile.Close()

	watermarkImg, _, err := image.Decode(watermarkFile)

	if err != nil {
		c.Log().Error("Error decoding watermark:", err)
		return img
	}

	watermarkImg = resize.Resize(42, 0, watermarkImg, resize.Lanczos3)

	watermarkImg = adjustOpacity(watermarkImg, 0.24)

	offset := image.Pt(img.Bounds().Dx()-watermarkImg.Bounds().Dx()-20, img.Bounds().Dy()-watermarkImg.Bounds().Dy()-20)

	newImg := image.NewRGBA(img.Bounds())
	draw.Draw(newImg, img.Bounds(), img, image.Point{}, draw.Src)
	draw.Draw(newImg, watermarkImg.Bounds().Add(offset), watermarkImg, image.Point{}, draw.Over)

	return newImg.SubImage(newImg.Rect)
}

func adjustOpacity(img image.Image, opacity float64) *image.NRGBA {
	bounds := img.Bounds()
	newImg := image.NewNRGBA(bounds)

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {
			r, g, b, a := img.At(x, y).RGBA()
			alpha := uint16(float64(a) * opacity) // Adjust opacity (0.0 to 1.0)

			newImg.Set(x, y, color.NRGBA{
				R: uint8(r >> 8),
				G: uint8(g >> 8),
				B: uint8(b >> 8),
				A: uint8(alpha >> 8),
			})
		}
	}

	return newImg
}

func CropToAspect(img image.Image, width, height int) image.Image {
	aspectW, aspectH := 4, 3

	var newWidth, newHeight int
	if width*aspectH > height*aspectW {
		newWidth = height * aspectW / aspectH
		newHeight = height
	} else {
		newWidth = width
		newHeight = width * aspectH / aspectW
	}

	x0 := (width - newWidth) / 2
	y0 := 0

	cropRect := image.Rect(x0, y0, x0+newWidth, y0+newHeight)
	cropped := image.NewRGBA(cropRect)
	draw.Draw(cropped, cropped.Bounds(), img, cropRect.Min, draw.Src)

	return cropped
}

func serve(w http.ResponseWriter, r *http.Request) {

	id, err := uuid.Parse(chi.URLParam(r, "uuid"))

	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	path := storePath(id)

	var width uint = 624

	if n, err := strconv.ParseInt(r.URL.Query().Get("w"), 10, 32); err == nil {
		width = uint(n)
	}

	if width == 0 {
		http.Error(w, "width is 0", http.StatusBadRequest)
		return
	}

	rawPath := filepath.Join(path, "raw")
	pathSized := filepath.Join(path, fmt.Sprint(width))

	rawFileInfo, err := os.Stat(rawPath)

	if err != nil {
		c.Log().Errorf("can't stat raw file: %s", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	metaData, err := os.ReadFile(filepath.Join(path, "meta.json"))

	if err != nil {
		c.Log().Errorf("can't read meta file: %s", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var meta MetaInfo

	if err := json.NewDecoder(bytes.NewBuffer(metaData)).Decode(&meta); err != nil {
		c.Log().Errorf("can't decode meta file: %s", err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "image/png")
	w.Header().Add("Created-At", rawFileInfo.ModTime().String())
	w.Header().Add("X-Filename", meta.Filename)
	w.Header().Add("X-Crc", meta.CRC)
	w.Header().Add("Cache-Control", "public, max-age=3600")

	if _, err := os.Stat(pathSized); err == nil {
		data, err := os.ReadFile(pathSized)
		if err != nil {
			c.Log().Error(err)
			http.Error(w, "Invalid file path", http.StatusInternalServerError)
			return
		}
		w.Write(data)
		return
	}

	file, err := os.Open(rawPath)

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Invalid file path", http.StatusInternalServerError)
		return
	}

	defer file.Close()

	img, _, err := image.Decode(file)

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Invalid image file", http.StatusInternalServerError)
		return
	}

	// crop to aspect ratio
	m := CropToAspect(img, img.Bounds().Dx(), img.Bounds().Dy())

	// crop to requested size
	m = resize.Resize(width, 0, m, resize.Lanczos3)

	// add watermark
	//m = watermark(m)

	buf := &bytes.Buffer{}

	if err := png.Encode(buf, m); err != nil {
		http.Error(w, "Encode png failed", http.StatusInternalServerError)
		return
	}

	f, err := os.OpenFile(pathSized, os.O_CREATE|os.O_WRONLY, os.ModePerm)
	if err != nil {
		http.Error(w, "Open for caching failed", http.StatusInternalServerError)
		return
	}

	if _, err := f.Write(buf.Bytes()); err != nil {
		http.Error(w, "Failed to write bytes to sized image", http.StatusInternalServerError)
		return
	}

	f.Close()

	w.Write(buf.Bytes())
}

func upload(w http.ResponseWriter, r *http.Request) {

	uid, err := c.UserID(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	if uploadRateLimiter.RespondOnLimit(w, r, fmt.Sprint(uid)) {
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

	rid := uuid.New()

	fpath := storePath(rid)

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

	dst.Close()

	img, _, err := image.Decode(bytes.NewBuffer(data))

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut decoda fișierul. Eroare 500.", http.StatusInternalServerError)
		return
	}

	dstPNG, err := os.Create(filepath.Join(fpath, "png"))

	if err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut salva fișierul încărcat. Eroare 500.", http.StatusInternalServerError)
		return
	}

	if err := png.Encode(dstPNG, img); err != nil {
		c.Log().Error(err)
		http.Error(w, "Nu am putut decoda fișierul pentru format standard. Eroare 500.", http.StatusInternalServerError)
		return
	}

	dstPNG.Close()

	meta := MetaInfo{
		UUID:     rid,
		UID:      uid,
		Filename: h.Filename,
		Size:     h.Size,
		CRC:      fmt.Sprintf("%08x", checksum),
		Mime:     mime,
		CTime:    time.Now().Unix(),
	}

	metab := &bytes.Buffer{}

	if err := json.NewEncoder(metab).Encode(meta); err != nil {
		c.Log().Error("failed to encode meta data")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	err = os.WriteFile(
		filepath.Join(fpath, "meta.json"),
		metab.Bytes(),
		os.ModePerm,
	)

	if err != nil {
		c.Log().Error("failed to store meta file")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Add("Content-Type", "application/json")
	w.Write(metab.Bytes())
}
