package visitor

import (
	"encoding/xml"
	"time"
)

type MessageModel struct {
	ID        string    `json:"id" db:"id"`
	Message   string    `json:"message" db:"message"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type twimlResponse struct {
	XMLName xml.Name  `xml:"Response"`
	Dial    twimlDial `xml:"Dial"`
}

type twimlDial struct {
	CallerID string `xml:"callerId,attr,omitempty"`
	Number   string `xml:"Number"`
}
