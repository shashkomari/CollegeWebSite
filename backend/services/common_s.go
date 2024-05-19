package services

import "github.com/shashkomari/CollegeWebSite.git/backend/models"

type Service struct {
	repository Repository
}

type Repository interface {
	GetAccount(email string) (models.AccountData, error)

	CreateTab(tab string) (string, error)

	CreatePage(page models.CreatePageData, url string) (string, error)
	GetPageIdByUrl(url string) (string, error)

	CreateBlock(block models.BlockData) (string, error)
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}
