# Cách chạy OTA Server



Để chạy ota server, trước tiên cần build image cho ota server, trong thư mục gốc của ứng dụng, chạy các câu lệnh :
```
docker build --tag odin-ota-server_ota-server  . 
docker-compose up
```
Câu lệnh đầu tiên sẽ build một image từ dockerfile có tên odin-ota-server_ota-server. Câu lệnh thứ 2 sẽ chạy file docker-compose.
Docker-compose sẽ tự động khởi tạo các image cho server, redis và postgresql và chạy trong một network riêng.

## Lưu ý :
file pg.env trong folder models dùng để khởi tạo các biến môi trường cho image postgresql, các biến khởi tạo bao gồm tên database, username và password dùng để đăng nhập, các giá trị này phải tương ứng với giá trị được khởi tạo trong file config.cfg

