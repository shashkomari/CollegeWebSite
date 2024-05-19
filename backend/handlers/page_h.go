package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) GetPageIdByUrl(c *gin.Context) {
	var url models.GetPageIdByUrl

	if err := c.BindJSON(&url); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}

	id, err := h.Service.GetPageIdByUrl(url.URL)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.GetPageIdByUrl": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id": id,
	})
}
