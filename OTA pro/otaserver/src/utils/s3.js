const AWS = require("aws-sdk");
const path = require("path");
const config = require("./config");

var s3bucket = new AWS.S3({
  accessKeyId: config.aws.IAM_USER_KEY,
  secretAccessKey: config.aws.IAM_USER_SECRET,
  Bucket: config.aws.BUCKET_NAME,
});

function createFolderPath(type, production, version, region) {
  return path.join(production, type, region, version);
}
module.exports.createFolderPath = createFolderPath;

module.exports.createFilePath = function (
  type,
  production,
  region,
  version,
  file_name,
  block,
  length,
  sign_firm
) {
  return path.join(
    createFolderPath(type, production, version, region),
    file_name + "_" + block + "_" + length + "_" + sign_firm
  );
};

module.exports.parseFilePath = function (file_path) {
  var result = {};
  var splits = file_path.split(path.sep);
  var splits_name = splits[4].split("_");

  if (splits.length != 5 || splits_name.length != 4) {
    throw new Error("Can't get firmware info");
  }

  result.production = splits[0];
  result.region = splits[1];
  result.type = splits[2];
  result.version = splits[3];
  result.file_name = splits_name[0];
  result.block = splits_name[1];
  result.length = splits_name[2];
  result.sign = splits_name[3];

  return result;
};

module.exports.createChangeLogPath = function (production, region, name) {
  return path.join(production, "CHANGELOG", region, name);
};

module.exports.parseChangeLogPath = function (file_path) {
  var result = {};
  var splits = file_path.split(path.sep);
  var splits_name = splits[3].split("_");

  if (splits.length != 4 || splits_name.length != 2) {
    throw new Error("Can't get changelog info");
  }

  result.production = splits[0];
  result.region = splits[2];
  result.type = splits_name[0];
  result.version = splits_name[1];

  return result;
};

module.exports.uploadFile = async function (file, path) {
  return new Promise((resolve, reject) => {
    s3bucket.createBucket(function () {
      var params = {
        Bucket: config.aws.BUCKET_NAME,
        Key: path,
        Body: file,
      };

      s3bucket.upload(params, function (err, data) {
        if (err) {
          console.log("error in upload callback");
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  });
};

module.exports.getFolderInfo = function (path) {
  return new Promise((resolve, reject) => {
    var params = {
      Bucket: config.aws.BUCKET_NAME,
      Delimiter: "/",
      Prefix: path,
    };

    s3bucket.listObjects(params, function (err, data) {
      if (err) {
        console.log("error in listObjects callback");
        console.log(err);
        reject(err);
      } else {
        resolve(data.Contents);
      }
    });
  });
};
