var s3 = require("../../utils/s3");
var pg = require("../dataprovider/postgresql");
var crypto = require("../../utils/crypto");
var admZip = require("adm-zip");
var parse = require("../../utils/parsereq");
const mattermost = require("../../utils/mattermost");

async function uploadFile(dev, production, file, file_info) {
  return new Promise((resolve, reject) => {
    pg.getProduction(production)
      .then((product) => {
        if (file_info.changelog) {
          uploadChangeLog(product, file_info.name, file).then(() => {
            resolve();
          });
        } else {
          let crc32_firm = crypto.crc32(file);
          let sign_firm = crypto.rsaSign(product.firmware_key, crc32_firm);

          let file_path = s3.createFilePath(
            file_info.type,
            product.name,
            product.region,
            file_info.version,
            file_info.type + file_info.number,
            file_info.block,
            file_info.length,
            sign_firm
          );

          s3.uploadFile(file, file_path).then(() => {
            pg.addVersion(
              file_info.type,
              file_info.version,
              s3.createFolderPath(
                file_info.type,
                product.name,
                file_info.version,
                product.region
              ),
              dev.id
            ).then((version_id) => {
              pg.getProduction(production).then((product) => {
                if (
                  ![
                    product.os_version_id,
                    product.sbl_version_id,
                    product.stm_version_id,
                    product.data_version_id,
                    product.text_version_id,
                  ].includes(version_id.id)
                ) {
                  pg.updateProductionVersion(
                    file_info.type,
                    version_id.id,
                    production
                  ).then(() => {
                    mattermost.notiNewFirmware(
                      dev.name,
                      file_info.type,
                      file_info.version,
                      product.name,
                      product.region
                    );
                    resolve();
                  });
                } else {
                  resolve();
                }
              });
            });
          });
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

async function uploadChangeLog(product, name, file) {
  return new Promise((resolve, reject) => {
    let file_path = s3.createChangeLogPath(product.name, product.region, name);
    s3.uploadFile(file, file_path)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports.uploadFirmware = async function (
  req,
  res,
  next,
  user,
  production,
  file
) {
  try {
    let file_info = parse.fileName(file.name);

    await uploadFile(res.dev, production, file.data, file_info);

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports.uploadFirmwareZip = async function (
  req,
  res,
  next,
  user,
  production,
  file
) {
  try {
    var zip = new admZip(file.data);
    var zipEntries = zip.getEntries();
    let uploadList = [];
    zipEntries.forEach(async (entry) => {
      let file_info = parse.fileName(entry.name);
      let data = entry.getData();
      uploadList.push(uploadFile(res.dev, production, data, file_info));
    });
    await Promise.all(uploadList);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports.getProductionList = async function (req, res) {
  try {
    let productions = await pg.getProductionList();
    res.status(200).json(productions);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports.getProductionHistory = async function (
  req,
  res,
  next,
  production
) {
  try {
    let productions = await pg.getProductionHistory(production);
    res.status(200).json(productions);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

module.exports.createDevice = async function (
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
) {
  try {
    await pg.setDevice(
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
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
