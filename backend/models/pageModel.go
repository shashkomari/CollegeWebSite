package models

type CreatePageData struct {
	Name    string `bson:"name"`
	TabName string `bson:"tab_name"`
}

type DeletePageData struct {
	Name string `bson:"name"`
}

type ReturnPageData struct {
	URL string `bson:"usl"`
}
