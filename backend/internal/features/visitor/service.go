package visitor

import (
	"context"

	twilio "github.com/DeveloperAromal/callmark/pkg/twilio"
)

type Service interface {
	CreateNewSMS(ctx context.Context, message string, tagToken string) (SMSModel, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) *service {
	return &service{
		repo: repo,
	}
}

func (srv *service) CreateNewSMS(ctx context.Context, message string, tagToken string) (SMSModel, error) {

	phno, err := srv.repo.GetPhonenumberFromTagToken(ctx, tagToken)
	if err != nil {
		return SMSModel{}, err
	}

	err = twilio.NewMessage().SendSMS(message, phno)
	if err != nil {
		return SMSModel{}, err
	}

	return srv.repo.CreateSMS(ctx, message, tagToken)
}
