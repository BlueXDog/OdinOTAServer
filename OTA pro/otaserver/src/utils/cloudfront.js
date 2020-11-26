const AWS = require("aws-sdk");
const url = require("url");
const config = require("./config");

const signer = new AWS.CloudFront.Signer(
  config.cf.ACCESS_KEY_ID,
  config.cf.PRIVATE_KEY
);
const expireTime = config.cf.EXPIRE_TIME * 60 * 60 * 1000;

function signUrl(file_path, expireTime) {
  let file_url = url.resolve(config.cf.BASE_URL, file_path);

  return signer.getSignedUrl({
    url: file_url,
    expires: Math.floor((Date.now() + expireTime) / 1000),
  });
}

module.exports.getFileUrl = function (path) {
  return signUrl(path, expireTime);
};
