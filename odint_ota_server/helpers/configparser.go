package helpers

import (
	cf "github.com/bigkevmcd/go-configparser"
	log "github.com/sirupsen/logrus"
)
var config *cf.ConfigParser
func init() {
	var err error
	config, err = cf.NewConfigParserFromFile("config.cfg")
	if err != nil {
		log.Error("parse config file error")
	}
}
//ConfigGet get value due to block and name in configfile
func ConfigGet(block string, name string) (string,error) {
	value, err := config.Get(block,name)
	return value, err
}
