package tag

import (
	"context"

	authModule "github.com/DeveloperAromal/callmark/internal/features/auth"
	hashing "github.com/DeveloperAromal/callmark/pkg/hashing"
)

type Service interface {
	CreateTag(ctx context.Context, tag TagModel, token string) (TagModel, error)
}

type service struct {
	repo       Repository
	authModule authModule.Repository
}

func NewService(repo Repository, authModule authModule.Repository) *service {
	return &service{
		repo:       repo,
		authModule: authModule,
	}
}

func (srv *service) CreateTag(ctx context.Context, tag TagModel, token string) (TagModel, error) {

	tagToken, err := hashing.NewAlgo().RandomToken()
	if err != nil {
		return TagModel{}, err
	}

	sessionTokenHash, err := hashing.NewAlgo().CreateSHA(token)
	if err != nil {
		return TagModel{}, err
	}

	user, err := srv.authModule.ME(ctx, sessionTokenHash)
	if err != nil {
		return TagModel{}, err
	}

	return srv.repo.CreateTag(ctx, TagModel{
		UserID:     user.User.ID,
		TagType:    tag.TagType,
		TagToken:   tagToken,
		Identifier: tag.Identifier,
	})

}
