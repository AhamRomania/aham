package route

import (
	"aham/common/c"
	"aham/common/ws"
	"aham/service/api/db"
	"encoding/json"
	"net/http"
	"os"
	"slices"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

// /chat
func ChatRoutes(r chi.Router) {
	r.Post("/", c.Guard(createChat))
	r.Get("/", c.Guard(getChats))
	r.Put("/{id}", c.Guard(updateChat))
	r.Delete("/{id}", c.Guard(deleteChat))
	r.Post("/{id}", c.Guard(createChatMessage))
	r.Get("/{id}", c.Guard(getChatMessages))
}

func deleteChat(w http.ResponseWriter, r *http.Request) {

	userID, _ := c.UserID(r)

	chat := db.GetChat(c.ID(r, "id"))

	if chat == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if err := chat.Delete(userID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
}

func updateChat(w http.ResponseWriter, r *http.Request) {

	userID, _ := c.UserID(r)

	chat := db.GetChat(c.ID(r, "id"))

	if chat == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if err := chat.Archive(userID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		c.Log().Error(err)
		return
	}
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

	ad := db.GetAd(userID, payload.Ad)

	if ad == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if !ad.Messages {
		w.WriteHeader(http.StatusNotAcceptable)
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

	message, err := chat.CreateMessage(userID, payload.Message)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	for _, participant := range participants {
		ws.Send(participant, ws.NewEvent("chat", &c.D{
			"chat":    chat,
			"from":    userID,
			"message": message,
		}))
	}

	render.JSON(w, r, chat)
}

func getChats(w http.ResponseWriter, r *http.Request) {
	userID, _ := c.UserID(r)
	reference := c.QueryIntParam(r, "reference", 0)
	archived := r.URL.Query().Get("archived") == "true"
	render.JSON(w, r, db.GetChats(userID, db.AD, reference, archived))
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

	if slices.Index(chat.ParticipantsIDS, userID) == -1 {
		w.WriteHeader(http.StatusForbidden)
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

	for _, participant := range chat.Participants {
		ws.Send(participant.ID, ws.NewEvent("chat.message", &c.D{
			"chat":    chat,
			"from":    userID,
			"message": message,
		}))
	}

	render.JSON(w, r, message)
}

func getChatMessages(w http.ResponseWriter, r *http.Request) {

	userID, _ := c.UserID(r)

	chat := db.GetChat(c.ID(r, "id"))

	if chat == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	if slices.Index(chat.ParticipantsIDS, userID) == -1 {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	messages := chat.GetMessages(
		c.QueryIntParam(r, "offset", 0),
		c.QueryIntParam(r, "limit", 10),
	)

	render.JSON(w, r, messages)
}
