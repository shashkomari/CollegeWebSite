package main

import (
	"fmt"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Задаємо абсолютний шлях до каталогу templates
	templatesPath, _ := filepath.Abs("frontend/HTML")
	r.LoadHTMLGlob(templatesPath + "/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "main_page.html", gin.H{})
	})

	// Serve HTML page
	r.GET("/sing_in/", func(c *gin.Context) {
		c.HTML(200, "sign_in_page.html", gin.H{})
	})

	// Serve static files (CSS, JS)
	r.Static("/static", "./frontend")

	port := 8080
	fmt.Printf("Server is running on http://localhost:%d\n", port)
	r.Run(fmt.Sprintf(":%d", port))
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

// 	lectureRepository := repositories.NewLectureRepository(db)
// 	lectureServices := services.NewLectureService(lectureRepository)
// 	lectureHandlers := handlers.NewLectureHttp(lectureServices)

// 	r.GET("/", lectureHandlers.GetLectures)

// 	r.GET("/", func(c *gin.Context) {
// 		c.HTML(http.StatusOK, "main_page.html", gin.H{})
// 	})

// 	r.Run()
// }
