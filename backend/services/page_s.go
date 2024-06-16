package services

import (
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreatePage(aboutPage models.CreatePage) (string, error) {
	var page models.DBCreatePage
	if aboutPage.Name == "" {
		return "", fmt.Errorf("repository.CreatePage: name is empty")
	}
	// text_for_url := translateUkrainianToEnglish(strings.ToLower(aboutPage.Name))
	// text_for_url = regexp.MustCompile("[^a-zA-Zа-яА-Я]").ReplaceAllString(text_for_url, "")

	page.Name = aboutPage.Name
	page.Blocks = make([]models.DBCreateBlock, 0)

	id, err := s.repository.CreatePage(page, aboutPage.TabID)
	if err != nil {
		return id, fmt.Errorf("repository.CreatePage: %w", err)
	}

	return id, nil
}

// func translateUkrainianToEnglish(ukrainianText string) string {
// 	var ukrainianToEnglish = map[string]string{
// 		"а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ye", "ж": "zh", "з": "z",
// 		"и": "y", "і": "i", "ї": "yi", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
// 		"р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
// 		"ь": "'", "ю": "yu", "я": "ya"}

// 	var englishText string
// 	for _, char := range ukrainianText {
// 		if translated, ok := ukrainianToEnglish[string(char)]; ok {
// 			englishText += translated
// 		} else {
// 			englishText += string(char)
// 		}
// 	}
// 	return englishText
// }

func (s *Service) GetPageIdByUrl(url string) (string, error) {
	id, err := s.repository.GetPageIdByUrl(url)
	if err != nil {
		return id, fmt.Errorf("repository.GetPageIdByUrl: %w", err)
	}

	return id, nil
}

func (s *Service) DeletePage(id string) error {
	err := s.repository.DeletePage(id)
	if err != nil {
		return fmt.Errorf("repository.DeletePage: %w", err)
	}

	return nil
}

func (s *Service) EditPage(aboutPage models.AllPage) error {
	var page models.AllPage
	if aboutPage.Name == "" {
		return fmt.Errorf("repository.EditPage: name is empty")
	}
	if aboutPage.Name != "-" {
		// text_for_url := translateUkrainianToEnglish(strings.ToLower(aboutPage.Name))
		// text_for_url = regexp.MustCompile("[^a-zA-Zа-яА-Я]").ReplaceAllString(text_for_url, "")
		page.Name = aboutPage.Name
	}

	err := s.repository.EditPage(page)
	if err != nil {
		return fmt.Errorf("repository.EditPage: %w", err)
	}

	return nil
}
