CREATE TABLE IF NOT EXISTS odin_devs
(
  id              serial    PRIMARY KEY,
  name            text      NOT NULL UNIQUE,
  email           text      NOT NULL UNIQUE,
  key             text      NOT NULL,
  create_time     TIMESTAMP NOT NULL,
  last_login_time TIMESTAMP NOT NULL
);



CREATE TABLE IF NOT EXISTS odin_regions
(
  id          serial PRIMARY KEY,
  name        text   NOT NULL UNIQUE,
  description text
);

  CREATE TABLE IF NOT EXISTS odin_productions
  (
  id              serial PRIMARY KEY,
  name            text   NOT NULL,
  region_id       int    NOT NULL REFERENCES odin_regions(id),
  hw_version      text   NOT NULL,
  firmware_key    text   NOT NULL,
  os_latest_version text   NOT NULL, 
  os_history      text[],
  CONSTRAINT device_type UNIQUE (name, region_id, hw_version)
);
CREATE TABLE IF NOT EXISTS odin_versions 
(
  id             serial    PRIMARY KEY,
  production_id  int       NOT NULL REFERENCES odin_productions(id),
  type           text      NOT NULL,
  version        text      NOT NULL,
  url            text      NOT NULL,
  release_time   TIMESTAMP NOT NULL,
  release_dev_id int       NOT NULL REFERENCES odin_devs(id),
  CONSTRAINT type_version UNIQUE (type, version)
);

CREATE TABLE IF NOT EXISTS odin_devices
(
  id                 serial    PRIMARY KEY,
  imei               text      NOT NULL UNIQUE,
  user_key           text      NOT NULL,
  production_id      int       NOT NULL REFERENCES odin_productions(id),
  update_permission  int       NOT NULL,
  hw_version         text      NOT NULL,
  os_version         text      NOT NULL,
  init_time          TIMESTAMP NOT NULL,
  last_update_time   TIMESTAMP,
  last_checking_time TIMESTAMP
);
