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

	CreateTab(tab models.CreateTab) (string, string, error)

	CreatePage(page models.CreatePage) (string, string, error)
	GetPageIdByUrl(url string) (string, error)

	CreateBlock(block models.CreateBlock) (string, error)
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
