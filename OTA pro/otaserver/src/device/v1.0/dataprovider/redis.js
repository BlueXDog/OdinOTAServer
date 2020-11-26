const redis = require("redis");
const config = require("../../utils/config");

const client = redis.createClient({
  port: config.redis.PORT,
  host: config.redis.HOST,
});

client.on("connect", function () {
  console.log("Redis client connected");
});

client.on("error", function (err) {
  console.log("Something went wrong " + err);
});

const expireTime = config.redis.EXPIRE_TIME * 24 * 60 * 60;

module.exports.addToken = function (token) {
  return new Promise((resolve, reject) => {
    client.set(token, "", "EX", expireTime, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports.checkToken = function (token) {
  return new Promise((resolve, reject) => {
    client.get(token, function (err, reply) {
      if (err) {
        reject(err);
      } else {
        if (reply == null) {
          resolve(false);
        }
        resolve(true);
      }
    });
  });
};
