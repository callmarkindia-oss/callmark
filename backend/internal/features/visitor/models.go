package visitor

import "time"

type MessageModel struct {
	ID        string    `json:"id" db:"id"`
	Message   string    `json:"message" db:"message"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
