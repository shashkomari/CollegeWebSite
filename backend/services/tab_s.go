package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreateTab(tab models.CreateTab) (string, string, error) {
	if tab.Name == "" {
		return "", "", fmt.Errorf("services.CreateTab: name is empty")
	}

	id, err := s.repository.CreateTab(tab.Name)
	if err != nil {
		return id, "", fmt.Errorf("repository.CreateTab: %w", err)
	}
	var page models.CreatePage
	page.Name, page.TabID = tab.Name, id
	_, page_url, err := s.CreatePage(page)
	if err != nil {
		return id, page_url, fmt.Errorf("repository.CreatePage: %w", err)
	}

	return id, page_url, nil
}

func (s *Service) GetTabs() ([]models.GetTabs, error) {
	tabs, err := s.repository.GetTabs()
	if err != nil {
		return nil, fmt.Errorf("repository.GetTabs: %w", err)
	}

	return tabs, err
}

func (s *Service) DeleteTab(id string) error {
	err := s.repository.DeleteTab(id)
	if err != nil {
		return fmt.Errorf("repository.DeleteTab: %w", err)
	}

	return nil
}

func (s *Service) EditTab(tab models.GetTabs) error {
	if tab.Name == "" {
		return fmt.Errorf("services.EditTab: name is empty")
	}

	err := s.repository.EditTab(tab)
	if err != nil {
		return fmt.Errorf("repository.EditTab: %w", err)
	}

	return nil
}
