package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

const imgurClientID = "b3e177681228480" // TODO: move to .env

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

func (h *HTTP) UploadImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid file"})
		return
	}
	defer file.Close()

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", fmt.Sprintf("Client-ID %s", imgurClientID)).
		SetFileReader("image", header.Filename, file).
		Post("https://api.imgur.com/3/image")

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to upload image"})
		return
	}

	if resp.IsError() {
		c.JSON(resp.StatusCode(), gin.H{"error": "Error from Imgur", "message": resp.String()})
		return
	}

	var result map[string]interface{}
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Imgur response"})
		return
	}

	data, ok := result["data"].(map[string]interface{})
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid response from Imgur"})
		return
	}

	imgURL, ok := data["link"].(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No link found in Imgur response"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": imgURL})
}
