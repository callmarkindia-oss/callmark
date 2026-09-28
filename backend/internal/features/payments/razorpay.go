package payments

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"os"

	"github.com/razorpay/razorpay-go"
)

type RazorpayClient interface {
	CreateOrder(ctx context.Context, amount int, currency string, receipt string) (string, error)
	VerifySignature(orderID, paymentID, signature string) bool
	VerifyWebhookSignature(body []byte, signature string) bool
}

type razorpayClient struct {
	client        *razorpay.Client
	keySecret     string
	webhookSecret string
}

func NewRazorpayClient() RazorpayClient {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	webhookSecret := os.Getenv("RAZORPAY_WEBHOOK_SECRET")
	fmt.Printf("key_id=%q secret_len=%d\n", keyID, len(keySecret))

	return &razorpayClient{
		client:        razorpay.NewClient(keyID, keySecret),
		keySecret:     keySecret,
		webhookSecret: webhookSecret,
	}
}

func (rzp *razorpayClient) CreateOrder(ctx context.Context, amount int, currency string, receipt string) (string, error) {
	data := map[string]interface{}{
		"amount":   amount,
		"currency": currency,
		"receipt":  receipt,
	}

	order, err := rzp.client.Order.Create(data, nil)
	if err != nil {
		return "", fmt.Errorf("razorpay order create: %w", err)
	}

	orderID, ok := order["id"].(string)
	if !ok {
		return "", fmt.Errorf("razorpay order create: missing id in response")
	}

	return orderID, nil
}

func hmacEqual(payload, signature, secret string) bool {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	expected := hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signature))
}

func (r *razorpayClient) VerifySignature(orderID, paymentID, signature string) bool {
	payload := orderID + "|" + paymentID
	return hmacEqual(payload, signature, r.keySecret)
}

func (r *razorpayClient) VerifyWebhookSignature(body []byte, signature string) bool {
	return hmacEqual(string(body), signature, r.webhookSecret)
}
