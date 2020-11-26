package middlewares

import (
	"crypto/sha256"
	"strings"
	log "github.com/sirupsen/logrus"
	"net/http"
	"encoding/json"
	"crypto/hmac"
	"server/dataprovider"
	"errors"
	"encoding/hex"
)
//AuthenInfo used to store device info
type AuthenInfo struct {
	IMEI string
	RequestID string
	SignKey string
	OSVersion string
	HWVersion string
}
//Autheninfo used to stored info client sended
var Autheninfo AuthenInfo
// ValidMac reports whether messageMAC is a valid hmac
func ValidMac(message string, messageMAC string ,key string) bool {
	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(message))
	expectedMAC := mac.Sum(nil)
	hmacEncode := hex.EncodeToString(expectedMAC)
	if strings.Compare(hmacEncode,messageMAC) ==0 {
		return true
	}
	return false
}
func authenMiddleware(response http.ResponseWriter, request *http.Request) error {
	HostName := request.URL.Path
	parseErr := errors.New("parse parameter error")
	if strings.Contains(HostName,"noti") {
		err := json.NewDecoder(request.Body).Decode(&Autheninfo)
		if err != nil {
			response.WriteHeader(http.StatusBadRequest)
		}
	}else if strings.Contains(HostName,"info"){
		IMEI,ok := request.URL.Query()["IMEI"]
		if !ok || len(IMEI[0]) < 1 {
			log.Info("Query IMEI error")
			return parseErr
		}

		RequestID,ok := request.URL.Query()["RequestID"]
		if !ok || len(RequestID[0]) < 1 {
			log.Info("Query requestid error")
			return parseErr
		}

		SignKey,ok := request.URL.Query()["SignKey"]
		if !ok || len(SignKey[0]) < 1 {
			log.Info("Query signkey error")
			return parseErr
		}

		OSVersion,ok := request.URL.Query()["OSVersion"]
		if !ok || len(SignKey[0]) < 1 {
			log.Info("Query osversion error")
			return parseErr
		}

		HWVersion,ok := request.URL.Query()["SignKey"]
		if !ok || len(SignKey[0]) < 1 {
			log.Info("Query hwversion error")
			return parseErr
		}
		Autheninfo = AuthenInfo { IMEI[0],RequestID[0],SignKey[0],OSVersion[0],HWVersion[0] }
	}	
	//check redis if signkey have existed 
	exist, err := dataprovider.CheckRequestSignKey(Autheninfo.SignKey)
	if err != nil {
		return err
	}

	if exist { // if signkey existed 
		return errors.New("signkey existed ")
	}
	//get device info from database 
	userkey ,err := dataprovider.GetUserKey(Autheninfo.IMEI)
	if err != nil {
		return err 
	}

	valid := ValidMac(Autheninfo.IMEI + Autheninfo.RequestID, Autheninfo.SignKey, userkey)
	if valid != true {
			return errors.New("invalid signkey") 
	}
	// save key to redis
	err = dataprovider.AddRequestSignKey(Autheninfo.SignKey)
	if err != nil {
		return err
	}
	return nil 
}
//AuthenMiddleware used to authen
func AuthenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := authenMiddleware(w, r)
		if err != nil  {
			if err.Error() == "invalid signkey" || err.Error() == "signkey existed " {
				w.WriteHeader(http.StatusForbidden)
			} else {
				w.WriteHeader(http.StatusBadRequest)
			}
			return 
		}
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
//AuthenMiddlewareDev is authen for developer 
func AuthenMiddlewareDev(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Info("this is authen midddleware for developer")
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
// CreatSign used to create crc32 signkey for file 

