package main

import (
	"aham/common/c"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/google/uuid"
)

func TestUploadSuccess(t *testing.T) {

	var userID int64 = 100000

	token, _ := c.JWTUserID(userID)

	buf := &bytes.Buffer{}

	body := multipart.NewWriter(buf)

	w, err := body.CreateFormFile("file", "test.jpeg")

	if err != nil {
		t.Error(err)
		return
	}

	data, err := os.ReadFile(filepath.Join(os.Getenv("FILES"), "test.png"))

	if err != nil {
		t.Error(err)
		return
	}

	if _, err := w.Write(data); err != nil {
		t.Error(err)
		return
	}

	body.Close()

	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/", buf)

	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Content-Type", fmt.Sprintf(`multipart/form-data; boundary="%s"`, body.Boundary()))

	upload(rec, req)

	data, err = io.ReadAll(rec.Body)

	if err != nil {
		t.Error(err)
		return
	}

	if rec.Result().StatusCode != 200 {
		t.Error(string(data))
		return
	}

	type Upload struct {
		UUID     uuid.UUID `json:"uuid"`
		UserID   int64     `json:"uid"`
		Filename string    `json:"filename"`
	}

	var u = &Upload{}

	if err := json.Unmarshal(data, u); err != nil {
		t.Error(err)
		return
	}

	path := filepath.Join(os.Getenv("FILES"), fmt.Sprint(userID), u.UUID.String())

	fi, err := os.Stat(path)

	if err != nil {
		t.Error(err)
		return
	}

	if fi.IsDir() {
		if err := os.RemoveAll(filepath.Dir(path)); err != nil {
			t.Error(err)
			return
		}
	}
}
