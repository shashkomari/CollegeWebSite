package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateBlock(block models.BlockData) (string, error) {
	if block.Type == "" {
		return "", fmt.Errorf("services.CreateBlock: type is empty")
	}
	if block.PageId == "" {
		return "", fmt.Errorf("services.CreateBlock: page_id is empty")
	}

	id, err := s.repository.CreateBlock(block)
	if err != nil {
		return id, fmt.Errorf("repository.CreateBlock: %w", err)
	}

	return id, nil
}
