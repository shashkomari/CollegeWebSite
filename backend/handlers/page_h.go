package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) GetPageIdByUrl(c *gin.Context) {
	var url models.GetPageIdByUrl

	url.URL = c.GetHeader("Url")
	if url.URL == "" {
		log.Println("GetPageIdByUrl: Url is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "GetPageIdByUrl: Url is empty",
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
