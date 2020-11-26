var express = require("express");
var router = express.Router();
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
var dev = require("../controllers/dev_controller");
var auth = require("../middleware/auth");

router.use(
  cors({
    origin: true,
  })
);
router.use(auth.devAuth);

// upload
var router_upload = express.Router();
router_upload.use(busboy());
router_upload.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router_upload.use(bodyParser.json());
router_upload.use(busboyBodyParser());

router_upload.post("/", function (req, res, next) {
  dev.uploadFirmware(req, res, next);
});
router.use("/upload", router_upload);

// get production info
router.get("/production/list", function (req, res, next) {
  dev.getProductionList(req, res, next);
});

router.get("/production/history", function (req, res, next) {
  dev.getProductionHistory(req, res, next);
});

router.post("/device", function (req, res, next) {
  dev.createDevice(req, res, next);
});

router.use(function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
