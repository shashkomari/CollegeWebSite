package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

type accountRepository interface {
	GetAccount(signIn models.AccountData) (models.AccountData, error)
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
	var account models.AccountData
	var err error

	account, err = s.repository.GetAccount(signIn)
	if err != nil {
		return fmt.Errorf("repository.GetAccount: %w", err)
	}

	if account.Email != signIn.Email || account.Password != signIn.Password {
		return fmt.Errorf("the login or passwort is inncorrect")
	}

	return nil
}
