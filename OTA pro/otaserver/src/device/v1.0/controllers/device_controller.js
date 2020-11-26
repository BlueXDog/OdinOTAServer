var device = require("../service/device_service");
var parse = require("../../utils/parsereq");

/* GET users listing. */
module.exports.getUpdateInfo = function (req, res, next) {
  try {
    // parse param
    let imei = parse.query(req, "IMEI");
    let OSVersion = parse.query(req, "OSVersion");
    let SBLVersion = parse.query(req, "SBLVersion");
    let STMVersion = parse.query(req, "STMVersion");
    let dataVersion = parse.query(req, "dataVersion");
    let textVersion = parse.query(req, "textVersion");
    // let HWVersion = parse.query(req, "HWVersion");

    device.getUpdateInfo(
      req,
      res,
      next,
      imei,
      OSVersion,
      SBLVersion,
      STMVersion,
      dataVersion,
      textVersion
    );
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

module.exports.notiUpdateInfo = function (req, res, next) {
  try {
    // parse param
    let imei = parse.query(req, "IMEI");
    let OSVersion = parse.query(req, "OSVersion");
    let SBLVersion = parse.query(req, "SBLVersion");
    let STMVersion = parse.query(req, "STMVersion");
    let dataVersion = parse.query(req, "dataVersion");
    let textVersion = parse.query(req, "textVersion");

    device.notiUpdateInfo(
      req,
      res,
      next,
      imei,
      OSVersion,
      SBLVersion,
      STMVersion,
      dataVersion,
      textVersion
    );
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};
