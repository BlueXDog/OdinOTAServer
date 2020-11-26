var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

console.log(
  `Dev service started, ${process.env.SERVER_NAME} version ${process.env.SERVER_VERSION}`
);

var devRouter_1_0 = require("./v1.0/routes/dev_router");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

app.use("/1.0", devRouter_1_0);

// Default
app.use("/", devRouter_1_0);

app.use(function (req, res) {
  res.sendStatus(404);
});

module.exports = app;
