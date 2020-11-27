package services
import (
	"net/http"
	log "github.com/sirupsen/logrus"
	"strings"
	"server/helpers"
)

//UploadOS used to upload os to server
func UploadOS(response http.ResponseWriter, request *http.Request){
	log.Info("this is UploadOS fucntion")	
	// upload file to S3, return the path to the file 
	path := helpers.UploadS3(response,request)

	// update path to url of OSversion
}
