package auth

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
	return "/auth"
}

func (rtr *Router) Register(reg *gin.RouterGroup) {
	repo := NewRepository(rtr.db)
	service := NewService(repo)
	handler := NewHandler(service)

	reg.POST("/signup", handler.Signup)
	reg.POST("/login", handler.Login)
	reg.GET("/me", handler.MeAuthorization)
}
