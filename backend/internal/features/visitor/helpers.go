package visitor

import (
	"encoding/xml"
	"os"
	"strings"
)

func createVoiceTwiML(phoneNumber string) (string, error) {
	twiml, err := xml.Marshal(twimlResponse{
		Dial: twimlDial{
			CallerID: os.Getenv("TWILIO_NUMBER"),
			Number:   formatPhoneNumber(phoneNumber),
		},
	})
	if err != nil {
		return "", err
	}

	return string(twiml), nil
}

func formatPhoneNumber(number string) string {
	number = strings.TrimSpace(number)
	if strings.HasPrefix(number, "+") {
		return number
	}

	return "+91" + number
}
