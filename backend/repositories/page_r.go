package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *Repository) CreatePage(page models.CreatePageData, url string) (string, error) {
	collection := r.db.Collection("pages")
	result, err := collection.InsertOne(context.Background(), bson.M{"name": page.Name, "url": url, "tab_name": page.TabName})
	if err != nil {
		return "", fmt.Errorf("failed to create page: %w", err)
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	return id, nil
}
