module.exports.query = function (req, name, require) {
  let param = req.query[name];

  if (typeof param == "undefined" && require != false) {
    throw new Error(name + " is required");
  }

  return param;
};

module.exports.fileName = function (filename) {
  var result = {};
  const err = new Error("File name is not valid");
  var splits = filename.split("_");

  if (splits.length == 5) {
    result.version = splits[0];
    result.type = splits[1];
    result.number = splits[2];
    result.block = splits[3];
    result.length = splits[4];
    result.name = filename;
  } else if (
    splits.length == 3 &&
    splits[2].toLowerCase().startsWith("changelog")
  ) {
    result.version = splits[1];
    result.type = splits[0];
    result.changelog = true;
    result.name = filename;
  } else {
    throw err;
  }
  // check type is valid
  if (!["OS", "SBL", "STM", "DATA", "TEXT"].includes(result.type)) {
    throw new Error('Firmware type "' + result.type + '" is not valid');
  }
  return result;
};
