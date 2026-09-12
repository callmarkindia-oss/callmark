package tag

import "time"

type TagType string

const (
	TagTypeHome    TagType = "Home"
	TagTypeVehicle TagType = "Vehicle"
)

type TagModel struct {
	ID         string    `json:"id" db:"id"`
	UserID     string    `json:"user_id" db:"user_id"`
	Identifier string    `json:"identifier" db:"identifier"`
	TagToken   string    `json:"tag_token" db:"tag_token"`
	TagType    TagType   `json:"tag_type" db:"tag_type"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
