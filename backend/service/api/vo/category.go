package vo

type Category struct {
	ID          int64  `json:"id,omitempty"`
	Name        string `json:"name,omitempty"`
	Slug        string `json:"slug,omitempty"`
	Description string `json:"description,omitempty"`
	Pricing     bool   `json:"pricing,omitempty"`
}
