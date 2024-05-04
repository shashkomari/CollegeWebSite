package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateTab(tab models.TabData) (string, error) {
	if tab.Name == "" {
		return "", fmt.Errorf("repository.CreateTab: name is empty")
	}

	id, err := s.repository.CreateTab(tab.Name)
	if err != nil {
		return id, fmt.Errorf("repository.CreateTab: %w", err)
	}
	var page models.CreatePageData
	page.Name, page.TabName = tab.Name, tab.Name
	url, err := s.CreatePage(page)
	if err != nil {
		return id, fmt.Errorf("repository.CreatePage: %w", err)
	}
	fmt.Println(url)
	return id, nil
}
