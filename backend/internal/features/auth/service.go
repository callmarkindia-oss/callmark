package auth

import (
	"context"
	"errors"
	"time"

	hashing "github.com/DeveloperAromal/callmark/pkg/hashing"
)

type Service interface {
	Signup(ctx context.Context, creds CredModel) (CredModel, error)
	Login(ctx context.Context, email string, password string) (string, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) *service {
	return &service{
		repo: repo,
	}
}

func (srv service) Signup(ctx context.Context, creds CredModel) (CredModel, error) {

	if len(creds.Password) < 8 {
		return CredModel{}, errors.New("password must be at least 8 characters")
	}

	passHash, err := hashing.NewAlgo().HashPassword(creds.Password)
	if err != nil {
		return CredModel{}, err
	}

	creds.Password = passHash

	return srv.repo.Signup(ctx, creds)
}

func (srv *service) Login(ctx context.Context, email string, password string) (string, error) {

	const sessionDuration = 30 * 24 * time.Hour

	if len(password) < 8 {
		return "", errors.New("password must be at least 8 characters")
	}

	user, err := srv.repo.Login(
		ctx,
		email,
	)
	if err != nil {
		return "", err
	}

	isValid, err := hashing.NewAlgo().ComparePasswordHash(password, user.Password)
	if err != nil {
		return "", err
	}

	token, err := hashing.NewAlgo().RandomToken()
	if err != nil {
		return "", err
	}

	tokenHash, err := hashing.NewAlgo().CreateSHA(token)
	if err != nil {
		return "", err
	}

	if isValid {
		_, err := srv.repo.CreateSession(
			ctx,
			SessionModel{
				UserID:   user.ID,
				Token:    tokenHash,
				ExpiryAt: time.Now().Add(sessionDuration),
			},
		)
		if err != nil {
			return "", err
		}
	}

	return token, nil
}
