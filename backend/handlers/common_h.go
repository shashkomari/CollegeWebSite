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

	CreateTab(tab models.TabData) (string, string, error)

	CreatePage(page models.CreatePageData) (string, string, error)

	CreateBlock(block models.BlockData) (string, error)
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
