package main

import (
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./frontend/HTML/main_page.html")
	})
	http.ListenAndServe(":8080", nil)
}
