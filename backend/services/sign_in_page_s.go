package services

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func (s *Service) GetAccount(signIn models.AccountData) (string, error) {
	// hash_password, err := bcrypt.GenerateFromPassword([]byte(signIn.Password), 14)
	// if err != nil {
	// 	return fmt.Errorf("repository.GenerateFromPassword: %w", err)
	// }

	account, err := s.repository.GetAccount(signIn.Email)
	if err != nil {
		return "", fmt.Errorf("repository.GetAccount: %w", err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(signIn.Password))
	if err != nil {
		return "", fmt.Errorf("repository.CompareHashAndPassword: %w", err)
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &TokenClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(tokenTTL).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
		Email: account.Email,
	})

	// if account.Email != signIn.Email || account.Password != signIn.Password {
	// 	return fmt.Errorf("the login or passwort is inncorrect")
	// }

	return token.SignedString([]byte(signingKey))
}

const (
	salt       = "gsdgjks4352btw8gfdjksfb"
	signingKey = "my_secret_key"
	tokenTTL   = 30 * time.Minute
)

type TokenClaims struct {
	jwt.StandardClaims
	Email string `json:"email"`
}
