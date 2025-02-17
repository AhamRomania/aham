package route

import (
	"aham/common/c"
	"aham/service/api/db"
	"encoding/json"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

// /chat
func ChatRoutes(r chi.Router) {
	r.Post("/", c.Guard(createChat))
	r.Get("/", c.Guard(getChats))
	r.Post("/{id}", c.Guard(createChatMessage))
	r.Get("/{id}", c.Guard(getChatMessage))
}

type createChatRequest struct {
	Message string `json:"message"`
	Ad      int64  `json:"ad"`
}

func createChat(w http.ResponseWriter, r *http.Request) {

	userID, _ := c.UserID(r)

	payload := createChatRequest{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ad, err := db.GetAd(payload.Ad)

	if err != nil {
		http.Error(w, "nu am gasit anuntul", http.StatusNotFound)
		return
	}

	if os.Getenv("DEV") != "true" && userID == ad.Owner.ID {
		http.Error(w, "nu poți trimite ție însuți", http.StatusNotFound)
		return
	}

	participants := []int64{
		userID,
		ad.Owner.ID,
	}

	chat, err := db.CreateChat(
		ad.Title,
		participants,
		&db.ChatAbout{
			Context:   db.AD,
			Reference: c.NilID(ad.ID),
		},
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}

	if _, err := chat.CreateMessage(userID, payload.Message); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	render.JSON(w, r, chat)
}

func getChats(w http.ResponseWriter, r *http.Request) {
	userID, _ := c.UserID(r)
	render.JSON(w, r, db.GetChats(userID, r.URL.Query().Get("archived") == "true"))
}

type createChatMessageRequest struct {
	Message string `json:"message"`
}

func createChatMessage(w http.ResponseWriter, r *http.Request) {

	userID, _ := c.UserID(r)

	chat := db.GetChat(c.ID(r, "id"))

	if chat == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	payload := createChatMessageRequest{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	message, err := chat.CreateMessage(
		userID,
		payload.Message,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	render.JSON(w, r, message)
}

func getChatMessage(w http.ResponseWriter, r *http.Request) {

	chat := db.GetChat(c.ID(r, "id"))

	if chat == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	messages := chat.GetMessages(
		c.QueryIntParam(r, "offset", 0),
		c.QueryIntParam(r, "limit", 10),
	)

	render.JSON(w, r, messages)
}
