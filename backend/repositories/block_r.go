package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
