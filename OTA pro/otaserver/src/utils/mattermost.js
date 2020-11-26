const request = require("request");

module.exports.sendMessage = async function (
  text,
  attachments,
  channel,
  web_hook
) {
  return new Promise((resolve, reject) => {
    if (!text && !attachments) {
      reject("Requires text or attachments");
    }

    let url = web_hook || process.env.MATTERMOST_HOOK;
    if (!url) {
      reject("You need to setup mattermost web-hook");
    }

    if (!text) {
      text = "";
    }
    text =
      `:pager: __${process.env.SERVER_NAME}:${process.env.SERVER_VERSION}__ :pager:\n` +
      text;

    let payload = {
      text: text,
      attachments: attachments,
      channel: channel,
    };
    request.post(url, { json: payload }, (error, res) => {
      if (error) {
        reject(error);
      }

      if (res.statusCode == 200) {
        resolve();
      } else {
        console.log(res.statusCode);
        reject("Can't send data to mattermost");
      }
    });
  });
};

module.exports.notiNewFirmware = function (
  user_name,
  type,
  version,
  production,
  region
) {
  let mess = `Bạn ${user_name} vừa upload bản firmware mới :clap:

| Sản phẩm      | Khu vực   | Loại firmware | Phiên bản  |
|---------------|-----------|---------------|------------|
| ${production} | ${region} | ${type}       | ${version} |`;

  this.sendMessage(mess);
};

module.exports.deviceGetUpdateInfo = function (imei, status) {
  let mess = `Thiết bị __${imei}__ vừa lấy thông tin cập nhật

${status}`;

  this.sendMessage(mess);
};

module.exports.deviceNotiUpdateInfo = function (imei, product, region) {
  let mess = `Thiết bị __${imei} (${product}, ${region})__ vừa thông báo đã cập nhật thành công :bouquet: :clap:`;

  this.sendMessage(mess);
};

module.exports.notiNewDevice = function (imei, os, sbl, stm, data, text, hw) {
  let mess = `Thiết bị __${imei}__ vừa được thêm mới thành công :clap:

| IMEI    | Hardware | OS    | SBL    | STM    | Data    | Text    |
|---------|----------|-------|--------|--------|---------|---------|
| ${imei} | ${hw}    | ${os} | ${sbl} | ${stm} | ${data} | ${text} |`;

  this.sendMessage(mess);
};
