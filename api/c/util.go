package c

import "fmt"

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
