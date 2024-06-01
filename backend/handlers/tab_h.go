package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) CreateTab(c *gin.Context) {
	var tab models.CreateTab

	if err := c.BindJSON(&tab); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}

	id, page_url, err := h.Service.CreateTab(tab)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.CreateTab": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id":       id,
		"page_url": page_url,
	})
}

func (h *HTTP) GetTabs(c *gin.Context) {
	tabs, err := h.Service.GetTabs()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.GetTabs": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"tabs": tabs,
	})
}
