package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"golang.org/x/crypto/bcrypt"
)

type accountRepository interface {
	GetAccount(email string) (models.AccountData, error)
}

type AccountService struct {
	repository accountRepository
}

func NewAccountService(repository accountRepository) *AccountService {
	return &AccountService{
		repository: repository,
	}
}

func (s *AccountService) GetAccount(signIn models.AccountData) error {
	// hash_password, err := bcrypt.GenerateFromPassword([]byte(signIn.Password), 14)
	// if err != nil {
	// 	return fmt.Errorf("repository.GenerateFromPassword: %w", err)
	// }

	account, err := s.repository.GetAccount(signIn.Email)
	if err != nil {
		return fmt.Errorf("repository.GetAccount: %w", err)
	}

	//fmt.Printf("Password: %q", account.Password)

	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(signIn.Password))
	if err != nil {
		return fmt.Errorf("repository.CompareHashAndPassword: %w", err)
	}

	// if account.Email != signIn.Email || account.Password != signIn.Password {
	// 	return fmt.Errorf("the login or passwort is inncorrect")
	// }

	return nil
}
