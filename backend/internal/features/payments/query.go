package payments

const TagExistanceQuery = `
	SELECT EXISTS
		(
			SELECT 1
			FROM tags
			WHERE id = $1 AND user_id = $2
		)
`

const PaymentInsertionQuery = `
	INSERT INTO tag_payments 
		(
			tag_id, 
			user_id, 
			razorpay_order_id, 
			amount, 
			currency, 
			status
		)
		VALUES ($1, $2, $3, $4, $5, $6)
`

const UpdatePaymentIfCreatedQuery = `
	UPDATE tag_payments
		SET 
			status = $1, 
			razorpay_payment_id = $2, 
			razorpay_signature = $3, 
			updated_at = now()
		WHERE 
			razorpay_order_id = $4 
			AND 
			status = $5
`

const TagActivationQuery = `
	UPDATE tags 
		SET 
			is_active = true, 
			expiry_at = $1
		WHERE 
			id = $2 
			AND 
			user_id = $3
`

const FetchTagIDByOrderQuery = `
	SELECT 
		tag_id, 
		user_id 
	FROM tag_payments 
	WHERE 
		razorpay_order_id = $1
`
