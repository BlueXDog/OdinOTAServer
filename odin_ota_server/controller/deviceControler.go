package controller

import (
	"net/http"
	"server/services"
)
//GetUpdateClientInfo used when client send update request
func GetUpdateClientInfo(response http.ResponseWriter, request *http.Request) {
	services.GetUpdateInfo(response, request)
}
//NotifiUpdateClientInfo used when client want to notifi to server
func NotifiUpdateClientInfo(response http.ResponseWriter, request *http.Request) {
	services.NotifiUpdateInfo(response, request)
}
//UploadOS used to upload new os to server
func UploadOS(response http.ResponseWriter, request *http.Request) {
	services.UploadOS(response,request)
}

