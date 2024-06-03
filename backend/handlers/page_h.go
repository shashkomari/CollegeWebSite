package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (h *HTTP) CreatePage(c *gin.Context) {
	var page models.CreatePage

	if err := c.BindJSON(&page); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}
	log.Println(page)
	id, url, err := h.Service.CreatePage(page)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.CreatePage": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"id":  id,
		"url": url,
	})
}

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

func (h *HTTP) DeletePage(c *gin.Context) {
	id := c.GetHeader("id")
	if id == "" {
		log.Println("DeletePage: id is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "DeletePage: id is empty",
		})
		return
	}

	err := h.Service.DeletePage(id)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.DeletePage": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}
