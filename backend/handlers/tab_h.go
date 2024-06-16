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

	id, err := h.Service.CreateTab(tab)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.CreateTab": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
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

func (h *HTTP) DeleteTab(c *gin.Context) {
	id := c.GetHeader("id")
	if id == "" {
		log.Println("DeleteTab: id is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "DeleteTab: id is empty",
		})
		return
	}

	err := h.Service.DeleteTab(id)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.DeletePage": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

func (h *HTTP) EditTab(c *gin.Context) {
	var tab models.GetTabs

	if err := c.BindJSON(&tab); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}

	err := h.Service.EditTab(tab)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.EditTab": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}
