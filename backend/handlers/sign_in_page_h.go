package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) SignIn(c *gin.Context) {
	var account models.AccountData

	if err := c.BindJSON(&account); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}

	token, err := h.Service.GetAccount(account)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.GetAccount": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
	})
}
