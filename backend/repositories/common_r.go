package repositories

import "go.mongodb.org/mongo-driver/mongo"

func NewRepository(client *mongo.Client) *Repository {
	dbName := "college_web_site_db"
	db := client.Database(dbName)
	return &Repository{
		db: db,
	}
}

type Repository struct {
	db *mongo.Database
}
