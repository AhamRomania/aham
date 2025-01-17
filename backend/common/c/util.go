package c

import "fmt"

func NilID(id int64) *int64 {
	if id == 0 {
		return nil
	}
	return &id
}

func String(s string) *string {
	return &s
}

func URLF(s string, a ...any) string {

	xtr := append([]any{DOMAIN}, a...)

	return fmt.Sprintf(
		"https://%s"+s,
		xtr...,
	)
}

func NilString(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
