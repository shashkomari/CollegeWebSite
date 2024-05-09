package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *Repository) CreateBlock(block models.BlockData) (string, error) {
	collection := r.db.Collection("blocks")
	result, err := collection.InsertOne(context.Background(), bson.M{"type": block.Type, "text": block.Text, "page_id": block.PageId})
	if err != nil {
		return "", fmt.Errorf("failed to create block: %w", err)
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	return id, nil
}
