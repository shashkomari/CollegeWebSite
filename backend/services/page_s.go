package services

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
)

func (s *Service) CreatePage(page models.CreatePageData) (string, string, error) {
	if page.Name == "" {
		return "", "", fmt.Errorf("repository.CreatePage: name is empty")
	}
	text_for_url := translateUkrainianToEnglish(strings.ToLower(page.Name))
	text_for_url = regexp.MustCompile("[^a-zA-Zа-яА-Я]").ReplaceAllString(text_for_url, "")
	url := "http://localhost:8080/" + text_for_url

	id, err := s.repository.CreatePage(page, url)
	if err != nil {
		return id, url, fmt.Errorf("repository.CreatePage: %w", err)
	}

	return id, url, nil
}

func translateUkrainianToEnglish(ukrainianText string) string {
	var ukrainianToEnglish = map[string]string{
		"а": "a", "б": "b", "в": "v", "г": "h", "ґ": "g", "д": "d", "е": "e", "є": "ye", "ж": "zh", "з": "z",
		"и": "y", "і": "i", "ї": "yi", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p",
		"р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "shch",
		"ь": "'", "ю": "yu", "я": "ya"}

	var englishText string
	for _, char := range ukrainianText {
		if translated, ok := ukrainianToEnglish[string(char)]; ok {
			englishText += translated
		} else {
			englishText += string(char)
		}
	}
	return englishText
}
