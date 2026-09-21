package visitor

import (
	"net/http"

	formatter "github.com/DeveloperAromal/callmark/pkg/formate"
	"github.com/gin-gonic/gin"
)

type handler struct {
	srv Service
}

func NewHandler(srv Service) *handler {
	return &handler{
		srv: srv,
	}
}

var response = formatter.NewRepository()

func (hdlr handler) CreateNewSMS(c *gin.Context) {

	tagToken := c.Param("tagToken")

	var message MessageModel

	if err := c.ShouldBindJSON(&message); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	result, err := hdlr.srv.CreateNewSMS(c.Request.Context(), message.Message, tagToken)
	if err != nil {
		response.Success(
			c.Writer,
			false,
			http.StatusInternalServerError,
			nil,
			"Unexpected error occured",
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusCreated,
		result,
		"Successfully send sms",
	)
}

func (hdlr handler) CreateNewWhatsappMessage(c *gin.Context) {

	tagToken := c.Param("tagToken")

	var message MessageModel

	if err := c.ShouldBindJSON(&message); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	result, err := hdlr.srv.CreateNewWhatsappMessage(c.Request.Context(), message.Message, tagToken)
	if err != nil {
		response.Success(
			c.Writer,
			false,
			http.StatusInternalServerError,
			nil,
			"Unexpected error occured"+err.Error(),
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusCreated,
		result,
		"Successfully send whatsapp message",
	)
}

func (hdlr *handler) GetVoiceToken(c *gin.Context) {
	tagToken := c.Param("tagToken")

	token, err := hdlr.srv.GetVoiceToken(
		c.Request.Context(),
		tagToken,
	)

	if err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusInternalServerError,
			"Unable to generate call token: "+err.Error(),
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusOK,
		gin.H{"token": token},
		"Call token generated",
	)
}

// func (hdlr *handler) Voice(c *gin.Context) {
// 	if !isValidTwilioVoiceWebhook(c) {
// 		response.Error(
// 			c.Writer,
// 			false,
// 			http.StatusForbidden,
// 			"Invalid Twilio webhook signature",
// 		)
// 		return
// 	}

// 	// Twilio forwards the signed Voice grant application parameters in its POST
// 	// form body. The destination phone number is resolved server-side.
// 	tagToken := c.PostForm("tagToken")

// 	twiml, err := hdlr.srv.GetVoiceResponse(
// 		c.Request.Context(),
// 		tagToken,
// 	)
// 	if err != nil {
// 		response.Error(
// 			c.Writer,
// 			false,
// 			http.StatusInternalServerError,
// 			"Unable to process call: "+err.Error(),
// 		)
// 		return
// 	}

// 	c.Data(
// 		http.StatusOK,
// 		"application/xml",
// 		[]byte(twiml),
// 	)
// }
