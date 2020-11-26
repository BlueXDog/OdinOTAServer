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

module.exports.devAuth = async function (req, res, next) {
  try {
    // check param exist
    let name = parse.query(req, "user");
    let requestID = parse.query(req, "requestID");
    let signKeyReq = parse.query(req, "signKey");

    await checkRequestID(signKeyReq);

    // Check correct signKey
    // get key from database
    let dev = await pg.getDev(name);

    let signKey = crypto.hmac(dev.key, name + requestID);
    if (signKey != signKeyReq) {
      console.log(signKey);
      throw new Error("signKey is not match");
    }

    res.dev = dev;

    await redis.addToken(signKeyReq);

    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(403);
  }
};
