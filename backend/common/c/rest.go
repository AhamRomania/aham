package c

import "net/http"

// Deprecated: Use http.Error
func Error(w http.ResponseWriter, code int, message string) {
	http.Error(w, message, code)
}
