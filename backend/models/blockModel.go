package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CreateBlock struct {
	Type     string `bson:"type"`
	Text     string `bson:"text,omitempty"`
	Link     string `bson:"link,omitempty"`
	LinkText string `bson:"linkText,omitempty"`
	PageId   string `bson:"pageId"`
}

type DBCreateBlock struct {
	ID       primitive.ObjectID `bson:"_id"`
	Type     string             `bson:"type"`
	Text     string             `bson:"text,omitempty"`
	Link     string             `bson:"link,omitempty"`
	LinkText string             `bson:"linkText,omitempty"`
}
