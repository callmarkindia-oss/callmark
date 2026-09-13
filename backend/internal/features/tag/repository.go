package tag

import (
	"context"
	"database/sql"
)

type Repository interface {
	CreateTag(ctx context.Context, tag TagModel) (TagModel, error)
	GetAllTags(ctx context.Context, user_id string) ([]TagModel, error)
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

func (repo *repository) GetAllTags(ctx context.Context, user_id string) ([]TagModel, error) {

	rows, err := repo.db.QueryContext(
		ctx,
		AllTagFetchQuery,
		user_id,
	)
	if err != nil {
		return []TagModel{}, err
	}
	defer rows.Close()

	var tags []TagModel

	for rows.Next() {

		var tag TagModel

		err := rows.Scan(
			&tag.ID,
			&tag.TagType,
			&tag.TagToken,
			&tag.Identifier,
			&tag.IsActive,
			&tag.CreatedAt,
			&tag.ExpiryAt,
		)
		if err != nil {
			return []TagModel{}, err
		}

		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		return []TagModel{}, err
	}

	return tags, err
}
