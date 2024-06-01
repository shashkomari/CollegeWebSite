package services

import "github.com/shashkomari/CollegeWebSite.git/backend/models"

type Service struct {
	repository Repository
}

type Repository interface {
	GetAccount(email string) (models.AccountData, error)

	GetTabs() ([]models.GetTabs, error)
	CreateTab(tab string) (string, error)

	//GetPages(tabId string) ([]models.GetPages, error)
	CreatePage(page models.DBCreatePage, tabID string) (string, error)
	GetPageIdByUrl(url string) (string, error)

	GetBlocks(pageId string) ([]models.DBCreateBlock, error)
	CreateBlock(block models.DBCreateBlock, pageID string) (string, error)
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}
