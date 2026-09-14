package messaging

import (
	"errors"
	"os"

	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

const (
	TemplateTwoFA                = "sms_2fa"
	TemplateAppointmentReminders = "sms_appointment_reminders"
	TemplateOrderConfirmation    = "sms_order_confirmation"
	TemplateDeliveryUpdates      = "sms_delivery_updates"
	TemplateCustomerSupport      = "sms_customer_support"
	TemplateMarketingPromotions  = "sms_marketing_promotions"
	TemplateEventNotifications   = "sms_event_notifications"
	TemplateAccountAlerts        = "sms_account_alerts"
	TemplateFeedbackSurveys      = "sms_feedback_surveys"
	TemplateInternalAlerts       = "sms_internal_alerts"
)

type Messaging interface {
	SendSMS(body string, phonenumber string) error
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
