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

func (r *Repository) CreateBlock(block models.DBCreateBlock, pageID string) (string, error) {
	pageObjID, err := primitive.ObjectIDFromHex(pageID)
	if err != nil {
		return "", fmt.Errorf("failed to create block: %w", err)
	}

	collection := r.db.Collection("tabs")
	block.ID = primitive.NewObjectID()

	// Створюємо BSON-документ вручну, щоб видалити порожні поля
	updateDoc := bson.M{"_id": block.ID, "type": block.Type}
	if block.Text != "" {
		updateDoc["text"] = block.Text
	}
	if block.Link != "" {
		updateDoc["link"] = block.Link
	}
	if block.LinkText != "" {
		updateDoc["linkText"] = block.LinkText
	}
	if block.ImageSrc != "" {
		updateDoc["imageSrc"] = block.ImageSrc
	}

	// switch block.Type {
	// case "block text":
	update := bson.M{
		"$push": bson.M{"pages.$[page].blocks": updateDoc},
	}
	filter := bson.M{"pages._id": pageObjID}
	arrayFilters := options.ArrayFilters{
		Filters: []interface{}{bson.M{"page._id": pageObjID}},
	}
	updateOptions := options.UpdateOptions{
		ArrayFilters: &arrayFilters,
	}

	result, err := collection.UpdateOne(context.TODO(), filter, update, &updateOptions)
	if err != nil {
		return "", fmt.Errorf("failed to update: %w", err)
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", result.MatchedCount, result.ModifiedCount)

	// case "block image+text":
	// 	// Ваша логіка для цього типу блока

	// case "block text+link":
	// 	// Ваша логіка для цього типу блока

	// case "block link":
	// 	// Ваша логіка для цього типу блока

	// default:
	// 	return "", fmt.Errorf("services.CreateBlock: error type %q", block.Type)
	// }

	return block.ID.Hex(), nil
}

func (r *Repository) GetBlocks(pageID string) ([]models.DBCreateBlock, error) {
	// Convert the pageID string to a MongoDB ObjectID
	pageObjID, err := primitive.ObjectIDFromHex(pageID)
	if err != nil {
		return nil, fmt.Errorf("invalid page ID: %w", err)
	}

	// Define the collection
	collection := r.db.Collection("tabs")

	// Define the filter to find the specific page by its ID
	filter := bson.M{"pages._id": pageObjID}

	// Define the projection to include only the blocks field from the matched page
	projection := bson.M{"pages.$": 1}

	// Perform the find query with filter and projection
	var result struct {
		Pages []struct {
			Blocks []models.DBCreateBlock `bson:"blocks"`
		} `bson:"pages"`
	}
	err = collection.FindOne(context.TODO(), filter, options.FindOne().SetProjection(projection)).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("no blocks found for page ID: %s", pageID)
		}
		return nil, fmt.Errorf("failed to find blocks: %w", err)
	}

	// Check if the pages array is empty
	if len(result.Pages) == 0 {
		return nil, fmt.Errorf("no blocks found for page ID: %s", pageID)
	}

	// Return the blocks from the first (and only) page in the result
	return result.Pages[0].Blocks, nil
}

func (r *Repository) DeleteBlock(id string) error {
	blockObjID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid block ID: %w", err)
	}

	// Define the collection
	collection := r.db.Collection("tabs")

	// Define the filter to match the block ID in any page's blocks array
	filter := bson.M{
		"pages.blocks._id": blockObjID,
	}

	// Define the update to pull (remove) the block from the blocks array
	update := bson.M{
		"$pull": bson.M{"pages.$[].blocks": bson.M{"_id": blockObjID}},
	}

	// Perform the update operation
	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to delete block: %w", err)
	}

	// Check if a document was modified
	if result.ModifiedCount == 0 {
		return fmt.Errorf("block ID %s not found", id)
	}

	return nil
}

func (r *Repository) EditBlock(block models.DBCreateBlock) error {
	collection := r.db.Collection("tabs")

	// Build the update document dynamically to include only non-empty fields
	updateDoc := bson.M{}

	switch block.Type {
	case "block text":
		if block.Text != "-" {
			updateDoc["pages.$[page].blocks.$[block].text"] = block.Text
		}

	case "block image+text":
		if block.Text != "-" {
			updateDoc["pages.$[page].blocks.$[block].text"] = block.Text
		}
		if block.ImageSrc != "-" {
			updateDoc["pages.$[page].blocks.$[block].imageSrc"] = block.ImageSrc
		}

	case "block text+link":
		if block.Text != "-" {
			updateDoc["pages.$[page].blocks.$[block].text"] = block.Text
		}
		if block.Link != "-" {
			updateDoc["pages.$[page].blocks.$[block].link"] = block.Link
		}
		if block.LinkText != "-" {
			updateDoc["pages.$[page].blocks.$[block].linkText"] = block.LinkText
		}

	case "block link":
		if block.Link != "-" {
			updateDoc["pages.$[page].blocks.$[block].link"] = block.Link
		}
		if block.LinkText != "-" {
			updateDoc["pages.$[page].blocks.$[block].linkText"] = block.LinkText
		}

	default:
		return fmt.Errorf("services.EditBlock: error type %q", block.Type)
	}
	// Define the update operation
	update := bson.M{
		"$set": updateDoc,
	}

	// Create the filter to find the specific block by its ID within the pages array
	filter := bson.M{"pages.blocks._id": block.ID}

	// Define array filters to correctly identify the page and block
	arrayFilters := options.ArrayFilters{
		Filters: []interface{}{
			bson.M{"page.blocks._id": block.ID},
			bson.M{"block._id": block.ID},
		},
	}

	updateOptions := options.UpdateOptions{
		ArrayFilters: &arrayFilters,
	}

	// Execute the update operation
	result, err := collection.UpdateOne(context.TODO(), filter, update, &updateOptions)
	if err != nil {
		return fmt.Errorf("failed to update: %w", err)
	}

	fmt.Printf("Matched %v documents and updated %v documents.\n", result.MatchedCount, result.ModifiedCount)

	return nil
}
