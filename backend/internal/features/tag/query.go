package tag

const TagQuery = `
	INSERT into tags 
		(	
			user_id,
			tag_type,
			tag_token,
			identifier,
			is_active
		)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id, created_at
`

const AllTagFetchQuery = `
	SELECT 
		id,
		tag_type,
		tag_token,
		identifier,
		is_active,
		created_at,
		expiry_at
	FROM tags
	WHERE user_id = $1
`
