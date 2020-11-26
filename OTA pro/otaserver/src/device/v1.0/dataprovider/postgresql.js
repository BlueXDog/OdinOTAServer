const Pool = require("pg").Pool;
const config = require("../../utils/config");

const pool = new Pool({
  user: config.pg.USER,
  host: config.pg.HOST,
  database: config.pg.DB,
  password: config.pg.PASSWORD,
  port: config.pg.PORT,
});

// input: imei
// output: all information of XPhone
module.exports.getDevice = async function (imei) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM public.xphone_devices WHERE imei = $1",
      [imei],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Invalid IMEI");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports.setDevice = async function (
  imei,
  user_key,
  production_id,
  os_version,
  sbl_version,
  stm_version,
  data_version,
  text_version,
  hw_version
) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO public.xphone_devices(imei, user_key, production_id, \
                   update_permission, hw_version, os_version, sbl_version, \
                   stm_version, data_version, text_version, init_time) \
      VALUES ($1, $2, $3, 1, $4, $5, $6, $7, $8, $9, $10) \
      ON CONFLICT (imei) DO UPDATE \
        SET user_key=excluded.user_key, production_id=excluded.production_id, \
        hw_version=excluded.hw_version, os_version=excluded.os_version, \
        sbl_version=excluded.sbl_version, stm_version=excluded.stm_version, \
        data_version=excluded.data_version, text_version=excluded.text_version",
      [
        imei,
        user_key,
        production_id,
        hw_version,
        os_version,
        sbl_version,
        stm_version,
        data_version,
        text_version,
        new Date(),
      ],
      async (error) => {
        if (error) {
          reject(error);
        }
        try {
          resolve();
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

// input: dev name
// output: all information of dev
module.exports.getDev = async function (name) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM public.xphone_devs WHERE name = $1",
      [name],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Invalid name");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports.addVersion = async function (type, version, url, dev_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO public.xphone_versions(type, version, url, release_time, \
                   release_dev_id) \
      VALUES ($1, $2, $3, $4, $5) \
      ON CONFLICT ON CONSTRAINT type_version DO UPDATE \
        SET url = excluded.url, release_time = excluded.release_time, \
            release_dev_id = excluded.release_dev_id \
      RETURNING id;",
      [type, version, url, new Date(), dev_id],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Can't add version");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports.updateProductionVersion = async function (
  type,
  version,
  production_id
) {
  return new Promise((resolve, reject) => {
    const map = {
      OS:
        "UPDATE public.xphone_productions \
        SET os_version_id = $1, os_history = version || os_history \
        FROM public.xphone_versions \
        WHERE public.xphone_versions.id=$1\
              AND public.xphone_productions.id = $2;",
      SBL:
        "UPDATE public.xphone_productions \
        SET sbl_version_id = $1, sbl_history = version || sbl_history \
        FROM public.xphone_versions \
        WHERE public.xphone_versions.id=$1 \
              AND public.xphone_productions.id = $2;",
      STM:
        "UPDATE public.xphone_productions \
        SET stm_version_id = $1, stm_history = version || stm_history \
        FROM public.xphone_versions \
        WHERE public.xphone_versions.id=$1 \
              AND public.xphone_productions.id = $2;",
      DATA:
        "UPDATE public.xphone_productions \
        SET data_version_id = $1, data_history = version || data_history \
        FROM public.xphone_versions \
        WHERE public.xphone_versions.id=$1 \
              AND public.xphone_productions.id = $2;",
      TEXT:
        "UPDATE public.xphone_productions \
        SET text_version_id = $1, text_history = version || text_history \
        FROM public.xphone_versions \
        WHERE public.xphone_versions.id=$1 \
              AND public.xphone_productions.id = $2;",
    };
    pool.query(map[type], [version, production_id], async (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
};

module.exports.getUpdateVersion = async function (imei) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT productions.name as production, regions.name as region, \
              os.version as os, sbl.version as sbl, stm.version as stm, \
              data.version as data, text.version as text, \
              xphones.update_permission as permission \
      FROM public.xphone_devices as xphones \
        JOIN public.xphone_productions as productions \
          ON xphones.production_id=productions.id \
        JOIN public.xphone_regions as regions \
          ON productions.region_id=regions.id \
        JOIN public.xphone_versions as os \
          ON productions.os_version_id=os.id \
        JOIN public.xphone_versions as sbl \
          ON productions.sbl_version_id=sbl.id \
        JOIN public.xphone_versions as stm \
          ON productions.stm_version_id=stm.id \
        JOIN public.xphone_versions as data \
          ON productions.data_version_id=data.id \
        JOIN public.xphone_versions as text \
          ON productions.text_version_id=text.id \
      WHERE xphones.imei=$1",
      [imei],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Can't get update version");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports.updateDeviceInfo = async function (
  imei,
  OSVersion,
  SBLVersion,
  STMVersion,
  dataVersion,
  textVersion
) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE public.xphone_devices \
      SET os_version = $2, sbl_version = $3, stm_version = $4,  \
          data_version = $5, text_version = $6, last_update_time = $7 \
      WHERE imei = $1;",
      [
        imei,
        OSVersion,
        SBLVersion,
        STMVersion,
        dataVersion,
        textVersion,
        new Date(),
      ],
      async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
};

module.exports.updateDeviceChecking = async function (imei) {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE public.xphone_devices \
      SET last_checking_time = $2 \
      WHERE imei = $1;",
      [imei, new Date()],
      async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      }
    );
  });
};

module.exports.getProduction = async function (production_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT productions.id, productions.name, productions.hw_version, \
              productions.firmware_key, productions.os_version_id, \
              productions.sbl_version_id, productions.stm_version_id, \
              productions.data_version_id, productions.text_version_id, \
              regions.name as region \
      FROM public.xphone_productions as productions \
      JOIN public.xphone_regions as regions \
        ON productions.region_id=regions.id \
      WHERE productions.id = $1;",
      [production_id],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Invalid production");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};

module.exports.getProductionList = async function () {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT productions.id, productions.name, productions.hw_version, \
              regions.name as region \
      FROM public.xphone_productions as productions \
      JOIN public.xphone_regions as regions \
        ON productions.region_id=regions.id",
      [],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows);
      }
    );
  });
};

module.exports.getProductionHistory = async function (production_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT os_history as os, sbl_history as sbl, stm_history as stm, \
              data_history as data, text_history as text \
      FROM public.xphone_productions \
      WHERE id = $1",
      [production_id],
      async (error, results) => {
        if (error) {
          reject(error);
        }
        try {
          if (results.rowCount == 0) {
            reject("Invalid production");
          }
          resolve(results.rows[0]);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
};
