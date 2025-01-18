package vo

type County struct {
	ID   int64  `json:"id"`
	Auto string `json:"auto"`
	Name string `json:"name"`
}

type City struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	County     int64  `json:"county,omitempty"`
	CountyName string `json:"county_name,omitempty"`
}
