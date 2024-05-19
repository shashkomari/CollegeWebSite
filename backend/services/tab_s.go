package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateTab(tab models.TabData) (string, string, error) {
	if tab.Name == "" {
		return "", "", fmt.Errorf("services.CreateTab: name is empty")
	}

	id, err := s.repository.CreateTab(tab.Name)
	if err != nil {
		return id, "", fmt.Errorf("repository.CreateTab: %w", err)
	}
	var page models.CreatePageData
	page.Name, page.TabName = tab.Name, tab.Name
	_, page_url, err := s.CreatePage(page)
	if err != nil {
		return id, page_url, fmt.Errorf("repository.CreatePage: %w", err)
	}

	return id, page_url, nil
}
