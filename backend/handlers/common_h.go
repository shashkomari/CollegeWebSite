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

	CreateTab(tab models.TabData) (string, error)
}

func NewHttpHandler(Service Service) *HTTP {
	return &HTTP{Service: Service}
}
