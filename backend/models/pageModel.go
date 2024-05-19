package models

type CreatePageData struct {
	Name    string `bson:"name"`
	TabName string `bson:"tabName"`
}

type DeletePageData struct {
	Id string `bson:"id"`
}

type GetPageIdByUrl struct {
	URL string `bson:"url"`
}
