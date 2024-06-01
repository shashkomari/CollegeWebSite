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

	//GetTabs() ([]models.DBCreateTab, error)
	CreateTab(tab models.CreateTab) (string, string, error)

	//GetPages(tabId string) ([]models.GetPages, error)
	CreatePage(page models.CreatePage) (string, string, error)
	GetPageIdByUrl(url string) (string, error)

	GetBlocks(pageId string) ([]models.DBCreateBlock, error)
	CreateBlock(block models.CreateBlock) (string, error)
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
