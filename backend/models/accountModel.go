package models

type AccountData struct {
	Password string `bson:"password_hash"`
	Email    string `bson:"email"`
}
