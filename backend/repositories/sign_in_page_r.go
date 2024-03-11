package repositories

import (
	"database/sql"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func NewAccountRepository(db *sql.DB) *AccountRepository {
	return &AccountRepository{
		db: db,
	}
}

type AccountRepository struct {
	db *sql.DB
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

	err := r.db.QueryRow("SELECT * FROM admin WHERE email = $1", email).Scan(&account.Email, &account.Password)
	if err != nil {
		return models.AccountData{}, fmt.Errorf("failed to get list of accounts: %w", err)
	}
	return account, nil
}
