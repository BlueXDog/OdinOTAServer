package dataprovider

import(
	sql "database/sql"
	_ "github.com/lib/pq"
	log "github.com/sirupsen/logrus"
	"time"
	"server/helpers"
	"fmt"
)
var db *sql.DB
//VersionInfo define struct version
type VersionInfo struct {
	Production string
	ProductionID int
	Region string
	OSLastestVersion string
	UpdatePermission int  
}
func init(){
	var err error
	host, err := helpers.ConfigGet("postgres","host")
	port, err := helpers.ConfigGet("postgres","port")
	username, err := helpers.ConfigGet("postgres","username")
	dbname, err := helpers.ConfigGet("postgres","dbname")
	password, err := helpers.ConfigGet("postgres","password")
	if err != nil {
		log.Error("get postgres info err",err)
	}

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",host, port, username, password, dbname)
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Error(err)
	}
}

//GetUpdateVersion used to get update version 
func GetUpdateVersion(IMEI string) (VersionInfo,error) {
	rows, err := db.Query(`SELECT productions.name as production,productions.id as productionid, regions.name as region,
	productions.os_latest_version as latest_version, 
	odins.update_permission as permission 
	FROM public.odin_devices as odins 
	JOIN public.odin_productions as productions 
	ON odins.production_id=productions.id 
	JOIN public.odin_regions as regions 
	ON productions.region_id=regions.id  
	WHERE odins.imei=$1`,IMEI)
	if err != nil {
		log.Error(err)
	}
	defer rows.Close()
	var (
		production string
		productionid int 
		region string
		osVersion string
		updatePermission int  
	)
	if rows.Next() {
		if err := rows.Scan(&production,&productionid,&region,&osVersion,&updatePermission); err != nil {
			log.Error(err)
			return VersionInfo{}, err
		}
	}
	version := VersionInfo{production,productionid,region,osVersion,updatePermission}
	return version,nil
}
//UpdateDeviceChecking used to update data to server
func UpdateDeviceChecking(IMEI string) error {
	_,err := db.Query(`UPDATE public.odin_devices 
	SET last_checking_time = $2 
	WHERE imei = $1;`,IMEI,time.Now())
	if err != nil {
		return err
	}
	return nil
}
// UpdateDeviceInfo used to update info to database
func UpdateDeviceInfo( imei string, osversion string) error {
	_,err := db.Query(`UPDATE public.odin_devices 
    SET os_version = $2,last_update_time = $3
	WHERE imei = $1;`,imei,osversion,time.Now())
	return err 
}
//GetUserKey get all the device info from database.
func GetUserKey( imei string) (string ,error) {	
	rows, err := db.Query("SELECT user_key FROM public.odin_devices WHERE imei = $1",imei)
	if err != nil {
		log.Error(err)
	}
	defer rows.Close()
	var userkey string
	if rows.Next() {
		if err := rows.Scan(&userkey); err != nil {
			log.Error(err)
			return "", err
		}
	}
	return userkey,nil
}
//GetOSURL get the url of the osversion in database
func GetOSURL(versioninfoID int) (string , error){
	var URL string 
	rows, err := db.Query("SELECT url FROM odin_versions WHERE odin_versions.id = $1",versioninfoID)
	if err != nil {
		log.Error(err)
	}
	defer rows.Close()
	if rows.Next() {
		if err := rows.Scan(&URL); err != nil {
			log.Error(err)
			return "", err
		}
	}
	return URL,nil
}
// GetVersionArray get list of all current OS version on a production
func GetVersionArray(ProductionID int) []int {
	var OSVersionArray []int
	var osVersion 
	rows, err
}
