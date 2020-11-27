package main

import (
	"net/http"
	"time"
	"server/helpers"
	log "github.com/sirupsen/logrus"
	"server/routers"
)


func main() {
	serverAddr, err := helpers.ConfigGet("Defaults", "serverAddr")
	if err != nil {
		log.Error("get serverAddr error \n set server to default")
		serverAddr = "0.0.0.0:3000"
	}

	router := routers.InitRouter()
	srv := &http.Server{
		Handler: router,
		Addr:    serverAddr,
		//enforce timeouts for servers
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Info("Start server at : ",serverAddr)
	log.Fatal(srv.ListenAndServe())
}
