package visitor

import (
	"context"
	"database/sql"
)

type Repository interface {
	CreateSMS(ctx context.Context, message string, tagToken string) (SMSModel, error)
	GetPhonenumberFromTagToken(ctx context.Context, tagToken string) (string, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) CreateSMS(ctx context.Context, message string, tagToken string) (SMSModel, error) {

	var sms SMSModel

	err := repo.db.QueryRowContext(
		ctx,
		visitorSMSQuery,
		message,
		tagToken,
	).Scan(
		&sms.ID,
		&sms.CreatedAt,
		&sms.Message,
	)
	if err != nil {
		return sms, err
	}

	return sms, nil
}

func (repo *repository) GetPhonenumberFromTagToken(ctx context.Context, tagToken string) (string, error) {

	var phonenumber string

	err := repo.db.QueryRowContext(
		ctx,
		tagTokenToPhNoQuery,
		tagToken,
	).Scan(
		&phonenumber,
	)

	if err != nil {
		return "", err
	}

	return phonenumber, nil
}
