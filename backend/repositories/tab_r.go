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
		// thisTab.ID, thisTab.Name, thisTab.Url = oneTab.ID, oneTab.Name, oneTab.Pages[0].URL
		thisTab.ID, thisTab.Name = oneTab.ID, oneTab.Name
		tabs = append(tabs, thisTab)
	}

	// Check for any cursor errors
	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return tabs, nil
}

func (r *Repository) DeleteTab(id string) error {
	// Convert the id string to a MongoDB ObjectID
	tabObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid tab ID: %w", err)
	}

	// Define the collection
	collection := r.db.Collection("tabs")

	// Define the filter to match the tab with the specified ID
	filter := bson.M{"_id": tabObjID}

	// Perform the delete operation
	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		return fmt.Errorf("failed to delete tab: %w", err)
	}

	// Check if a document was deleted
	if result.DeletedCount == 0 {
		return fmt.Errorf("tab ID %s not found", id)
	}

	return nil
}

func (r *Repository) EditTab(tab models.GetTabs) error {
	collection := r.db.Collection("tabs")

	// Build the update document dynamically to include only non-empty fields
	updateDoc := bson.M{}
	if tab.Name != "" {
		updateDoc["name"] = tab.Name
	}

	// If there are no fields to update, return nil
	if len(updateDoc) == 0 {
		return nil
	}

	// Define the update operation
	update := bson.M{
		"$set": updateDoc,
	}

	// Create the filter to find the specific tab by its ID
	filter := bson.M{"_id": tab.ID}

	// Execute the update operation
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update: %w", err)
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", result.MatchedCount, result.ModifiedCount)

	return nil
}
