package main

import (
	"database/sql"
	"fmt"
	"path/filepath"

	"github.com/shashkomari/CollegeWebSite.git/backend/handlers"
	"github.com/shashkomari/CollegeWebSite.git/backend/repositories"
	"github.com/shashkomari/CollegeWebSite.git/backend/services"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	db, err := ConnectToDB()
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	r := gin.Default()

	// Задаємо абсолютний шлях до каталогу templates
	templatesPath, _ := filepath.Abs("frontend/HTML")
	r.LoadHTMLGlob(templatesPath + "/*")

	accountRepository := repositories.NewAccountRepository(db)
	accountServices := services.NewAccountService(accountRepository)
	accountHandlers := handlers.NewAccountHttp(accountServices)

	r.POST("/api/sign_in", accountHandlers.SignIn)

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "main_page.html", gin.H{})
	})

	// Serve HTML page
	r.GET("/sign_in", func(c *gin.Context) {
		c.HTML(200, "sign_in_page.html", gin.H{})
	})

	r.GET("/main_page_admin", func(c *gin.Context) {
		c.HTML(200, "main_page_admin.html", gin.H{})
	})

	// Serve static files (CSS, JS)
	r.Static("/static", "./frontend")

	port := 8080
	fmt.Printf("Server is running on http://localhost:%d\n", port)
	r.Run(fmt.Sprintf(":%d", port))
}

func ConnectToDB() (*sql.DB, error) {
	// Replace these values with your PostgreSQL database connection details
	dbHost := "localhost"
	dbPort := "5432"
	dbUser := "postgres"
	dbPassword := "postgres"
	dbName := "college_web_site_db"

	// Construct the connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", dbHost, dbPort, dbUser, dbPassword, dbName)

	// Open a connection to the PostgreSQL database
	return sql.Open("postgres", connStr)
}

// package main

// import (
// 	"database/sql"
// 	"net/http"

// 	"github.com/gin-gonic/gin"

// 	"projects/CollegeWebSite/backend/handlers"
// 	"projects/CollegeWebSite/backend/repositories"
// 	"projects/CollegeWebSite/backend/services"

// 	_ "github.com/go-sql-driver/mysql"
// )

// func main() {
// 	r := gin.Default()
// 	r.LoadHTMLGlob("HTML/*")
// 	r.Static("/css", "./frontend/CSS/")

// 	db, err := sql.Open("mysql", "root:root@tcp(127.0.0.1:3306)/CourseWork")
// 	if err != nil {
// 		panic(err.Error())
// 	}

// 	accountRepository := repositories.NewAccountRepository(db)
// 	accountServices := services.NewAccountService(accountRepository)
// 	accountHandlers := handlers.NewAccountHttp(accountServices)

// 	r.GET("/", accountHandlers.GetAccounts)

// 	r.GET("/", func(c *gin.Context) {
// 		c.HTML(http.StatusOK, "main_page.html", gin.H{})
// 	})

// 	r.Run()
// }
