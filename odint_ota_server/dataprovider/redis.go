package dataprovider

import (
	log "github.com/sirupsen/logrus"
	"server/helpers"
	"time"
	"strconv"
	redis "github.com/go-redis/redis/v7"
)

var client *redis.Client

func init() {
	redisAddr, err := helpers.ConfigGet("redis", "redisServer")
	if err != nil {
		log.Error("get Redis server address error set server to default")
		redisAddr = "0.0.0.0:6379"
	}
	password, err := helpers.ConfigGet("redis", "Password")
	if err != nil {
		log.Error("get Redis server password error  set password to default")
		password = ""
	}
	db, err := helpers.ConfigGet("redis", "DB")
	if err != nil {
		log.Error("get Redis server password error set password to default")
		db = "0"
	}
	dbname ,err := strconv.Atoi(db)
	if err != nil {
		log.Error(err)
	}

	client = redis.NewClient(&redis.Options{
		Addr:     redisAddr, 
		Password: password,
		DB:       dbname,
	})
	pong, err := client.Ping().Result()
	log.Info(pong, err)
	if err != nil {
		log.Error(err)
	}
}

//CheckRequestSignKey used to check if signkey have existed in redis database
func CheckRequestSignKey(SignKey string) (bool, error) {
	data, err := client.Get(SignKey).Result()
	if err != nil && err == redis.Nil {
		return false, nil
	} else if err != nil && err != redis.Nil {
		return false, nil
	}
	if len(data) < 2 {
		return false, nil
	}
	return true, nil
}

//AddRequestSignKey add signkey to redis
func AddRequestSignKey(SignKey string) error {
	expireTime, _ := time.ParseDuration("24h")
	err := client.Set(SignKey, "OS", expireTime).Err()
	if err != nil {
		return err
	}
	return nil
}
