package services

import (
	"server/helpers"
	"net/http"
	"encoding/json"
	"server/middlewares"
	"server/dataprovider"
	log "github.com/sirupsen/logrus"
	"encoding/pem"
	"crypto/x509"
	"github.com/aws/aws-sdk-go/service/cloudfront/sign"
	"time"
	"crypto/rsa"
	
)
//LinkResponse define response to link
type LinkResponse struct {
	Update string
	Os string
}

func createPrivateKey () *rsa.PrivateKey {
	privKeyString := `-----BEGIN RSA PRIVATE KEY-----
    MIIEpgIBAAKCAQEA4RjARQ1INT2SoA9dk9F+ct0I0AsfwMNqCkjuFIC1SZ/EGGmn
	8n5ly8/NibC7HsT2Z2r0ZQwO2+uaAnjgbJUUZu/MqxoeEzJK2KfhX1QZ09VNWGQx
	oYU8w2Sca6THPbf9r5mMG5wsWvsnreoinVMShotm13mTVsz3mVZRqfEnUb/5YOuH
	zg/grEp0hMTY7dbGszome2STNzMtvnwOIXJ8bwWQJkMyhYLwE9cP1p9SN13Kmn6U
	rbnYHJ11R7ryOie3PRuNon/tZayi2QzXaParETsPa0o9IZjkGEwpWFjXDw+D4qNP
	VUG7gTZLIQHaCpTSnh+LsFFeEANx8O/cR77nDwIDAQABAoIBAQCvg5of/YxJHzqe
	HX0MznP3YkwF1DatGnIrlNQ3Hmi9AJtpobC3z0DWm7CbZTdydYff+bCYvb80Uc/j
	j5cGc3PWE7MV0yaSN0vPBZAgwbXly9MkUfO1CuvnOyMQeAp3IGjprCNoP+0CAAXf
	gMn+vBCc4kONThnJu8ZwRLMmfIf5H+2DzCBzSvRMtOb/4StV1Xtf1nHNJ7pxrxwA
	DbkdCwmNdR52BqYvOosEZZ8sRga35uoSRAtj9vsHcMVFKxvmmOHXMnrY9ogR1wQu
	583iP58zspwjIcuNA+7RyE2CEMWx7RO6BnGzqzX9h11Zg70xu9Y+1LVxLRD5pWMV
	2nfXBRbZAoGBAP3wTpp5nj5zpwRKp/47om0wB4vPjzS7vzg6A7dYo0BQJ7XyDVAk
	av7rEp3cHAllyOmWjK9/PgJ/fSiJ6IT2jEizmETb8ccipL3YRN2EoVCFOAMgQw8U
	RhaIFj0Rr2EmeD3jr1ss+HZ8RkSzIpELbTWizk5QQ3lsZ7r1ZOeSYe/rAoGBAOLs
	gmT/yH0YnZGJmb6kUESBWZn088PNE/mcDAs0VjAUbt5ARKv9XfdYtPUaRfNtzjMu
	8o2gko2q5M+qOil8CEeyWF22wLjaem5PFm8UCHpRFsMQEcMOXPA7Vf5Wz9Dhh0Tr
	FrPJjviZCs1wiXNceuOriIZ43V0QOfolcOg080BtAoGBAP0y2Q1J6rEWnBe5YNws
	Ff6M/1k2cfIAqd+kaQQti0mbIp1WZlPcnBrlxUBFsmbkaHoQtOJgGzJecCs1pvS8
	6I+tE0zFicQnFOB+fdvqXPZufrUPPA4TBvd8ZcAqnBZgR1BecACXTH7H10C05Oh+
	3ju2w8JuYXj20E8oU55a5PBVAoGBAJMPg1HBEkU/9p2i9yg9hGdhDJhhzrhN52wU
	XRnFyTVPiKowLFDp2kO6EUvmwv6HYuJ4wmhWb6Ov5KlQQHEyGIueYPYawbsKm91x
	E7DY4sWiV4YCnAA1BrYJPimeSP+tqORZFlVdgnJJfF63V9yTSnDRcaD0I0F0ip46
	NXnHFv3hAoGBAJI5XeQM4RLoW48EY5KLtsWrnHqO1sBvvAUXhFakeYChxDgrTDMI
	5vXxM7OXwpFQVNgRHefR3u5YYXrpkxuUfnDHFGFMnarCL/MtIgziMDxIPXI4RVpv
	iT7Jytf0V0JUZ4nlKayhXiuQab1V9fjmmHOhPLIBbu5sazNJN2G9tYjH
-----END RSA PRIVATE KEY-----`


	block, _ := pem.Decode([]byte(privKeyString))
    parseResult, _ := x509.ParsePKCS1PrivateKey(block.Bytes)
	return parseResult
}

// GetUpdateInfo is main function used to get info from phone and send back download link 
func GetUpdateInfo(response http.ResponseWriter, request *http.Request){
	var version dataprovider.VersionInfo
	version,err := dataprovider.GetUpdateVersion(middlewares.Autheninfo.IMEI)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
	}

	//update last checking time to database
	err = dataprovider.UpdateDeviceChecking(middlewares.Autheninfo.IMEI)
	if err != nil {
		log.Info(" Update device checking error")
		log.Error(err)
		response.WriteHeader(http.StatusBadRequest)
	}
	if version.UpdatePermission != 1 {
		response.WriteHeader(http.StatusForbidden)
	}
	// check and return newer version 
	err = checkAndReturnNewVersion(version,middlewares.Autheninfo.OSVersion,response)
	if err != nil {
		log.Error(err)
		response.WriteHeader(http.StatusBadRequest)
	}
}

func getlink (ProductionID int ,OSCurrentVersion string) string {
	keyID, err := helpers.ConfigGet("cdn","keypairID")
	if err != nil {
		log.Error(err)
	}
	//newer osversion id 
	nextOSVersionID := getNextOSVersionID(ProductionID,OSCurrentVersion)
	OSURL ,err := dataprovider.GetOSURL(nextOSVersionID)
	privKey := createPrivateKey()
	signer := sign.NewURLSigner(keyID,privKey)
    signedURL, err := signer.Sign(OSURL, time.Now().Add(1*time.Hour))
	if err != nil {
		log.Error("Failed to sign url, err: \n", err.Error())
	}
	return signedURL
}

func getNextOSVersionID(ProductionID int,OSCurrentVersion string) int {
	var OSVersionID int
	OSVersionArray := dataprovider.GetVersionArray(ProductionID)
	
	return OSVersionID
}
func checkAndReturnNewVersion( version dataprovider.VersionInfo , OSVersion string , response http.ResponseWriter) error {
	// check if have a newer version 
	if version.OSLastestVersion != OSVersion {
		//return the newer OSversion
		
		signedURL := getlink(version.ProductionID,OSVersion)
		response.Header().Set("Content-Type", "application/json")
		responseLink := LinkResponse{Update: "yes",
					Os:signedURL}
		json.NewEncoder(response).Encode(responseLink)	
	} else {
		response.Header().Set("Content-Type", "application/json")
		responseLink := LinkResponse{Update: "no",
					Os:""}
		json.NewEncoder(response).Encode(responseLink)	
	}
	return nil
}

//NotifiUpdateInfo used to receive request from client
func NotifiUpdateInfo(response http.ResponseWriter, request *http.Request) {
	log.Info("this is signKey : ",middlewares.Autheninfo.SignKey)
	err := dataprovider.UpdateDeviceInfo(middlewares.Autheninfo.IMEI,middlewares.Autheninfo.OSVersion)
	if err != nil {
		log.Error(err)
		response.WriteHeader(http.StatusBadRequest)
	}
	response.WriteHeader(http.StatusOK)
}
