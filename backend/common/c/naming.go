package c

import (
	"fmt"
	"math/rand"
	"time"
)

var adjectives = []string{"rapid", "vesel", "puternic", "inteligenț", "liniștit", "curajos", "strălucitor", "iute", "înțelept", "vioi"}
var nouns = []string{"Lupul", "Vulturul", "Tigrul", "Rachetă", "Pârâu", "Ecou", "Phoenix", "Orbită", "Galaxie", "Nor"}

func GenerateRandomName() string {
	rand.Seed(time.Now().UnixNano())
	adjective := adjectives[rand.Intn(len(adjectives))]
	noun := nouns[rand.Intn(len(nouns))]
	return fmt.Sprintf("%s %s", noun, adjective)
}
