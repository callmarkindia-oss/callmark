package visitor

import (
	"encoding/xml"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/twilio/twilio-go"
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

func isValidTwilioVoiceWebhook(c *gin.Context) bool {
	voiceURL := os.Getenv("TWILIO_VOICE_URL")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	signature := c.GetHeader("X-Twilio-Signature")
	if voiceURL == "" || authToken == "" || signature == "" {
		return false
	}

	if err := c.Request.ParseForm(); err != nil {
		return false
	}

	params := make(map[string]string, len(c.Request.PostForm))
	for key, values := range c.Request.PostForm {
		if len(values) > 0 {
			params[key] = values[0]
		}
	}

	validator := twilio.NewRequestValidator(authToken)
	return validator.Validate(voiceURL, params, signature)
}
