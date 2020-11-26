var crypto = require("../../utils/crypto");
var parse = require("../../utils/parsereq");
var pg = require("../dataprovider/postgresql");
var redis = require("../dataprovider/redis");

async function checkRequestID(token) {
  let exist = await redis.checkToken(token).catch((err) => {
    throw err;
  });
  if (exist) {
    throw new Error("Invalid requestID");
  }
}

module.exports.deviceAuth = async function (req, res, next) {
  try {
    // check param exist
    let imei = parse.query(req, "IMEI");
    let requestID = parse.query(req, "requestID");
    let signKeyReq = parse.query(req, "signKey");

    await checkRequestID(signKeyReq);

    // Check correct signKey
    // get key from database
    let device = await pg.getDevice(imei);
    let key = device.user_key;

    let signKey = crypto.hmac(key, imei + requestID);
    if (signKey != signKeyReq) {
      throw new Error("signKey is not match");
    }

    res.device = device;

    await redis.addToken(signKeyReq);

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};
