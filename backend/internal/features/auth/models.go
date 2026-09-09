package auth

import "time"

type CredModel struct {
	ID          string `json:"id" db:"id"`
	Phonenumber string `json:"phonenumber" db:"phonenumber"`
	Email       string `json:"email" db:"email"`
	Fname       string `json:"fname" db:"fname"`
	Lname       string `json:"lname" db:"lname"`
	Password    string `json:"password" db:"password"`
	CreatedAt   string `json:"created_at" db:"created_at"`
}

type LoginModel struct {
	ID       string `json:"id" db:"id"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}

type SessionModel struct {
	UserID    string    `json:"user_id" db:"user_id"`
	Token     string    `json:"token" db:"token"`
	ExpiryAt  time.Time `json:"expiry_at" db:"expiry_at"`
	CreatedAt string    `json:"created_at" db:"created_at"`
}

type UserModel struct {
	ID          string `json:"id" db:"id"`
	Phonenumber string `json:"phonenumber" db:"phonenumber"`
	Email       string `json:"email" db:"email"`
	Fname       string `json:"fname" db:"fname"`
	Lname       string `json:"lname" db:"lname"`
}

type SessionExpireModel struct {
	ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
}

type MeModal struct {
	Authenticated bool               `json:"authenticated"`
	User          UserModel          `json:"user"`
	Session       SessionExpireModel `json:"session"`
}
