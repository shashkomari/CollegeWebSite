package services

import "github.com/shashkomari/CollegeWebSite.git/backend/models"

type Service struct {
	repository Repository
}

type Repository interface {
	GetAccount(email string) (models.AccountData, error)

	GetTabs() ([]models.GetTabs, error)
	CreateTab(tab string) (string, error)
	DeleteTab(id string) error
	EditTab(tab models.GetTabs) error

	//GetPages(tabId string) ([]models.GetPages, error)
	CreatePage(page models.DBCreatePage, tabID string) (string, error)
	DeletePage(id string) error
	GetPageIdByUrl(url string) (string, error)
	EditPage(page models.AllPage) error

	GetBlocks(pageId string) ([]models.DBCreateBlock, error)
	CreateBlock(block models.DBCreateBlock, pageID string) (string, error)
	DeleteBlock(id string) error
	EditBlock(block models.DBCreateBlock) error
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}
