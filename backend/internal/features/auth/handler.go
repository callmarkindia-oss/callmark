package auth

import (
	"net/http"
	"time"

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

func (hdlr handler) Signup(c *gin.Context) {

	var cred CredModel

	if err := c.ShouldBindJSON(&cred); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	result, err := hdlr.srv.Signup(c.Request.Context(), cred)
	if err != nil {
		response.Success(
			c.Writer,
			true,
			http.StatusInternalServerError,
			nil,
			"Unexpected error occured",
		)
	}

	response.Success(
		c.Writer,
		true,
		http.StatusCreated,
		result,
		"Successfully created account",
	)
}

func (hdlr handler) Login(c *gin.Context) {

	var cred LoginModel
	const sessionDuration = 30 * 24 * time.Hour

	if err := c.ShouldBindJSON(&cred); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	token, err := hdlr.srv.Login(c.Request.Context(), cred.Email, cred.Password)
	if err != nil {
		response.Success(
			c.Writer,
			true,
			http.StatusInternalServerError,
			nil,
			"Unexpected error occured",
		)
	}

	c.SetCookie(
		"session_token",
		token,
		int(sessionDuration.Seconds()),
		"/",
		"",
		true,
		true,
	)

	response.Success(
		c.Writer,
		true,
		http.StatusCreated,
		nil,
		"Login successfull",
	)
}
