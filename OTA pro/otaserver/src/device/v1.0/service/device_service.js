var pg = require("../dataprovider/postgresql");
var s3 = require("../../utils/s3");
var cf = require("../../utils/cloudfront");
const mattermost = require("../../utils/mattermost");

function getFolderInfo(path) {
  return s3.getFolderInfo(path);
}

function genUpdateInfo(values, versions) {
  const firmware_names = ["OS", "SBL", "STM", "DATA", "TEXT"];
  var update = false;
  var result = "";

  for (let index = 0; index < values.length; index++) {
    const firmware = values[index];
    if (firmware != undefined && firmware.length > 0) {
      if (update == false) {
        update = true;
        result += "UPDATE:update=yes\r\n";
      }

      result +=
        firmware_names[index] +
        ":numfile=" +
        firmware.length.toString().padStart(2, "0") +
        ";version=" +
        versions[index] +
        "\r\n";
    }
  }

  if (update == false) {
    return "UPDATE:update=no\r\n";
  }
  values.forEach((firmware) => {
    if (firmware != undefined) {
      firmware.forEach((element) => {
        var firm = s3.parseFilePath(element.Key);

        result +=
          firm.file_name +
          ":url=" +
          cf.getFileUrl(element.Key) +
          ";block=" +
          firm.block +
          ";length=" +
          firm.length +
          ";sign=" +
          firm.sign +
          "\r\n";
      });
    }
  });

  return result;
}

module.exports.getUpdateInfo = async function (
  req,
  res,
  next,
  imei,
  OSVersion,
  SBLVersion,
  STMVersion,
  dataVersion,
  textVersion
) {
  try {
    //get version of all firmware from region id
    let versions = await pg.getUpdateVersion(imei);
    pg.updateDeviceChecking(imei);

    // check update permission
    if (versions.permission != 1) {
      let result = genUpdateInfo([], []);

      mattermost.deviceGetUpdateInfo(
        imei,
        "Thiết bị không có quyền cập nhật :cold_sweat:"
      );
      res.send(result);
      return;
    }

    // check if have new version
    var os_promise, sbl_promise, stm_promise, data_promise, text_promise;
    if (
      OSVersion != versions.os &&
      SBLVersion != versions.sbl &&
      versions.os == versions.sbl
    ) {
      os_promise = getFolderInfo(
        s3.createFolderPath(
          "OS",
          versions.production,
          versions.os,
          versions.region
        ) + "/"
      );
      sbl_promise = getFolderInfo(
        s3.createFolderPath(
          "SBL",
          versions.production,
          versions.sbl,
          versions.region
        ) + "/"
      );
    }
    if (STMVersion != versions.stm) {
      stm_promise = getFolderInfo(
        s3.createFolderPath(
          "STM",
          versions.production,
          versions.stm,
          versions.region
        ) + "/"
      );
    }

    if (dataVersion != versions.data) {
      data_promise = getFolderInfo(
        s3.createFolderPath(
          "DATA",
          versions.production,
          versions.data,
          versions.region
        ) + "/"
      );
    }

    if (textVersion != versions.text) {
      text_promise = getFolderInfo(
        s3.createFolderPath(
          "TEXT",
          versions.production,
          versions.text,
          versions.region
        ) + "/"
      );
    }
    
    await Promise.all([
      os_promise,
      sbl_promise,
      stm_promise,
      data_promise,
      text_promise,
    ]).then(function (values) {
      let result = genUpdateInfo(values, [
        versions.os,
        versions.sbl,
        versions.stm,
        versions.data,
        versions.text,
      ]);

      res.send(result);
    });
  } catch (e) {
    console.log(e);
    mattermost.deviceGetUpdateInfo(
      imei,
      `:interrobang: :warning: Thất bại: ${e}`
    );
    res.sendStatus(500);
  }
};

module.exports.notiUpdateInfo = async function (
  req,
  res,
  next,
  imei,
  OSVersion,
  SBLVersion,
  STMVersion,
  dataVersion,
  textVersion
) {
  try {
    await pg.updateDeviceInfo(
      imei,
      OSVersion,
      SBLVersion,
      STMVersion,
      dataVersion,
      textVersion
    );
    pg.getProduction(res.device.production_id).then((product) => {
      mattermost.deviceNotiUpdateInfo(imei, product.name, product.region);
    });
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
