package service

import (
	"aham/common/c"
	"aham/common/cdn"
	"aham/service/api/db"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/render"
)

var ErrRemoteUnauthorized = errors.New("remote unauthorized")

type ThirdPartyAuthRequest struct {
	AccessToken string `json:"access_token"`
}

type RemoteUserInfo struct {
	Email       string         `json:"email"`
	Name        string         `json:"name"`
	Picture     string         `json:"picture"`
	AccessToken string         `json:"access_token"`
	Meta        map[string]any `json:"meta"`
}

func (ui *RemoteUserInfo) Names() (first string, last string, err error) {

	np := strings.Split(ui.Name, " ")

	if len(np) != 2 {
		return "", "", errors.New("expected first and last name")
	}

	return np[0], np[1], nil
}

type ThirdPartySignIn struct {
	adapter ThirdPartyAdapter
	r       *http.Request
}

func NewThirdPartySignIn(adapter ThirdPartyAdapter, r *http.Request) *ThirdPartySignIn {
	return &ThirdPartySignIn{adapter, r}
}

func (tpsi *ThirdPartySignIn) GetUser() (user *db.User, err error) {

	c.Log().Infof("Auth with %s", tpsi.adapter.Slug())

	info, err := tpsi.UserInfo()

	if err != nil {
		return nil, err
	}

	if info.Email == "" {
		return nil, errors.New("email expected")
	}

	user, _ = db.GetUserByEmail(info.Email)

	if user == nil {

		first, last, err := info.Names()

		if err != nil {
			return nil, err
		}

		user = &db.User{
			Email:                 info.Email,
			GivenName:             first, //bug
			FamilyName:            last,
			Source:                tpsi.adapter.Slug(),
			ThirdPartyAccessToken: info.AccessToken,
		}

		if err := user.Create(); err != nil {
			return nil, err
		}

		if info.Picture != "" {

			id, err := cdn.Store(user.ID, info.Picture, "image")

			if err != nil {
				c.Log().Errorf("CdnStore: %s", err.Error())
				return user, err
			}

			pictureURL, err := c.URL("cdn", "/"+id)

			if err != nil {
				return user, err
			}

			if err := user.SetPicture(pictureURL); err != nil {
				c.Log().Errorf("Failed to set user picture: %s", err.Error())
				return user, err
			}
		}
	}

	return
}

func (tpsi *ThirdPartySignIn) UserInfo() (info *RemoteUserInfo, err error) {

	payload := &ThirdPartyAuthRequest{}

	if err := json.NewDecoder(tpsi.r.Body).Decode(&payload); err != nil {
		return nil, errors.New("invalid auth payload data format")
	}

	if payload.AccessToken == "" {
		return nil, errors.New("access token missing")
	}

	return tpsi.adapter.Fetch(payload)
}

type ThirdPartyAdapter interface {
	Slug() string
	Fetch(req *ThirdPartyAuthRequest) (info *RemoteUserInfo, err error)
}

type FacebookAdapter struct{}
type GoogleAdapter struct{}

func (ga *GoogleAdapter) Slug() string { return "google" }
func (ga *GoogleAdapter) Fetch(payload *ThirdPartyAuthRequest) (info *RemoteUserInfo, err error) {

	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+payload.AccessToken, nil)

	if err != nil {
		c.Log().Error(err)
		return nil, errors.New("nu am putut crea un obiect de conectare cu Google")
	}

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		c.Log().Error(err)
		return nil, errors.New("nu am putut crea o conectare cu Google")
	}

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("nu am primit răspunsul așteptat pentru conectarea cu Google")
	}

	type GoogleTokenInfo struct {
		Email      string `json:"email"`
		GivenName  string `json:"given_name"`
		FamilyName string `json:"family_name"`
		Picture    string `json:"picture"`
	}

	var data GoogleTokenInfo = GoogleTokenInfo{}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		c.Log().Error(err)
		return nil, errors.New("nu am primit date json pentru conectarea cu Google")
	}

	return &RemoteUserInfo{
		Email:       data.Email,
		Picture:     data.Picture,
		Name:        fmt.Sprintf("%s %s", data.GivenName, data.FamilyName),
		AccessToken: payload.AccessToken,
	}, nil
}

func (fa *FacebookAdapter) Slug() string { return "facebook" }
func (fa *FacebookAdapter) Fetch(payload *ThirdPartyAuthRequest) (info *RemoteUserInfo, err error) {

	req, err := http.NewRequest("GET", fmt.Sprintf("https://graph.facebook.com/v22.0/me/?fields=id,name,email,picture&access_token=%s", payload.AccessToken), nil)

	if err != nil {
		c.Log().Error(err)
		return nil, errors.New("eroare la crearea de request pentru a obține datele de conectare cu Facebook")
	}

	resp, err := http.DefaultClient.Do(req)

	if err != nil {
		c.Log().Error(err)
		return nil, errors.New("eroare la raspunsul pentru a obține datele de conectare cu Facebook")
	}

	type FacebookTokenInfo struct {
		ID      string `json:"id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture struct {
			Data struct {
				Url string `json:"url"`
			} `json:"data"`
		} `json:"picture"`
	}

	var data FacebookTokenInfo = FacebookTokenInfo{}

	if err := render.DecodeJSON(resp.Body, &data); err != nil {
		c.Log().Error(err)
		return nil, errors.New("nu am primit date json pentru conectarea cu Google")
	}

	var picture string

	if data.Picture.Data.Url != "" {
		picture = data.Picture.Data.Url
	}

	return &RemoteUserInfo{
		Email:       data.Email,
		Name:        data.Name,
		Picture:     picture,
		AccessToken: payload.AccessToken,
		Meta: map[string]any{
			"id": data.ID,
		},
	}, nil
}
