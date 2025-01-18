package c

import (
	"net/http"
	"testing"
)

func TestJWT(t *testing.T) {

	token, err := JWTUserID(1)
	if err != nil {
		t.Errorf("JWTUserID(1) failed, expected nil, got %v", err)
	}

	r, _ := http.NewRequest("", "", nil)
	r.Header.Set("Authorization", "Bearer "+token)

	id, err := UserID(r)

	if err != nil {
		t.Error(err.Error())
		return
	}

	if id != 1 {
		t.Errorf("UserID(nil) failed, expected 1, got %v", id)
	}
}
