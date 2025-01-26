package c

import (
	"errors"
	"fmt"
)

func URL(ctx string, append ...string) (url string, err error) {

	var extra string = ""

	if len(append) > 0 {
		extra = string(append[0])
	}

	switch ctx {
	case "cdn":
		if Dev() {
			return fmt.Sprintf("https://cdn.aham.ro%s", extra), nil
		} else {
			return fmt.Sprintf("https://cdn.aham.ro%s", extra), nil
		}
	case "api":
		if Dev() {
			return fmt.Sprintf("https://api.aham.ro%s", extra), nil
		} else {
			return fmt.Sprintf("https://api.aham.ro%s", extra), nil
		}
	case "web":
		if Dev() {
			return fmt.Sprintf("http://localhost:3000%s", extra), nil
		} else {
			return fmt.Sprintf("https://aham.ro%s", extra), nil
		}
	}

	return "", errors.New("invalid context cdn,api,web")
}
