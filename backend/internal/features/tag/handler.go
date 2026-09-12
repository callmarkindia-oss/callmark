package tag

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

func (hdlr handler) CreateNewTag(c *gin.Context) {

	var tag TagModel

	token, err := c.Cookie("session_token")
	if err != nil {
		response.Success(
			c.Writer,
			false,
			http.StatusUnauthorized,
			nil,
			"Sesssion not found",
		)
		return
	}

	if err := c.ShouldBindJSON(&tag); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	result, err := hdlr.srv.CreateTag(c.Request.Context(), tag, token)
	if err != nil {
		response.Success(
			c.Writer,
			true,
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
		"Successfully created tag",
	)
}
