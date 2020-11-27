package routers

import (
	mux "github.com/gorilla/mux"
	"server/middlewares"
	"server/controller"
)
//InitRouter return router 
func InitRouter() *mux.Router {
	router := mux.NewRouter()
	router.Use(middlewares.LogRecord)
	subrouter := router.PathPrefix("/device/{version}").Subrouter()
	subrouter.Use(middlewares.AuthenMiddleware)
	subrouter.HandleFunc("/update/info", controller.GetUpdateClientInfo)
	subrouter.HandleFunc("/update/noti", controller.NotifiUpdateClientInfo)

	

	return router
}
