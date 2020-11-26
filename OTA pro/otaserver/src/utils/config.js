const aws = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME,
  IAM_USER_KEY: process.env.S3_IAM_USER_KEY,
  IAM_USER_SECRET: process.env.S3_IAM_USER_SECRET,
};
module.exports.aws = aws;

const cf = {
  ACCESS_KEY_ID: process.env.CF_ACCESS_KEY_ID,
  PRIVATE_KEY: process.env.CF_PRIVATE_KEY.replace(/\\n/gm, "\n"),
  BASE_URL: process.env.CF_BASE_URL,
  EXPIRE_TIME: 1, // hours
};
module.exports.cf = cf;

const pg = {
  PASSWORD: process.env.POSTGRES_PASSWORD || "1",
  HOST: process.env.POSTGRES_HOST || "postgres",
  USER: process.env.POSTGRES_USER || "t",
  DB: process.env.POSTGRES_DB || "ota_db",
  PORT: process.env.POSTGRES_PORT || 5432,
};
module.exports.pg = pg;

const redis = {
  HOST: process.env.REDIS_HOST || "redis",
  PORT: process.env.REDIS_PORT || 6379,
  EXPIRE_TIME: 15, // day
};
module.exports.redis = redis;
