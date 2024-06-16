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

	GetTabs() ([]models.GetTabsFromDB, error)
	CreateTab(tab models.CreateTab) (string, error)
	DeleteTab(id string) error
	EditTab(tab models.GetTabs) error

	//GetPages(tabId string) ([]models.GetPages, error)
	CreatePage(page models.CreatePage) (string, error)
	DeletePage(id string) error
	GetPageIdByUrl(url string) (string, error)
	EditPage(page models.AllPage) error

	GetBlocks(pageId string) ([]models.DBCreateBlock, error)
	CreateBlock(block models.CreateBlock) (string, error)
	DeleteBlock(id string) error
	EditBlock(block models.DBCreateBlock) error
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
