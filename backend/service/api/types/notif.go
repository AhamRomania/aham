package types

import (
	"aham/common/c"
	"time"
)

type NotifType string

const (
	NotifInfo      NotifType = "info"
	NotifAlert     NotifType = "alert"
	NotifWarning   NotifType = "warning"
	NotifError     NotifType = "error"
	NotifFatal     NotifType = "fatal"
	NotifSystem    NotifType = "system"
	NotifPromotion NotifType = "promotion"
)

type Notif struct {
	ID       int64      `json:"id"`
	Variant  string     `json:"variant"`
	Title    string     `json:"title"`
	Contents string     `json:"contents"`
	Href     *string    `json:"href"`
	Actions  *c.D       `json:"actions"`
	Seen     *time.Time `json:"seen"`
	Created  time.Time  `json:"created"`
}
