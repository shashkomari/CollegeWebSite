package models

type BlockData struct {
	Type   string `bson:"type"`
	Text   string `bson:"text"`
	PageId string `bson:"pageId"`
}
