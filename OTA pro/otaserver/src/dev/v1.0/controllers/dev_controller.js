const Busboy = require("busboy");
var dev = require("../service/dev_service");
var parse = require("../../utils/parsereq");

module.exports.uploadFirmware = function (req, res, next) {
  var busboy = new Busboy({
    headers: req.headers,
  });
  busboy.on("finish", function () {
    const file = req.files.firmware;

    try {
      let user = parse.query(req, "user");
      let production = parse.query(req, "production");
      if (file.mimetype == "application/zip") {
        console.log("Extract zip file");
        dev.uploadFirmwareZip(req, res, next, user, production, file);
      } else {
        dev.uploadFirmware(req, res, next, user, production, file);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  });

  req.pipe(busboy);
};

module.exports.getProductionList = function (req, res, next) {
  dev.getProductionList(req, res, next);
};

module.exports.getProductionHistory = function (req, res, next) {
  try {
    // parse param
    let production = parse.query(req, "production");

    dev.getProductionHistory(req, res, next, production);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};

module.exports.createDevice = function (req, res, next) {
  try {
    // parse param
    let imei = parse.query(req, "IMEI");
    let key = parse.query(req, "key");
    let production = parse.query(req, "production");
    let OSVersion = parse.query(req, "OSVersion");
    let SBLVersion = parse.query(req, "SBLVersion");
    let STMVersion = parse.query(req, "STMVersion");
    let dataVersion = parse.query(req, "dataVersion");
    let textVersion = parse.query(req, "textVersion");
    let HWVersion = parse.query(req, "HWVersion");

    dev.createDevice(
      req,
      res,
      next,
      imei,
      key,
      production,
      OSVersion,
      SBLVersion,
      STMVersion,
      dataVersion,
      textVersion,
      HWVersion
    );
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
};
