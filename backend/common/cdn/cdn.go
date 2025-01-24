package cdn

import (
	"aham/common/c"
	"errors"
	"fmt"
	"net/http"
	"os"
)

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

	req, err := http.NewRequest("PUT", fmt.Sprintf("%s/%s", os.Getenv("CDN"), uuid), nil)

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
