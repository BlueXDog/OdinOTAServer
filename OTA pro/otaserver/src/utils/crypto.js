var crypto = require("crypto");
const { crc32 } = require("crc");

module.exports.hmac = function (key, data, algol, digest) {
  if (typeof digest == "undefined") {
    digest = "hex";
  }
  if (typeof algol == "undefined") {
    algol = "sha256";
  }
  return crypto.createHmac(algol, key).update(data).digest(digest);
};

function convertNumber(num) {
  let buffer = new ArrayBuffer(4);
  let uint32 = new Uint32Array(buffer);
  uint32[0] = num;
  return uint32;
}

module.exports.crc32 = function (data) {
  return convertNumber(crc32(data));
};

module.exports.rsaSign = function (key, data, algol, digest) {
  if (typeof digest == "undefined") {
    digest = "hex";
  }
  if (typeof algol == "undefined") {
    algol = "RSA-SHA256";
  }

  return crypto.createSign(algol).update(data).sign(key, digest);
};
