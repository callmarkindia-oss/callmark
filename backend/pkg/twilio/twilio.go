package messaging

import (
	"errors"
	"os"

	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

type Messaging interface {
	SendSMS(body string, phonenumber string) error
	SendWhatsappMessage(body string, phonenumber string) error
}

type message struct{}

func NewMessage() Messaging {
	return &message{}
}

func (msg *message) SendSMS(body string, phonenumber string) error {

	accSID := os.Getenv("TWILIO_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	twilioNumber := os.Getenv("TWILIO_NUMBER")

	client := twilio.NewRestClientWithParams(
		twilio.ClientParams{
			Username: accSID,
			Password: authToken,
		},
	)

	params := &twilioApi.CreateMessageParams{}
	params.SetTo("+91" + phonenumber)
	params.SetFrom(twilioNumber)
	// TODO:
	// Change the "sms_feedback_surveys" to body
	params.SetBody("sms_feedback_surveys")

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		return errors.New("Error sending SMS message: " + err.Error())
	}

	return nil
}

func (msg *message) SendWhatsappMessage(body string, phonenumber string) error {

	accSID := os.Getenv("TWILIO_SID")
	contentSID := os.Getenv("TWILIO_CONTENT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	twilioNumber := os.Getenv("TWILIO_NUMBER")

	client := twilio.NewRestClientWithParams(
		twilio.ClientParams{
			Username: accSID,
			Password: authToken,
		},
	)

	params := &twilioApi.CreateMessageParams{}
	params.SetTo("whatsapp:+91" + phonenumber)
	params.SetFrom("whatsapp:" + twilioNumber)
	params.SetContentSid(contentSID)

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		return errors.New("Error sending Whatsapp message: " + err.Error())
	}

	return nil
}
