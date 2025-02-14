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
)

func TestUploadAndAccess(t *testing.T) {

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

	if rec.Result().StatusCode != 201 {
		t.Error(string(data))
		return
	}

	var u = &MetaInfo{}

	if err := json.Unmarshal(data, u); err != nil {
		t.Error(err)
		return
	}

	defer func() {

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

	}()

	rec = httptest.NewRecorder()
	req = httptest.NewRequest("GET", fmt.Sprintf("/%s", u.UUID.String()), nil)

	serve(rec, req)

	if rec.Result().StatusCode != 200 {
		t.Error("Failed to serve newly created upload. Got", rec.Result().StatusCode)
		return
	}
}
