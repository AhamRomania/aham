package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"aham/service/api/sam"
	"net/http"
)

func Can(r *http.Request, resource sam.Resource, permission sam.Perm) bool {

	userID, err := c.UserID(r)

	if err != nil {
		c.Log().Error(err)
		return false
	}

	user := db.GetUserByID(userID)

	if user == nil {
		c.Log().Error("expected user")
		return false
	}

	return user.SamVerify(resource, permission)
}
