package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
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

func (r *Repository) GetTabs() ([]models.GetTabs, error) {
	collection := r.db.Collection("tabs")

	// Define a filter to get all documents
	filter := bson.D{}

	// Define a slice to hold the results
	var tabs []models.GetTabs

	// Execute the query to find all documents
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get tabs: %w", err)
	}
	defer cursor.Close(context.Background())

	// Iterate through the cursor and decode each document into the tabs slice
	for cursor.Next(context.Background()) {
		var oneTab models.GetTabsFromDB
		if err := cursor.Decode(&oneTab); err != nil {
			return nil, fmt.Errorf("failed to decode tab: %w", err)
		}

		var thisTab models.GetTabs
		thisTab.ID, thisTab.Name, thisTab.Url = oneTab.ID, oneTab.Name, oneTab.Pages[0].URL

		tabs = append(tabs, thisTab)
	}

	// Check for any cursor errors
	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return tabs, nil
}
