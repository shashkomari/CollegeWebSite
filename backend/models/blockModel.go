package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type CreateBlock struct {
	Type     string `form:"type" bson:"type" binding:"required"`
	Text     string `form:"text" bson:"text,omitempty"`
	Link     string `form:"link" bson:"link,omitempty"`
	LinkText string `form:"linkText" bson:"linkText,omitempty"`
	PageId   string `form:"pageId" bson:"pageId" binding:"required"`
	Image    string `form:"image" bson:"image"`
}
type DBCreateBlock struct {
	ID       primitive.ObjectID `bson:"_id"`
	Type     string             `bson:"type"`
	Text     string             `bson:"text,omitempty"`
	Link     string             `bson:"link,omitempty"`
	LinkText string             `bson:"linkText,omitempty"`
	ImageSrc string             `bson:"imageSrc,omitempty"`
}
