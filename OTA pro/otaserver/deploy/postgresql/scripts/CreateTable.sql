CREATE TABLE IF NOT EXISTS xphone_devs
(
  id              serial    PRIMARY KEY,
  name            text      NOT NULL UNIQUE,
  email           text      NOT NULL UNIQUE,
  key             text      NOT NULL,
  create_time     TIMESTAMP NOT NULL,
  last_login_time TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS xphone_versions
(
  id             serial    PRIMARY KEY,
  type           text      NOT NULL,
  version        text      NOT NULL,
  url            text      NOT NULL,
  release_time   TIMESTAMP NOT NULL,
  release_dev_id int       NOT NULL REFERENCES xphone_devs(id),
  CONSTRAINT type_version UNIQUE (type, version)
);

CREATE TABLE IF NOT EXISTS xphone_regions
(
  id          serial PRIMARY KEY,
  name        text   NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS xphone_productions
(
  id              serial PRIMARY KEY,
  name            text   NOT NULL,
  region_id       int    NOT NULL REFERENCES xphone_regions(id),
  hw_version      text   NOT NULL,
  firmware_key    text   NOT NULL,
  os_version_id   int    REFERENCES xphone_versions(id),
  sbl_version_id  int    REFERENCES xphone_versions(id),
  stm_version_id  int    REFERENCES xphone_versions(id),
  data_version_id int    REFERENCES xphone_versions(id),
  text_version_id int    REFERENCES xphone_versions(id),
  os_history      text[],
  sbl_history     text[],
  stm_history     text[],
  data_history    text[],
  text_history    text[],
  CONSTRAINT device_type UNIQUE (name, region_id, hw_version)
);

CREATE TABLE IF NOT EXISTS xphone_devices
(
  id                 serial    PRIMARY KEY,
  imei               text      NOT NULL UNIQUE,
  user_key           text      NOT NULL,
  production_id      int       NOT NULL REFERENCES xphone_productions(id),
  update_permission  int       NOT NULL,
  hw_version         text      NOT NULL,
  os_version         text      NOT NULL,
  sbl_version        text      NOT NULL,
  stm_version        text      NOT NULL,
  data_version       text      NOT NULL,
  text_version       text      NOT NULL,
  init_time          TIMESTAMP NOT NULL,
  last_update_time   TIMESTAMP,
  last_checking_time TIMESTAMP
);
