package tag

import (
	"database/sql"

	authModule "github.com/DeveloperAromal/callmark/internal/features/auth"
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
	return "/tags"
}

func (rtr *Router) Register(reg *gin.RouterGroup) {
	repo := NewRepository(rtr.db)
	service := NewService(repo, rtr.authModule)
	handler := NewHandler(service)

	reg.POST("", handler.CreateNewTag)
	reg.GET("", handler.GetAllTags)
}
