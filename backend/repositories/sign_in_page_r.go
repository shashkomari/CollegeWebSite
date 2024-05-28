package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
)

func (r *Repository) GetAccount(email string) (models.AccountData, error) {
	// var email = "m@gmail.com"
	// var password = "1111"

	// hash_password, err := bcrypt.GenerateFromPassword([]byte(signIn.Password), 14)
	// if err != nil {
	// 	return models.AccountData{}, fmt.Errorf("failed hashing: %w", err)
	// }

	// if _, err := r.db.Exec("INSERT INTO admin (email, password_hash) VALUES ($1, $2)", signIn.Email, string(hash_password)); err != nil {
	// 	return models.AccountData{}, fmt.Errorf("failed to insert admin account into DB: %w", err)
	// }

	account := models.AccountData{}
	collection := r.db.Collection("accounts")
	err := collection.FindOne(context.TODO(), bson.M{"email": email}).Decode(&account)
	if err != nil {
		return models.AccountData{}, fmt.Errorf("failed to get list of accounts: %w", err)
	}

	return account, nil
}
