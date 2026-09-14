package visitor

import "time"

type SMSModel struct {
	ID        string    `json:"id" db:"id"`
	Message   string    `json:"message" db:"message"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}
