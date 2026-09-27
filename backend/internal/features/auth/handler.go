package auth

import (
	"net/http"
	"strings"
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

func sessionToken(c *gin.Context) (string, error) {
	authorization := strings.TrimSpace(c.GetHeader("Authorization"))
	if len(authorization) > len("Bearer ") && strings.EqualFold(authorization[:len("Bearer ")], "Bearer ") {
		if token := strings.TrimSpace(authorization[len("Bearer "):]); token != "" {
			return token, nil
		}
	}

	if token, err := c.Cookie("session_token"); err == nil && token != "" {
		return token, nil
	}

	return "", http.ErrNoCookie
}

func isHTTPSRequest(request *http.Request) bool {
	forwardedProto := strings.TrimSpace(strings.Split(request.Header.Get("X-Forwarded-Proto"), ",")[0])
	if strings.EqualFold(forwardedProto, "https") {
		return true
	}

	if strings.Contains(strings.ToLower(request.Header.Get("Forwarded")), "proto=https") {
		return true
	}

	origin := strings.TrimSpace(strings.Split(request.Header.Get("Origin"), ",")[0])
	return strings.HasPrefix(strings.ToLower(origin), "https://")
}

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
		response.Error(
			c.Writer,
			false,
			http.StatusInternalServerError,
			"Unexpected error occured",
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusCreated,
		result,
		"Successfully created account",
	)
}

func (hdlr *handler) Login(c *gin.Context) {
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

	token, err := hdlr.srv.Login(
		c.Request.Context(),
		cred.Email,
		cred.Password,
	)
	if err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusUnauthorized,
			"Invalid email or password",
		)
		return
	}

	secureCookie := c.Request.TLS != nil || isHTTPSRequest(c.Request)
	if secureCookie {
		c.SetSameSite(http.SameSiteNoneMode)
	} else {
		c.SetSameSite(http.SameSiteLaxMode)
	}

	c.SetCookie(
		"session_token",
		token,
		int(sessionDuration.Seconds()),
		"/",
		"",
		secureCookie,
		true,
	)

	response.Success(
		c.Writer,
		true,
		http.StatusOK,
		gin.H{"session_token": token},
		"Login successful",
	)
}

func (hdlr *handler) MeAuthorization(c *gin.Context) {

	token, err := sessionToken(c)
	if err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusUnauthorized,
			"Session not found",
		)
		return
	}

	result, err := hdlr.srv.ME(c.Request.Context(), token)
	if err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusUnauthorized,
			"Invalid session: "+err.Error(),
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusOK,
		result,
		"Authorization successful",
	)
}
