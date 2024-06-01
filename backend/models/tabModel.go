package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CreateTab struct {
	Name string `bson:"name"`
}

type GetTabs struct {
	ID   primitive.ObjectID `bson:"_id"`
	Name string             `bson:"name"`
	Url  string             `bson:"url"`
}

type DBCreateTab struct {
	Name  string         `bson:"name"`
	Pages []DBCreatePage `bson:"pages"`
}

type GetTabsFromDB struct {
	ID    primitive.ObjectID `bson:"_id"`
	Name  string             `bson:"name"`
	Url   string             `bson:"url"`
	Pages []DBCreatePage     `bson:"pages"`
}
