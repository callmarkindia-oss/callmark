package payments

import "time"

type PaymentStatus string

const (
	StatusCreated PaymentStatus = "created"
	StatusPaid    PaymentStatus = "paid"
	StatusFailed  PaymentStatus = "failed"
)

const (
	RenewalAmountPaise = 99
	RenewalCurrency    = "INR"
	RenewalValidity    = 365 * 24 * time.Hour
)

type TagPayment struct {
	ID                string
	TagID             string
	UserID            string
	RazorpayOrderID   string
	RazorpayPaymentID string
	RazorpaySignature string
	Amount            int
	Currency          string
	Status            PaymentStatus
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type CreateOrderResult struct {
	OrderID  string
	Amount   int
	Currency string
}

type CreateOrderRequest struct {
	TagID string `json:"tag_id" binding:"required"`
}
type CreateOrderResponse struct {
	OrderID  string `json:"order_id"`
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	KeyID    string `json:"key_id"`
}

type VerifyPaymentRequest struct {
	RazorpayOrderID   string `json:"razorpay_order_id" binding:"required"`
	RazorpayPaymentID string `json:"razorpay_payment_id" binding:"required"`
	RazorpaySignature string `json:"razorpay_signature" binding:"required"`
}

type VerifyPaymentResponse struct {
	IsActive bool      `json:"is_active"`
	ExpiryAt time.Time `json:"expiry_at"`
}

type WebhookPayload struct {
	Event   string `json:"event"`
	Payload struct {
		Payment struct {
			Entity struct {
				ID      string `json:"id"`
				OrderID string `json:"order_id"`
			} `json:"entity"`
		} `json:"payment"`
	} `json:"payload"`
}
