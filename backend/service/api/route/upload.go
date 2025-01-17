package route

import (
	"aham/common/c"
	"net/http"
)

func Upload(w http.ResponseWriter, r *http.Request) {

	if err := r.ParseMultipartForm(c.MAX_UPLOAD_SIZE); err != nil {
		c.Error(w, http.StatusBadRequest, "File too large")
		return
	}

}
