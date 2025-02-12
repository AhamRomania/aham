package sam

type Resource int64
type Perm int

const (
	CITIES     Resource = 1 // cities
	PROPS      Resource = 2 // props
	CATEGORIES Resource = 3 // categories
	ADS        Resource = 4 // ads
)

const (
	PermRead Perm = 1 << iota
	PermWrite
	PermPublish
	PermDelete
)
