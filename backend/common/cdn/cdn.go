package cdn

import (
	"aham/common/c"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strings"
)

func Store(owner int64, url string, mimePrefix string) (id string, err error) {

	resp, err := http.Get(url)

	if err != nil {
		return "", err
	}

	imageData, err := io.ReadAll(resp.Body)

	if err != nil {
		return "", err
	}

	mime := http.DetectContentType(imageData)

	if !strings.HasPrefix(mime, mimePrefix) {
		return "", fmt.Errorf("formatul %s nu este acceptat", mime)
	}

	url, err = c.URL("cdn")

	if err != nil {
		return "", err
	}

	var b []byte = make([]byte, 0)
	bd := bytes.NewBuffer(b)
	mp := multipart.NewWriter(bd)

	aw, err := mp.CreateFormFile("file", "avatar.png")

	if err != nil {
		return "", err
	}

	n, err := io.Copy(aw, bytes.NewBuffer(imageData))

	if err != nil {
		return "", err
	}

	c.Log().Infof("Writen %d bytes of picture", n)

	mp.Close()

	req, err := http.NewRequest(
		"POST", url,
		bytes.NewReader(bd.Bytes()),
	)

	if err != nil {
		return "", err
	}

	jwt, err := c.JWTUserID(owner)

	if err != nil {
		return "", err
	}

	req.Header.Add("Content-Type", mp.FormDataContentType())
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", jwt))

	resp, err = http.DefaultClient.Do(req)

	if err != nil {
		return "", err
	}

	respJsonStr, err := io.ReadAll(resp.Body)

	if err != nil {
		return "", err
	}

	type UploadResponse struct {
		UUID string `json:"uuid"`
	}

	var respUUID = UploadResponse{}

	if err := json.NewDecoder(bytes.NewBuffer(respJsonStr)).Decode(&respUUID); err != nil {
		return "", errors.New("nu am putut citi raspunsul cdn json")
	}

	return respUUID.UUID, Persist(respUUID.UUID)
}

func Has(uuid string) bool {

	req, err := http.NewRequest("TRACE", fmt.Sprintf("%s/%s", os.Getenv("CDN"), uuid), nil)

	if err != nil {
		c.Log().Error(err)
		return false
	}

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		c.Log().Error(err)
		return false
	}

	return resp.StatusCode == 200
}

func Persist(uuid string) error {

	if uuid == "" {
		return errors.New("uuid is mandatory to persist")
	}

	url := fmt.Sprintf("%s/%s", os.Getenv("CDN"), uuid)

	c.Log().Infof("Persisting CDN URL: %s", url)

	req, err := http.NewRequest("PUT", url, nil)

	if err != nil {
		c.Log().Error(err)
		return err
	}

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		c.Log().Error(err)
		return err
	}

	if resp.StatusCode != 200 {
		c.Log().Errorf("Can't save upload, status code is: ", resp.StatusCode)
		return errors.New("can't save upload")
	}

	return nil
}
