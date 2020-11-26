package helpers
import (
    "github.com/aws/aws-sdk-go/aws/credentials"
    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"net/http"
	log "github.com/sirupsen/logrus"
	"strings"
	"mime/multipart"
	"fmt"
)
type sizer interface {
	Size() int64
}
var myBucket = "odin-ota-staging"
var accessKey = "AKIAQGDLP4T5REQ3BBVD"
var accessSecret = "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"
var awsConfig *aws.Config
var cdn = "https://cdnotastaging.xor.support/"
func init(){
	awsConfig = &aws.Config{
		Region:      aws.String("ap-southeast-1"),
		Credentials: credentials.NewStaticCredentials(accessKey, accessSecret, ""),
	}
}

func createSign(file multipart.File) string {
	
	return "12345678"
}

//UploadS3 used to upload file to S3 
func UploadS3(response http.ResponseWriter, request *http.Request) (string,error) {
	request.ParseForm()
	file,multipartfileHeader,err :=request.FormFile("file")
	if err != nil {
		log.Error("errror parsing file :",err)
	}
	log.Info(multipartfileHeader.Filename)
	log.Info(file.(sizer).Size())
	fileName := multipartfileHeader.Filename
	fileNameInfo := strings.Split(fileName,"_")
	log.Info("firware :",fileNameInfo[0]," location :",fileNameInfo[1]," version :",fileNameInfo[2])
	firmware := fileNameInfo[0]
	location := fileNameInfo[1]
	version := fileNameInfo[2]
	sign := createSign(file)
	myKey := fmt.Sprintf("odin/%s/%s_%s/%s",firmware,location,version,sign)
	sess := session.Must(session.NewSession(awsConfig))
	 // Create an uploader with the session and custom options
	 uploader := s3manager.NewUploader(sess, func(u *s3manager.Uploader) {
        u.PartSize = 5 * 1024 * 1024 // The minimum/default allowed part size is 5MB
        u.Concurrency = 2            // default is 5
    })
	
	// Upload the file to S3.
    result, err := uploader.Upload(&s3manager.UploadInput{
        Bucket: aws.String(myBucket),
        Key:    aws.String(myKey),
        Body:   file,
    })
    //in case it fails to upload
    if err != nil {
		log.Error("failed to upload file :", err)
		return "",err
    }
	log.Error("file uploaded to :\n", result.Location)
	
	url := cdn + myKey
	return url ,nil
}
