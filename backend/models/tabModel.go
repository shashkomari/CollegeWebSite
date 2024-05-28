package models

type CreateTab struct {
	Name string `bson:"name"`
}

type DBCreateTab struct {
	Name  string         `bson:"name"`
	Pages []DBCreatePage `bson:"pages"`
}
