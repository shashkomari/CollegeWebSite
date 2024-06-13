package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CreatePage struct {
	Name  string `bson:"name"`
	TabID string `bson:"tabId"`
}

type DeletePage struct {
	Id string `bson:"id"`
}

type GetPageIdByUrl struct {
	URL string `bson:"url"`
}

type AllPage struct {
	ID   primitive.ObjectID `bson:"_id"`
	Name string             `bson:"name"`
	URL  string             `bson:"url"`
}
type DBCreatePage struct {
	ID     primitive.ObjectID `bson:"_id"`
	Name   string             `bson:"name"`
	URL    string             `bson:"url"`
	Blocks []DBCreateBlock    `bson:"blocks"`
}
