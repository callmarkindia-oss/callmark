package messaging

import (
	"errors"
	"fmt"
	"os"

	"github.com/twilio/twilio-go"
	"github.com/twilio/twilio-go/client/jwt"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

type Messaging interface {
	SendSMS(body string, phonenumber string) error
	SendWhatsappMessage(body string, phonenumber string) error
	CreateVoiceAccessToken(tagToken string) (string, error)
}

type message struct {
	client       *twilio.RestClient
	twilioNumber string
}

func NewMessage() Messaging {
	accSID := os.Getenv("TWILIO_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	twilioNumber := os.Getenv("TWILIO_NUMBER")

	client := twilio.NewRestClientWithParams(
		twilio.ClientParams{
			Username: accSID,
			Password: authToken,
		},
	)

	return &message{
		client:       client,
		twilioNumber: twilioNumber,
	}
}

func (msg *message) SendSMS(body string, phonenumber string) error {
	params := &twilioApi.CreateMessageParams{}

	params.SetTo("+91" + phonenumber)
	params.SetFrom(msg.twilioNumber)
	params.SetBody(body)

	_, err := msg.client.Api.CreateMessage(params)
	if err != nil {
		return errors.New("error sending SMS message: " + err.Error())
	}

	return nil
}

func (msg *message) SendWhatsappMessage(body string, phonenumber string) error {
	contentSID := os.Getenv("TWILIO_CONTENT_SID")

	params := &twilioApi.CreateMessageParams{}

	params.SetTo("whatsapp:+91" + phonenumber)
	params.SetFrom("whatsapp:" + msg.twilioNumber)
	params.SetContentSid(contentSID)

	_, err := msg.client.Api.CreateMessage(params)
	if err != nil {
		return errors.New("error sending Whatsapp message: " + err.Error())
	}

	return nil
}

func (msg *message) CreateVoiceAccessToken(tagToken string) (string, error) {
	accountSID := os.Getenv("TWILIO_SID")
	apiKey := os.Getenv("TWILIO_API_KEY")
	apiSecret := os.Getenv("TWILIO_API_SECRET")
	twimlAppSID := os.Getenv("TWILIO_TWIML_APP_SID")

	if accountSID == "" || apiKey == "" || apiSecret == "" || twimlAppSID == "" {
		return "", errors.New("Twilio Voice configuration is incomplete")
	}

	identity, err := voiceIdentity()
	if err != nil {
		return "", err
	}

	accessToken := jwt.CreateAccessToken(jwt.AccessTokenParams{
		AccountSid:    accountSID,
		SigningKeySid: apiKey,
		Secret:        apiSecret,
		Identity:      identity,
	})
	accessToken.AddGrant(&jwt.VoiceGrant{
		Outgoing: jwt.Outgoing{
			ApplicationSid: twimlAppSID,
			ApplicationParams: map[string]interface{}{
				"tagToken": tagToken,
			},
		},
	})

	token, err := accessToken.ToJwt()
	if err != nil {
		return "", fmt.Errorf("create Voice access token: %w", err)
	}

	return token, nil
}
