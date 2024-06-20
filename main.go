package main

import (
	"context"
	"os"

	//"database/sql"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"github.com/shashkomari/CollegeWebSite.git/backend/handlers"
	"github.com/shashkomari/CollegeWebSite.git/backend/repositories"
	"github.com/shashkomari/CollegeWebSite.git/backend/services"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	conn, err := ConnectToDB()
	if err != nil {
		panic(err.Error())
	}
	defer conn.Disconnect(context.TODO())

	r := gin.Default()

	// Задаємо абсолютний шлях до каталогу templates
	templatesPath, _ := filepath.Abs("frontend/HTML")
	r.LoadHTMLGlob(templatesPath + "/*")

	repository := repositories.NewRepository(conn)
	service := services.NewService(repository)
	handler := handlers.NewHttpHandler(service)

	//r.GET("/api/pages", handler.GetPages)
	r.GET("/api/page", handler.GetPageIdByUrl)
	r.POST("/api/page", handler.CreatePage)
	r.DELETE("/api/page", handler.DeletePage)
	r.PUT("/api/page", handler.EditPage)

	r.GET("/api/tabs", handler.GetTabs)
	r.POST("/api/tab", handler.CreateTab)
	r.DELETE("/api/tab", handler.DeleteTab)
	r.PUT("/api/tab", handler.EditTab)

	r.GET("/api/blocks", handler.GetBlocks)
	r.POST("/api/block", handler.CreateBlock)
	r.DELETE("/api/block", handler.DeleteBlock)
	r.PUT("/api/block", handler.EditBlock)
	r.POST("/api/uploadImage", handler.UploadImage)

	r.POST("/api/sign_in", handler.SignIn)

	r.GET("/", func(c *gin.Context) {
		tokenString := c.Query("token")
		if tokenString == "" {
			c.HTML(200, "main_page.html", gin.H{})
			return
		}

		err := verifyTokenExpiration(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error StatusUnauthorized": err.Error()})

			return
		}

		c.HTML(http.StatusOK, "main_page_admin.html", gin.H{})
	})

	r.GET("/tmpl", func(c *gin.Context) {
		tokenString := c.Query("token")
		if tokenString == "" {
			c.HTML(200, "empty_page.html", gin.H{})
			return
		}

		err := verifyTokenExpiration(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error StatusUnauthorized": err.Error()})

			return
		}

		c.HTML(http.StatusOK, "admin_page.html", gin.H{})
	})

	// Serve HTML page
	r.GET("/sign_in", func(c *gin.Context) {
		c.HTML(200, "sign_in_page.html", gin.H{})
	})

	// /////////////////////////
	// type Data struct {
	// 	Message string
	// }

	// tmpl := template.Must(template.ParseFiles("frontend/HTML/test_template.html"))
	// r.GET("/tmpl", func(c *gin.Context) {
	// 	c.HTML(200, "test_template.html", gin.H{})
	// 	data := Data{Message: "Lalala"}
	// 	err := tmpl.Execute(c.Writer, data)
	// 	if err != nil {
	// 		log.Println(err)
	// 	}
	// })

	//////////////////////////
	// Serve static files (CSS, JS)
	r.Static("/static", "./frontend")

	port := 8080
	fmt.Printf("Server is running on http://localhost:%d\n", port)
	r.Run(fmt.Sprintf(":%d", port))

}

func ConnectToDB() (*mongo.Client, error) {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return nil, fmt.Errorf("MONGODB_URI environment variable is not set")
	}

	clientOptions := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	return client, nil
}

func verifyTokenExpiration(tokenString string) error {
	// Парсимо токен
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Здійснюємо перевірку, чи підписований метод правильний
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method: %v", token.Header["alg"])
		}
		// Повертаємо ключ для перевірки підпису
		return []byte("my_secret_key"), nil
	})

	if err != nil {
		return fmt.Errorf("parsing faild: %v", err) // Помилка при парсингу токену
	}

	// Перевіряємо чи токен валідний
	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	// Перевіряємо термін придатності токену
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return fmt.Errorf("invalid token format or token is invalid")
	}

	expirationTime := int64(claims["exp"].(float64))
	currentTime := time.Now().Unix()

	if currentTime > expirationTime {
		return fmt.Errorf("token expiration time has passed")
	}

	return nil
}
