package payments

import "time"

type PaymentStatus string

const (
	StatusCreated PaymentStatus = "created"
	StatusPaid    PaymentStatus = "paid"
	StatusFailed  PaymentStatus = "failed"
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
