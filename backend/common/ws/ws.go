package ws

import (
	"aham/common/c"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var connections = make(map[*websocket.Conn]bool)

func Broadcast()            {}
func Send(user int64) error { return nil }

func GetHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		conn, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			c.Log().Error(err)
			return
		}

		connections[conn] = true

		for {

			messageType, p, err := conn.ReadMessage()

			if err != nil {

				if ce, ok := err.(*websocket.CloseError); ok {
					c.Log().Infof("Client disconnected with code %d", ce.Code)
					return
				}

				c.Log().Error(err)
				return
			}

			if err := conn.WriteMessage(messageType, append(p, '@')); err != nil {
				c.Log().Error(err)
				return
			}
		}
	}
}
