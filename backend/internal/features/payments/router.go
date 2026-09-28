package payments

import (
	"database/sql"

	"github.com/gin-gonic/gin"
)

type Router struct {
	db *sql.DB
}

func NewRouter(db *sql.DB) *Router {
	return &Router{
		db: db,
	}
}

func (rtr *Router) BasePath() string {
	return "/payments"
}

func (rtr *Router) Register(reg *gin.RouterGroup) {
	repo := NewRepository(rtr.db)
	client := NewRazorpayClient()
	service := NewService(repo, client)
	handler := NewHandler(service)

	reg.POST("/tags/:id/renew/order", handler.CreateOrder)
	reg.POST("/tags/:id/renew/verify", handler.VerifyPayment)
	reg.POST("/webhooks/razorpay", handler.Webhook)
}
