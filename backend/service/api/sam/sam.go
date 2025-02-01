package sam

type Resource int64
type Perm int

const (
	CITIES     Resource = 1 // cities
	CATEGORIES Resource = 2 // categories
	ADS        Resource = 3 // ads
)

const (
	PermRead Perm = 1 << iota
	PermWrite
	PermPublish
	PermDelete
)
