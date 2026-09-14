package visitor

import (
	"context"

	twilio "github.com/DeveloperAromal/callmark/pkg/twilio"
)

type Service interface {
	CreateNewSMS(ctx context.Context, message string, tagToken string) (MessageModel, error)
	CreateNewWhatsappMessage(ctx context.Context, message string, tagToken string) (MessageModel, error)
	GetVoiceToken(ctx context.Context, tagToken string) (string, error)
	GetVoiceResponse(ctx context.Context, tagToken string) (string, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) *service {
	return &service{
		repo: repo,
	}
}

func (srv *service) CreateNewSMS(ctx context.Context, message string, tagToken string) (MessageModel, error) {

	phno, err := srv.repo.GetPhonenumberFromTagToken(ctx, tagToken)
	if err != nil {
		return MessageModel{}, err
	}

	err = twilio.NewMessage().SendSMS(message, phno)
	if err != nil {
		return MessageModel{}, err
	}

	return srv.repo.CreateSMS(ctx, message, tagToken)
}

func (srv *service) CreateNewWhatsappMessage(ctx context.Context, message string, tagToken string) (MessageModel, error) {

	phno, err := srv.repo.GetPhonenumberFromTagToken(ctx, tagToken)
	if err != nil {
		return MessageModel{}, err
	}

	err = twilio.NewMessage().SendWhatsappMessage(message, phno)
	if err != nil {
		return MessageModel{}, err
	}

	return srv.repo.CreateWhatsappMessage(ctx, message, tagToken)
}

func (srv *service) GetVoiceToken(ctx context.Context, tagToken string) (string, error) {

	_, err := srv.repo.GetPhonenumberFromTagToken(ctx, tagToken)
	if err != nil {
		return "", err
	}

	return twilio.NewMessage().CreateVoiceAccessToken(tagToken)
}

func (srv *service) GetVoiceResponse(ctx context.Context, tagToken string) (string, error) {
	phno, err := srv.repo.GetPhonenumberFromTagToken(ctx, tagToken)
	if err != nil {
		return "", err
	}

	return createVoiceTwiML(phno)
}
