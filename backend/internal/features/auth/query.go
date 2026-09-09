package auth

const SignupQuery = `
	INSERT INTO users
		(
			lname,
			fname,
			email,
			phonenumber,
			password
		)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id, created_at
`

const LoginQuery = `
	SELECT
		id,
		email,
		password
	FROM users
	WHERE email = $1
`

const SessionCreationQuery = `
	INSERT INTO sessions 
		(
			user_id,
			token,
			expiry_at
		)
	VALUES ($1, $2, $3)
	RETURNING created_at
`

const MeQuery = `
	SELECT 
		u.id,
		u.fname,
		u.lname,
		u.phonenumber,
		u.email,
		s.expiry_at
	FROM users u
	INNER JOIN sessions s 
		ON s.user_id = u.id
		AND s.token = $1
`
