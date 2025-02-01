package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func SecureAccessMap(r chi.Router) {

	r.Get("/{resource}/{permission}", verifyResource)
}

func verifyResource(w http.ResponseWriter, r *http.Request) {

	id, err := c.UserID(r)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		c.Log().Error(err)
		return
	}

	user := db.GetUserByID(id)

	if user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		c.Log().Error("User expected, this might be a hacking attempt.")
		return
	}

	if !user.SamVerify(c.ID(r, "resource"), c.ID(r, "permission")) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}
