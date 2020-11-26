var express = require("express");
var router = express.Router();
var device = require("../controllers/device_controller");
var auth = require("../middleware/auth");

router.use(auth.deviceAuth);
router.get("/update/info", function (req, res, next) {
  device.getUpdateInfo(req, res, next);
});

router.post("/update/noti", function (req, res, next) {
  device.notiUpdateInfo(req, res, next);
});

router.use(function (req, res) {
  res.sendStatus(404);
});

module.exports = router;
