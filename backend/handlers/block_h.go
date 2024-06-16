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

	if block.Type == "block image+text" {
		_, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"Error FormFile": err.Error(),
			})
			return
		}

		// h.Service.saveFileToGridFS(image)
		// fileID, err := saveFileToGridFS(image)
		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file: " + err.Error()})
		// 	return
		// }

		// Зберігання ObjectID файлу в структурі block
		// block.Image = fileID.Hex()

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

func (h *HTTP) GetBlocks(c *gin.Context) {
	pageId := c.GetHeader("PageID")
	if pageId == "" {
		log.Println("GetBlocks: PageID is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "GetBlocks: PageID is empty",
		})
		return
	}
	log.Println(pageId)
	blocks, err := h.Service.GetBlocks(pageId)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.GetBlocks": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"blocks": blocks,
	})
}

func (h *HTTP) DeleteBlock(c *gin.Context) {
	id := c.GetHeader("id")
	if id == "" {
		log.Println("DeleteBlock: id is empty")
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "DeleteBlock: id is empty",
		})
		return
	}

	err := h.Service.DeleteBlock(id)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.DeleteBlock": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}

func (h *HTTP) EditBlock(c *gin.Context) {
	var block models.DBCreateBlock
	if err := c.BindJSON(&block); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error BindJSON": err.Error(),
		})
		return
	}

	log.Println(block)
	err := h.Service.EditBlock(block)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"Error h.Service.EditBlock": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{})
}
