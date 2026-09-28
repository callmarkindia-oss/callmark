package payments

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

type Repository interface {
	TagOwnedByUser(ctx context.Context, tagID, userID string) (bool, error)
	InsertPayment(ctx context.Context, payment *TagPayment) error
	MarkPaidIfCreated(ctx context.Context, orderID, paymentID, signature string) (bool, error)
	ActivateTag(ctx context.Context, tagID, userID string, expiry time.Time) error
	GetTagIDByOrderID(ctx context.Context, orderID string) (string, string, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) TagOwnedByUser(ctx context.Context, tagID, userID string) (bool, error) {

	var owns bool

	err := repo.db.QueryRowContext(
		ctx,
		TagExistanceQuery,
		tagID,
		userID,
	).Scan(&owns)

	return owns, err

}

func (repo *repository) InsertPayment(ctx context.Context, payment *TagPayment) error {

	_, err := repo.db.ExecContext(
		ctx,
		PaymentInsertionQuery,
		payment.TagID,
		payment.UserID,
		payment.RazorpayOrderID,
		payment.Amount,
		payment.Currency,
		StatusCreated,
	)

	return err
}

func (repo *repository) MarkPaidIfCreated(ctx context.Context, orderID, paymentID, signature string) (bool, error) {

	dat, err := repo.db.ExecContext(
		ctx,
		UpdatePaymentIfCreatedQuery,
		StatusPaid,
		paymentID,
		signature,
		orderID,
		StatusCreated,
	)

	if err != nil {
		return false, err
	}

	n, err := dat.RowsAffected()
	if err != nil {
		return false, err
	}

	return n > 0, nil
}

func (repo *repository) ActivateTag(ctx context.Context, tagID, userID string, expiry time.Time) error {
	res, err := repo.db.ExecContext(ctx,
		TagActivationQuery,
		expiry,
		tagID,
		userID,
	)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return errors.New("not found")
	}
	return nil
}

func (repo *repository) GetTagIDByOrderID(ctx context.Context, orderID string) (string, string, error) {
	var tagID, userID string

	err := repo.db.QueryRowContext(ctx,
		FetchTagIDByOrderQuery,
		orderID,
	).Scan(
		&tagID,
		&userID,
	)

	return tagID, userID, err
}
