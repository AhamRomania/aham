//
// Code generated by go-jet DO NOT EDIT.
//
// WARNING: Changes to this file may cause incorrect behavior
// and will be lost if the code is regenerated
//

package model

import (
	"time"
)

type Balance struct {
	ID          int32 `sql:"primary_key"`
	Owner       int32
	Debit       *int32
	Credit      *int32
	Balance     int32
	Description *string
	Date        time.Time
}
