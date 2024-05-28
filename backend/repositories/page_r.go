package repositories

import (
	"context"
	"fmt"

	"github.com/shashkomari/CollegeWebSite.git/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

// matchStage := bson.D{{"$match",
// 	bson.D{{"pages._id", pageObjID}}}}
// unwindStage := bson.D{{"$unwind", "$pages"}}
// matchStage2 := bson.D{{"$match",
// 	bson.D{{"pages._id", pageObjID}}}}

// cursor, err := collection.Aggregate(context.TODO(), mongo.Pipeline{matchStage, unwindStage, matchStage2})
// if err != nil {
// 	return "", fmt.Errorf("failed to aggregate filter pipeline: %w", err)
// }

// var pages []bson.M
// if err = cursor.All(context.TODO(), &pages); err != nil {
// 	return "", fmt.Errorf("failed to run cursor.All: %w", err)
// }

// for i, page := range pages {
// 	fmt.Println(i, page)
// }

// filter := bson.M{"pages": bson.M{"$elemMatch": bson.M{"_id": pageObjID}}}
// result := collection.FindOne(context.TODO(), filter)

// var ret interface{}
// if err := result.Decode(&ret); err != nil {
// 	log.Println("Error: ", err.Error())
// } else {
// 	log.Println("Res: ", ret)
// }
// _, err = collection.UpdateOne(
// 	context.TODO(),
// 	bson.M{"_id": pageObjID},
// 	bson.M{"$push": bson.M{"pages.$.blocks": block}},
// )
// if err != nil {
// 	return "", fmt.Errorf("failed to create block: %w", err)
// }
// // result, err = collection.InsertOne(context.Background(), bson.M{"type": block.Type, "text": block.Text, "page_id": block.PageId})

//Зміни код так щоб він у колекції tabs шукав по масиву pages page яка б мала потрібний url і повертав її _id

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

	// collection := r.db.Collection("pages")

	// var result struct {
	// 	Id string `bson:"_id"`
	// }

	// err := collection.FindOne(context.Background(), bson.M{"url": url}).Decode(&result)
	// if err != nil {
	// 	return "", fmt.Errorf("failed to get page by url: %w", err)
	// }

	// return result.Id, nil
}
