package tag

import (
	"context"
	"database/sql"
)

type Repository interface {
	CreateTag(ctx context.Context, tag TagModel) (TagModel, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (repo *repository) CreateTag(ctx context.Context, tag TagModel) (TagModel, error) {

	err := repo.db.QueryRowContext(
		ctx,
		TagQuery,
		tag.UserID,
		tag.TagType,
		tag.TagToken,
		tag.Identifier,
		false,
	).Scan(
		&tag.ID,
		&tag.CreatedAt,
	)

	return tag, err
}
