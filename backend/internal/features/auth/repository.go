package auth

import (
	"context"
	"database/sql"
)

type Repository interface {
	Signup(ctx context.Context, creds CredModel) (CredModel, error)
	Login(ctx context.Context, email string) (LoginModel, error)
	CreateSession(ctx context.Context, session SessionModel) (SessionModel, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) Signup(ctx context.Context, creds CredModel) (CredModel, error) {

	err := repo.db.QueryRowContext(
		ctx,
		SignupQuery,
		creds.Fname,
		creds.Lname,
		creds.Email,
		creds.Phonenumber,
		creds.Password,
	).Scan(
		&creds.ID,
		&creds.CreatedAt,
	)

	return creds, err
}

func (repo *repository) Login(ctx context.Context, email string) (LoginModel, error) {

	var login LoginModel
	err := repo.db.QueryRowContext(
		ctx,
		LoginQuery,
		email,
	).Scan(
		&login.ID,
		&login.Email,
		&login.Password,
	)

	return login, err
}

func (repo *repository) CreateSession(ctx context.Context, session SessionModel) (SessionModel, error) {

	err := repo.db.QueryRowContext(
		ctx,
		SessionCreationQuery,
		session.UserID,
		session.Token,
		session.ExpiryAt,
	).Scan(
		&session.CreatedAt,
	)

	return session, err
}
