package ws

import (
	"aham/common/c"
	"fmt"
	"net/http"
	"slices"
	"sync"
	"time"

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
var mutexes = make(map[int64]*sync.Mutex)
var handlers = make(map[string][]Handler, 0)
var touches map[string]func(on bool) = make(map[string]func(on bool))
var touchMux sync.Mutex = sync.Mutex{}

type Event struct {
	Name string `json:"event"`
	Data *c.D   `json:"data,omitempty"`
}

func (e *Event) GetString(key string) string {

	if e.Data == nil {
		return ""
	}

	if value, exists := (*e.Data)[key]; exists {
		if v, isString := value.(string); isString {
			return v
		}
	}

	return ""
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

func IsOnlineTouch(user int64, cb func(on bool)) {

	if _, exists := users[user]; !exists {
		cb(false)
		return
	}

	touchMux.Lock()

	nonce := c.MustGenerateNonce(16)

	touches[nonce] = cb
	touchMux.Unlock()

	if err := Send(user, &Event{Name: "touch", Data: &c.D{"nonce": nonce}}); err != nil {
		c.Log().Error(err)
		cb(false)
		return
	}

	go func(nonce string) {
		<-time.After(time.Second * 5)
		if _, exists := touches[nonce]; exists {
			c.Log().Infof("Timeout on checking is online for %s", nonce)
			delete(touches, nonce)
			cb(false)
		}
	}(nonce)
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
		mutexes[user].Lock()
		defer mutexes[user].Unlock()
		if err := conn.WriteJSON(event); err != nil {
			return err
		}
	}
	return nil
}

func disconnect(id int64) {

	for conn, user := range connections {
		if user == id {
			delete(connections, conn)
			conn.Close()
		}
	}

	delete(users, id)
	delete(mutexes, id)
}

func reader(conn *websocket.Conn) {
	for {

		var event = &Event{}

		err := conn.ReadJSON(&event)

		if err != nil {

			if ce, ok := err.(*websocket.CloseError); ok {
				disconnect(connections[conn])
				c.Log().Infof("Client disconnected with code %d", ce.Code)
				return
			}

			c.Log().Error(err)
			return
		}

		// touch acknowledge
		if event.Name == "touch" {
			nonce := event.GetString("nonce")
			if cb, exists := touches[nonce]; exists {
				c.Log().Info("Got a touch signal notifying user is online")
				touchMux.Lock()
				delete(touches, nonce)
				touchMux.Unlock()
				if cb != nil {
					cb(true)
				} else {
					c.Log().Error("touch cb is nil")
				}
			}
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

		disconnect(userID)

		h := http.Header{}
		h.Add("X-Aham-Socket", "v1")

		conn, err := upgrader.Upgrade(w, r, h)

		if err != nil {
			c.Log().Error(err)
			return
		}

		conn.SetCloseHandler(func(code int, text string) error {
			Send(userID, NewEvent("bye"))
			disconnect(userID)
			return nil
		})

		connections[conn] = userID
		users[userID] = conn
		mutexes[userID] = &sync.Mutex{}

		Send(userID, NewEvent("hello"))

		reader(conn)
	}
}
