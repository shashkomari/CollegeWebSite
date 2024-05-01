package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateTab(tab models.TabData) (string, error) {
	id, err := s.repository.CreateTab(tab.Name)
	if err != nil {
		return id, fmt.Errorf("repository.CreateTab: %w", err)
	}

	return id, nil
}
