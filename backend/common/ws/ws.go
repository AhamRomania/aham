package ws

import (
	"aham/common/c"
	"fmt"
	"net/http"
	"slices"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Handler func(event *Event, conn *websocket.Conn, user int64)

var connections = make(map[*websocket.Conn]int64)
var users = make(map[int64]*websocket.Conn)
var handlers = make(map[string][]Handler, 0)

type Event struct {
	Name string `json:"event"`
	Data *c.D   `json:"data,omitempty"`
}

func NewEvent(name string, data ...*c.D) *Event {
	e := &Event{Name: name}
	if len(data) > 0 {
		e.Data = data[0]
	}
	return e
}

func On(event string, h Handler) func() {

	if _, exists := handlers[event]; exists {
		handlers[event] = make([]Handler, 0)
	}

	handlers[event] = append(handlers[event], h)

	return func() {

		i := slices.IndexFunc(handlers[event], func(cur Handler) bool {
			return fmt.Sprintf("%p", cur) == fmt.Sprintf("%p", h)
		})

		handlers[event] = slices.Delete(handlers[event], i, 1)
	}
}

func Broadcast(event *Event) error {
	for user := range users {
		if err := Send(user, event); err != nil {
			return err
		}
	}
	return nil
}

func Send(user int64, event *Event) error {
	if conn, exists := users[user]; exists {
		if err := conn.WriteJSON(event); err != nil {
			return err
		}
	}
	return nil
}

func reader(conn *websocket.Conn) {
	for {

		var event = &Event{}

		err := conn.ReadJSON(&event)

		if err != nil {

			if ce, ok := err.(*websocket.CloseError); ok {
				userID := connections[conn]
				delete(connections, conn)
				delete(users, userID)
				c.Log().Infof("Client disconnected with code %d", ce.Code)
				return
			}

			c.Log().Error(err)
			return
		}

		if _, exists := handlers[event.Name]; exists {
			for _, handler := range handlers[event.Name] {
				go handler(event, conn, connections[conn])
			}
		}
	}
}

func GetHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		userID, err := c.UserID(r)

		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		if _, exists := users[userID]; exists {
			w.WriteHeader(http.StatusConflict)
			return
		}

		h := http.Header{}
		h.Add("X-Aham-Socket", "v1")

		conn, err := upgrader.Upgrade(w, r, h)

		if err != nil {
			c.Log().Error(err)
			return
		}

		conn.SetCloseHandler(func(code int, text string) error {
			Send(userID, NewEvent("bye"))
			delete(connections, conn)
			delete(users, userID)
			return nil
		})

		connections[conn] = userID
		users[userID] = conn

		Send(userID, NewEvent("hello"))

		reader(conn)
	}
}
