package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateBlock(block models.CreateBlock) (string, error) {
	if block.Type == "" {
		return "", fmt.Errorf("services.CreateBlock: type is empty")
	}
	if block.PageId == "" {
		return "", fmt.Errorf("services.CreateBlock: page_id is empty")
	}

	switch block.Type {
	case "block text":
		if block.Text == "" {
			return "", fmt.Errorf("services.CreateBlock: text is empty")
		}

	case "block image+text":
		if block.Text == "" {
			return "", fmt.Errorf("services.CreateBlock: text is empty")
		}

	case "block text+link":
		if block.Text == "" {
			return "", fmt.Errorf("services.CreateBlock: text is empty")
		}
		if block.Link == "" { // TODO: validate link
			return "", fmt.Errorf("services.CreateBlock: link is empty")
		}
		if block.LinkText == "" {
			return "", fmt.Errorf("services.CreateBlock: linktext is empty")
		}

	case "block link":
		if block.Link == "" { // TODO: validate link
			return "", fmt.Errorf("services.CreateBlock: link is empty")
		}
		if block.LinkText == "" {
			return "", fmt.Errorf("services.CreateBlock: linktext is empty")
		}

	default:
		return "", fmt.Errorf("services.CreateBlock: error type %q", block.Type)
	}

	var blockdata models.DBCreateBlock
	blockdata.Type = block.Type
	blockdata.Link = block.Link
	blockdata.Text = block.Text
	blockdata.LinkText = block.LinkText

	id, err := s.repository.CreateBlock(blockdata, block.PageId)
	if err != nil {
		return "", fmt.Errorf("repository.CreateBlock: %w", err)
	}

	return id, nil
}

func (s *Service) GetBlocks(pageId string) ([]models.DBCreateBlock, error) {
	blocks, err := s.repository.GetBlocks(pageId)
	if err != nil {
		return nil, fmt.Errorf("repository.GetBlock: %w", err)
	}

	return blocks, err
}

func (s *Service) DeleteBlock(id string) error {
	err := s.repository.DeleteBlock(id)
	if err != nil {
		return fmt.Errorf("repository.DeleteBlock: %w", err)
	}
	return nil
}
