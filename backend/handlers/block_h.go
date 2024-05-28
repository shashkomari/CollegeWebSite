package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) CreateBlock(c *gin.Context) {
	var block models.CreateBlock

	if err := c.BindJSON(&block); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}
	log.Println(block)
	id, err := h.Service.CreateBlock(block)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.CreateBlock": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}
