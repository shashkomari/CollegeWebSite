package handlers

import "github.com/shashkomari/CollegeWebSite.git/backend/models"

type HTTP struct {
	Service Service
}

type Service interface {
	//CreateAccount()()
	//DeleteAccount()()
	//UpdateAccount()()
	GetAccount(signIn models.AccountData) (string, error)

	GetTabs() ([]models.GetTabs, error)
	CreateTab(tab models.CreateTab) (string, string, error)
	DeleteTab(id string) error
	//EditTab()

	//GetPages(tabId string) ([]models.GetPages, error)
	CreatePage(page models.CreatePage) (string, string, error)
	DeletePage(id string) error
	GetPageIdByUrl(url string) (string, error)
	//EditPage()

	GetBlocks(pageId string) ([]models.DBCreateBlock, error)
	CreateBlock(block models.CreateBlock) (string, error)
	DeleteBlock(id string) error
	EditBlock(block models.DBCreateBlock) error
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
