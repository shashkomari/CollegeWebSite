package repositories

import (
	"context"
	"fmt"
	"log"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func NewAccountRepository(client *mongo.Client) *AccountRepository {
	dbName := "college_web_site_db"
	db := client.Database(dbName)
	return &AccountRepository{
		db: db,
	}
}

type AccountRepository struct {
	db *mongo.Database
}

func (r *AccountRepository) GetAccount(email string) (models.AccountData, error) {
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
	log.Println(account.Password)

	return account, nil
}
