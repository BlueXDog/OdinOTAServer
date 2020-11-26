# OTAServer

## Thiết kế hệ thống

[Tài liệu](docs/DesignSystem.md)

## Chuẩn bị

### 1. File env cho postgresql

Tạo file `pg.env` trong thư mục `deploy/postgresql` với nội dung:

```
POSTGRES_PASSWORD=<postgresql password>
POSTGRES_USER=<postgresql user>
POSTGRES_DB=<postgresql database name>
```

### 2. File env cho s3

Tạo file `s3.env` trong thư mục `deploy/server` với nội dung:

```
S3_BUCKET_NAME=<s3 bucket name for store firmware>
S3_IAM_USER_KEY=<user key with access permisson to s3 bucket>
S3_IAM_USER_SECRET=<user secret key with access permisson to s3 bucket>
```

### 3. File env cho ký url cloudfront

Tạo file `cloudfront.env` trong thư mục `deploy/server` với nội dung:

```
CF_ACCESS_KEY_ID=<cloudfront access key>
CF_PRIVATE_KEY=<cloudfront private key>
CF_BASE_URL=<cloudfront base url>
```

Trong đó `CF_PRIVATE_KEY` là dạng thay thế toàn bộ dấu xuống dòng bằng `\n`. Ví dụ: `CF_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIE...1Ar\nwLW...2eL\nFOu...k2E\n-----END RSA PRIVATE KEY-----`

## Chạy server

Có thể chạy server bằng `docker compose` với lệnh:

```
docker-compose -f deploy/docker-compose.yml up -d
```

## Môi trường phát triển

### Máy local của developer

- URL cho device: http://localhost:3000
- URL cho dev: http://localhost:3001

### Môi trường stage

- URL cho device: https://test.ginnovations-inc.com/ota/api/device
- URL cho dev: https://test.ginnovations-inc.com/ota/api/dev

### Môi trường production

- URL cho device: https://update.xor.support
- URL cho dev: https://update.xor.support:8081
