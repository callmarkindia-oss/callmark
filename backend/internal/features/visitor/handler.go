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
