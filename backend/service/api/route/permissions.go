package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"net/http"

	"github.com/go-chi/chi/v5"
)

var sam = make(map[int64]map[int64]int)

func SecureAccessMap(r chi.Router) {
	r.Get("/flush", flush)
	r.Get("/{resource}/{permission}", verifyResource)
}

func flush(w http.ResponseWriter, r *http.Request) {
	sam = make(map[int64]map[int64]int)
}

func verifyResource(w http.ResponseWriter, r *http.Request) {

	resource := c.ID(r, "resource")
	permission := c.ID(r, "permission")

	id, err := c.UserID(r)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		c.Log().Error(err)
		return
	}

	if perm, cached := sam[id]; cached {
		if perm[resource] == int(permission) {
			w.WriteHeader(http.StatusAccepted)
			return
		}
	}

	user := db.GetUserByID(id)

	if user == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		c.Log().Error("User expected, this might be a hacking attempt.")
		return
	}

	if !user.SamVerify(resource, permission) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if _, cached := sam[user.ID]; !cached {
		sam[user.ID] = make(map[int64]int)
	}

	sam[user.ID][resource] = int(permission)

	w.WriteHeader(http.StatusAccepted)
}
