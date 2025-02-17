package service

import (
	"aham/common/c"
	"context"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type securityFilter struct {
	mux  sync.Mutex
	deny map[string]time.Time
	next http.Handler
}

func (f *securityFilter) analyze(r *http.Request) {
	if !isCommonUserAgent(r) {
		f.mux.Lock()
		defer f.mux.Unlock()
		f.deny[c.IP(r)] = time.Now()
		c.Log().Warnf("Requests from %s denied due to unknown agent: %s.", c.IP(r), r.UserAgent())
	}
}

func (f *securityFilter) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	go f.analyze(r.Clone(context.Background()))

	if _, exists := f.deny[c.IP(r)]; exists && os.Getenv("DEV") != "true" {
		http.Error(w, "Trimite un mesaj la security@aham.ro dacă consideri că a fost o greșeală.", http.StatusForbidden)
		return
	}

	f.next.ServeHTTP(w, r)
}

func SecurityFilter(next http.Handler) http.Handler {
	return &securityFilter{
		deny: make(map[string]time.Time),
		mux:  sync.Mutex{},
		next: next,
	}
}

func isCommonUserAgent(r *http.Request) bool {
	// List of common user agents
	commonUserAgents := []string{
		"Mozilla",     // Used by most modern browsers (Chrome, Firefox, Safari, etc.)
		"Chrome",      // Chrome browser
		"Firefox",     // Firefox browser
		"Safari",      // Safari browser
		"Edge",        // Microsoft Edge
		"MSIE",        // Internet Explorer
		"Googlebot",   // Googlebot (for web crawlers)
		"Bingbot",     // Bingbot (for Microsoft search engine crawlers)
		"Slurp",       // Yahoo Slurp (for Yahoo search engine crawlers)
		"DuckDuckBot", // DuckDuckGo bot
		"YandexBot",   // Yandex bot (for Russian search engine crawlers)
		"Aham",
		"node",
	}

	// Get the User-Agent string from the request header
	userAgent := r.UserAgent()

	// Check if the User-Agent contains any of the common strings
	for _, ua := range commonUserAgents {
		if strings.Contains(userAgent, ua) {
			return true
		}
	}

	// If no common User-Agent is found
	return false
}
