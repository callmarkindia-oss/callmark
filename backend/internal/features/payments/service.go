package payments

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	authModule "github.com/callmarkindia/callmark/internal/features/auth"
	hashing "github.com/callmarkindia/callmark/pkg/hashing"
)

type Service interface {
	CreateRenewalOrder(ctx context.Context, tagID, token string) (*CreateOrderResponse, error)
	VerifyAndActivate(ctx context.Context, tagID, token, orderID, paymentID, signature string) (time.Time, error)
	ActivateFromWebhook(ctx context.Context, orderID, paymentID string) error
	VerifyWebhookSignature(body []byte, signature string) bool
}

type service struct {
	repo       Repository
	client     RazorpayClient
	authModule authModule.Repository
}

func NewService(repo Repository, client RazorpayClient, authModule authModule.Repository) Service {
	return &service{
		repo:       repo,
		client:     client,
		authModule: authModule,
	}
}

func (srv *service) userIDFromToken(ctx context.Context, token string) (string, error) {
	sessionTokenHash := hashing.NewAlgo().CreateSHA(token)

	user, err := srv.authModule.ME(ctx, sessionTokenHash)
	if err != nil {
		return "", errors.New("unauthorized")
	}

	return user.User.ID, nil
}

func (srv *service) CreateRenewalOrder(ctx context.Context, tagID, token string) (*CreateOrderResponse, error) {
	userID, err := srv.userIDFromToken(ctx, token)
	if err != nil {
		return nil, err
	}

	owns, err := srv.repo.TagOwnedByUser(ctx, tagID, userID)
	if err != nil {
		return nil, err
	}
	if !owns {
		return nil, errors.New("tag not found or not owned by user")
	}

	receipt := fmt.Sprintf("renew_%s_%d", tagID, time.Now().Unix())

	orderID, err := srv.client.CreateOrder(ctx, RenewalAmountPaise, RenewalCurrency, receipt)
	if err != nil {
		return nil, fmt.Errorf("create razorpay order: %w", err)
	}

	err = srv.repo.InsertPayment(ctx, &TagPayment{
		TagID:           tagID,
		UserID:          userID,
		RazorpayOrderID: orderID,
		Amount:          RenewalAmountPaise,
		Currency:        RenewalCurrency,
	})
	if err != nil {
		return nil, fmt.Errorf("record order: %w", err)
	}

	return &CreateOrderResponse{
		OrderID:  orderID,
		Amount:   RenewalAmountPaise,
		Currency: RenewalCurrency,
		KeyID:    os.Getenv("RAZORPAY_KEY_ID"),
	}, nil
}

func (srv *service) VerifyAndActivate(ctx context.Context, tagID, token, orderID, paymentID, signature string) (time.Time, error) {
	userID, err := srv.userIDFromToken(ctx, token)
	if err != nil {
		return time.Time{}, err
	}

	if !srv.client.VerifySignature(orderID, paymentID, signature) {
		return time.Time{}, errors.New("signature verification failed")
	}

	return srv.markPaidAndActivate(ctx, tagID, userID, orderID, paymentID, signature)
}

func (srv *service) ActivateFromWebhook(ctx context.Context, orderID, paymentID string) error {
	tagID, userID, err := srv.repo.GetTagIDByOrderID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("lookup order: %w", err)
	}

	_, err = srv.markPaidAndActivate(ctx, tagID, userID, orderID, paymentID, "")
	return err
}

func (srv *service) VerifyWebhookSignature(body []byte, signature string) bool {
	return srv.client.VerifyWebhookSignature(body, signature)
}

func (srv *service) markPaidAndActivate(ctx context.Context, tagID, userID, orderID, paymentID, signature string) (time.Time, error) {
	ok, err := srv.repo.MarkPaidIfCreated(ctx, orderID, paymentID, signature)
	if err != nil {
		return time.Time{}, fmt.Errorf("mark paid: %w", err)
	}
	if !ok {
		return time.Time{}, errors.New("payment already processed")
	}

	expiry := time.Now().Add(RenewalValidity)
	if err := srv.repo.ActivateTag(ctx, tagID, userID, expiry); err != nil {
		return time.Time{}, fmt.Errorf("activate tag: %w", err)
	}

	return expiry, nil
}
