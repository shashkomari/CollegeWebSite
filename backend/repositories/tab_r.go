package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *Repository) CreateTab(name string) (string, error) {
	collection := r.db.Collection("tabs")
	tab := models.DBCreateTab{
		Name:  name,
		Pages: []models.DBCreatePage{},
	}
	result, err := collection.InsertOne(context.Background(), tab)
	if err != nil {
		return "", fmt.Errorf("failed to create tab: %w", err)
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	return id, nil
}
