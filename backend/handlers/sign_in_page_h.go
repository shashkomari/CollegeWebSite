package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

type accountService interface {
	//CreateAccount()()
	//DeleteAccount()()
	//UpdateAccount()()
	GetAccount(signIn models.AccountData) error
}

type AccountHTTP struct {
	accountService accountService
}

func NewAccountHttp(accountService accountService) *AccountHTTP {
	return &AccountHTTP{accountService: accountService}
}

func (h *AccountHTTP) SignIn(c *gin.Context) {
	var account models.AccountData

	if err := c.BindJSON(&account); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err := h.accountService.GetAccount(account)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{})
}
