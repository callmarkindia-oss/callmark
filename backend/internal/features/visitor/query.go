package visitor

const visitorSMSQuery = `
	INSERT INTO visitor_message
		(
			message,
			tag_token
		)
	VALUES ($1, $2)
	RETURNING id, created_at, message
`

const tagTokenOwnerName = `
    SELECT 
        u.fname,
        u.lname
    FROM tags t
    INNER JOIN users u
        ON u.id = t.user_id
    WHERE 
        t.tag_token = $1
`

const tagTokenToPhNoQuery = `
	SELECT 
		u.phonenumber 
	FROM users u
	INNER JOIN tags t
		ON t.user_id = u.id
	WHERE t.tag_token = $1
`
