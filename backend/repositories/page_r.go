package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (r *Repository) CreatePage(page models.DBCreatePage, tabID string) (string, error) {
	tabObjID, err := primitive.ObjectIDFromHex(tabID)
	if err != nil {
		return "", fmt.Errorf("failed to create page: %w", err)
	}
	collection := r.db.Collection("tabs")

	page.ID = primitive.NewObjectID()

	_, err = collection.UpdateOne(
		context.Background(),
		bson.M{"_id": tabObjID},
		bson.M{"$addToSet": bson.M{"pages": page}},
	)
	if err != nil {
		return "", fmt.Errorf("failed to create page: %w", err)
	}

	return page.ID.Hex(), nil
}

func (r *Repository) GetPageIdByUrl(url string) (string, error) {

	collection := r.db.Collection("tabs")

	// Створюємо pipeline для агрегування, щоб знайти сторінку з потрібним URL
	pipeline := mongo.Pipeline{
		{
			{Key: "$match", Value: bson.D{
				{Key: "pages.url", Value: url},
			}},
		},
		{
			{Key: "$unwind", Value: "$pages"},
		},
		{
			{Key: "$match", Value: bson.D{
				{Key: "pages.url", Value: url},
			}},
		},
		{
			{Key: "$project", Value: bson.D{
				{Key: "pageId", Value: "$pages._id"},
			}},
		},
	}

	cursor, err := collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return "", fmt.Errorf("failed to aggregate filter pipeline: %w", err)
	}

	var results []struct {
		PageId string `bson:"pageId"`
	}
	if err = cursor.All(context.TODO(), &results); err != nil {
		return "", fmt.Errorf("failed to run cursor.All: %w", err)
	}

	if len(results) == 0 {
		return "", fmt.Errorf("no page found with the specified url")
	}

	return results[0].PageId, nil
}

func (r *Repository) DeletePage(id string) error {
	// Convert the pageID string to a MongoDB ObjectID
	pageObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid page ID: %w", err)
	}

	// Define the collection
	collection := r.db.Collection("tabs")

	// Define the filter and update to remove the page with the specified ID from the pages array
	filter := bson.M{"pages._id": pageObjID}
	update := bson.M{
		"$pull": bson.M{"pages": bson.M{"_id": pageObjID}},
	}

	// Perform the update operation
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to delete page: %w", err)
	}

	// Check if a document was modified
	if result.ModifiedCount == 0 {
		return fmt.Errorf("page ID %s not found", id)
	}

	return nil
}

func (r *Repository) EditPage(page models.AllPage) error {
	collection := r.db.Collection("tabs")

	// Prepare the update document with non-empty fields
	updateDoc := bson.M{}

	if page.Name != "-" {
		updateDoc["pages.$[page].name"] = page.Name
	}

	// Define the filter to find the specific page by its ID within the tabs collection
	filter := bson.M{
		"pages._id": page.ID,
	}

	update := bson.M{
		"$set": updateDoc,
	}

	// Define array filters to correctly identify the page
	arrayFilters := options.ArrayFilters{
		Filters: []interface{}{
			bson.M{"page._id": page.ID},
		},
	}

	updateOptions := options.UpdateOptions{
		ArrayFilters: &arrayFilters,
	}

	// Execute the update operation
	result, err := collection.UpdateOne(context.TODO(), filter, update, &updateOptions)
	if err != nil {
		return fmt.Errorf("failed to update page: %w", err)
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", result.MatchedCount, result.ModifiedCount)

	return nil
}
