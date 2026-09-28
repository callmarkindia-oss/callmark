package payments

import (
	"database/sql"

	authModule "github.com/callmarkindia/callmark/internal/features/auth"
	"github.com/gin-gonic/gin"
)

type Router struct {
	db         *sql.DB
	authModule authModule.Repository
}

func NewRouter(db *sql.DB, authModule authModule.Repository) *Router {
	return &Router{
		db:         db,
		authModule: authModule,
	}
}

func (rtr *Router) BasePath() string {
	return "/payments"
}

func (rtr *Router) Register(reg *gin.RouterGroup) {
	repo := NewRepository(rtr.db)
	client := NewRazorpayClient()
	service := NewService(repo, client, rtr.authModule)
	handler := NewHandler(service)

	reg.POST("/tags/:id/renew/order", handler.CreateOrder)
	reg.POST("/tags/:id/renew/verify", handler.VerifyPayment)
	reg.POST("/webhooks/razorpay", handler.Webhook)
}
