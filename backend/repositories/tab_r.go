package repositories

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *Repository) CreateTab(name string) (string, error) {
	collection := r.db.Collection("tabs")
	result, err := collection.InsertOne(context.Background(), bson.M{"name": name})
	if err != nil {
		return "", fmt.Errorf("failed to create tab: %w", err)
	}

	id := result.InsertedID.(primitive.ObjectID).Hex()
	return id, nil
}
