# Thiết kế cơ sở dữ liệu cho ODIN OTA server

## ODIN devices
Đây là bảng chứa thông tin về điện thoại của người dùng


| Trường             | Kiểu dữ liệu | Chức năng                                                                 |
|--------------------|--------------|---------------------------------------------------------------------------|
| id                 | int          | ID của điện thoại                                                         |
| imei               | string       | IMEI                                                                      |
| user_key           | string       | hmac key dùng xác thực request                                            |
| production_id      | int          | Mã dòng máy                                                               |
| region_id          | int          | khu vực của người dùng, dùng để xác định phiên bản điện thoại được update |
| update_permission  | int          | update permission của user                                                |
| os_version         | string       | phiên bản hiện tại của hệ điều hành                                       |
| init_time          | datetime     | Thời điểm đăng kí thiết bị                                                |
| last_update_time   | datetime     | Thời điểm lần update cuối cùng thành công                                 |
| last_checking_time | datetime     | Thời điểm kiểm tra cập nhật cuối cùng                                     |

## Production version
Đây là bảng chứa thông tin về các dòng máy

| Trường          | Kiểu dữ liệu | Chức năng                          |
|-----------------|--------------|------------------------------------|
| id              | int          | Mã dòng máy                        |
| name            | string       | Tên dòng máy                       |
| region_id       | int          | Mã khu vực                         |
| hw_version      | string       | phiên bản phần cứng điện thoại     |
| firmware_key    | string       | khoá dùng ký firmware của dòng máy |
| os_version_id   | int          | id của firmware                    |


## Region
Đây là bảng chứa thông tin về các phiên bản cập nhập mới nhất của từng khu vực

| Trường          | Kiểu dữ liệu | Chức năng                      |
|-----------------|--------------|--------------------------------|
| id              | int          | Mã khu vực                     |
| name            | string       | Tên khu vực                    |
| description     | string       | Mô tả khu vực                  |

## Version
Đây là bảng chứa thông tin về các phiên bản cập nhật OS

| Trường         | Kiểu dữ liệu | Chức năng                                |
|----------------|--------------|------------------------------------------|
| id             | int          | id phiên bản                             |
| version        | string       | tên phiên bản                            |
| url            | string       | đường dẫn chứa firmware                  |
| release_time   | datetime     | thời gian release phiên bản              |
| release_dev_id | int          | id của người dev release phiên bản này   |


## Dev
Đây là bảng chứa thông tin về dev user

| Trường          | Kiểu dữ liệu | Chức năng                          |
|-----------------|--------------|------------------------------------|
| id              | int          | ID của dev                         |
| name            | string       | tên dev                            |
| email           | string       | email dev                          |
| key             | string       | hmac key dùng xác thực request     |
| create_time     | datetime     | Thời gian user được tạo mới        |
| last_login_time | datetime     | Thời gian user login lần gần nhất  |


## Thay đổi database khi thực hiện update OS version theo từng phiên bản 
Mục Tiêu : Database trước thực hiện việc update firmware theo bản mới nhất, để thực hiện update theo phiên bản liền sau nó, cần thay đổi trường version trong bảng Version thành dạng **String Unique** , version sẽ có dạng : **cn_1.0.1** . Trong đó **cn** là mã vùng, 1.0.1 là mã version.


