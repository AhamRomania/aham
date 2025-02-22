package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"net/http"
	"sync"

	"github.com/go-chi/chi/v5"
)

var sam_cache = make(map[int64]map[sam.Resource]sam.Perm)
var mux sync.Mutex

func SecureAccessMap(r chi.Router) {
	r.Get("/flush", flush)
	r.Get("/{resource}/{permission}", verifyResource)
}

func flush(w http.ResponseWriter, r *http.Request) {
	sam_cache = make(map[int64]map[sam.Resource]sam.Perm)
}

func verifyResource(w http.ResponseWriter, r *http.Request) {

	resource := sam.Resource(c.ID(r, "resource"))
	permission := sam.Perm(c.ID(r, "permission"))

	id, err := c.UserID(r)

	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		c.Log().Error(err)
		return
	}

	if perm, cached := sam_cache[id]; cached {
		if perm[resource] == permission {
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

	mux.Lock()
	defer mux.Unlock()

	if _, cached := sam_cache[user.ID]; !cached {
		sam_cache[user.ID] = make(map[sam.Resource]sam.Perm)
	}

	sam_cache[user.ID][resource] = permission

	w.WriteHeader(http.StatusAccepted)
}
