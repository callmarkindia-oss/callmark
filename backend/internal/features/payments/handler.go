package payments

import (
	"errors"
	"io"
	"net/http"

	formatter "github.com/callmarkindia/callmark/pkg/formate"
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

func (hdlr *handler) CreateOrder(c *gin.Context) {
	userID := c.GetString("user_id")

	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	result, err := hdlr.srv.CreateRenewalOrder(c.Request.Context(), req.TagID, userID)
	if err != nil {
		if errors.Is(err, errors.New("tag not found or not owned by user")) {
			response.Error(
				c.Writer,
				false,
				http.StatusNotFound,
				"Tag not found",
			)
			return
		}

		response.Error(
			c.Writer,
			false,
			http.StatusInternalServerError,
			"Failed to create order",
		)
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusOK,
		result,
		"Order created",
	)
}

func (hdlr *handler) VerifyPayment(c *gin.Context) {
	userID := c.GetString("user_id")

	var req VerifyPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Bad request",
		)
		return
	}

	expiry, err := hdlr.srv.VerifyAndActivate(
		c.Request.Context(),
		req.TagID,
		userID,
		req.RazorpayOrderID,
		req.RazorpayPaymentID,
		req.RazorpaySignature,
	)
	if err != nil {
		switch {
		case errors.Is(err, errors.New("signature verification failed")):
			response.Error(
				c.Writer,
				false,
				http.StatusBadRequest,
				"Signature verification failed",
			)
		case errors.Is(err, errors.New("payment already processed")):
			response.Error(
				c.Writer,
				false,
				http.StatusConflict,
				"Payment already processed",
			)
		default:
			response.Error(
				c.Writer,
				false,
				http.StatusInternalServerError,
				"Failed to verify payment",
			)
		}
		return
	}

	response.Success(
		c.Writer,
		true,
		http.StatusOK,
		VerifyPaymentResponse{
			IsActive: true,
			ExpiryAt: expiry,
		},
		"Tag renewed",
	)
}

func (hdlr *handler) Webhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Failed to read body",
		)
		return
	}

	signature := c.GetHeader("X-Razorpay-Signature")
	if !hdlr.srv.VerifyWebhookSignature(body, signature) {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Invalid webhook signature",
		)
		return
	}

	var evt WebhookPayload
	if err := c.ShouldBindJSON(&evt); err != nil {
		response.Error(
			c.Writer,
			false,
			http.StatusBadRequest,
			"Invalid payload",
		)
		return
	}

	if evt.Event != "payment.captured" {
		c.Status(http.StatusOK)
		return
	}

	err = hdlr.srv.ActivateFromWebhook(
		c.Request.Context(),
		evt.Payload.Payment.Entity.OrderID,
		evt.Payload.Payment.Entity.ID,
	)
	if err != nil && !errors.Is(err, errors.New("payment already processed")) {
		response.Error(
			c.Writer,
			false,
			http.StatusInternalServerError,
			"Failed to process webhook",
		)
		return
	}

	c.Status(http.StatusOK)
}
