# OTA overview
## OTA Update 
OTA (over the air) là cơ chế giúp thiết bị android có thể nhận và cài đặt các gói tin update của hệ thống, ứng dụng và các cài đặt timezone.
OTA update được thiết kế để upgrade hệ điều hành, ứng dụng hệ thống, timezone rule mà không làm ảnh hưởng đến ứng dụng phía người dùng.

Hệ thống android hiện tại được chia làm hai kiến trúc liên quan đến OTA update:
* A/B (Seamless) system updates
* Non-A/B system updates


## A/B system updates
Thiết bị android sử dụng A/B system có một bản copy của một partition ( A và B) và có thể update ở 1 partition trong khi partion kia vẫn đang chạy bình thường. A/B system update đảm bảo hệ thống hiện tại vẫn có thể làm việc trong khi nó được update. 

Lợi ích của việc sử dụng A/B update:
* Việc update được thực hiện khi cả hệ thống vẫn đang chạy mà không làm gián đoạn việc sử dụng của người dùng. Hệ thống chỉ bị gián đoạn trong thời gian ngắn khi nó reboot sang partition đã được update.
* Nếu hệ thống gặp bất cứ lỗi gì trong quá trình update hay khởi chạy OS mới, người dùng sẽ không bị ảnh hưởng do hệ thống sẽ tự động dùng lại OS cũ.
* Việc update có thể được streaming, do đó giảm được việc phải tải toàn bộ update package về trước khi cài, cũng như giảm dung lượng trống cần thiết để chứa update package.
* Không cần vùng nhớ cache để lưu OTA update package.

### Áp dụng A/B update vào thiết bị android
A/B update yêu cầu sự thay đổi trong system và client server phía thiết bị, tuy nhiên phía server không cần thay đổi.

Công việc phía client cần thực hiện để áp dụng A/B update :
* Phía client cần quyết định khi nào thực hiện update. A/B update thực hiện trong background mà không cần user tác động, do đó việc update phải được lên lịch hoặc đặt các rule để xác định thời điểm update.
* Gửi request lên OTA server để xác định khi nào có bản update mới. 
* Gọi hàm update-engine (trong android system) và truyền vào đường dẫn url đến update package. Hàm update-engine sẽ sử dụng một partition trống để làm nơi lưu trữ update package.
* Thông báo với server việc update và cài đặt thành công hay không. Nếu không nó sẽ tự lên lịch để thực hiện update lại. 

## Non-A/B system updates
Non-A/B system updates là hệ thống áp dụng trên các thiết bị android đời cũ, quá trình update của hệ thống gồm các bước :
* Client gửi request lên OTA để check có bản update mới hay không, nếu có bản update mới, OTA server sẽ gửi về URL đến bản update mới và các mô tả liên quan.
* Bản update được tải về bộ nhớ cache hoặc một partition trống, chữ ký số của bản update sẽ được so với chữ ký số trong system, nếu thỏa mãn một thông báo cho người dùng sẽ được hiện lên để yêu cầu cài đặt bản update.
* Thiết bị reboot vào chế độ recovery mode, 
* Trong chế độ recovery, chương trình recovery được chạy, nó sẽ trỏ đến update package vừa được download, sau khi xác thực chữ ký số lại lần nữa, dữ liệu từ update package sẽ được sử dụng để update hệ thống.
* Thiết bị reboot bình thường, phân vùng boot mới được update sẽ được load, nó sẽ trỏ đến các binary file và chạy trên phân vùng mới của hệ thống.
* Sau khi hệ thống update thành công, một update log sẽ được lưu trong /cache/recovery/last_log.#. của android system.

## Tạo OTA update package
Để tạo OTA update package,ta có thể sử dụng tools ota_from_target_files <https://android.googlesource.com/platform/build/+/master/tools/releasetools/ota_from_target_files.py> cho cả A/B system và non-A/B system.

### Build một full update từ thiết bị 
Một bản full update là một package chứa trạng thái cuối cùng của thiết bị (system, boot, recovery partition). Thiết bị có thể chạy package này bất kể trạng thái hoặc phiên bản trước của nó là thế nào.

Trước hết ta cần tạo một file zip từ thiết bị đang chạy package mới nhất, file zip này chứa mọi thứ cần thiết để tạo OTA package cho thiết bị này.
```sh
. build/envsetup.sh && lunch tardis-eng
mkdir dist_output
make dist DIST_DIR=dist_output
```
Câu lệnh trên tạo file zip chứa mọi thứ cần thiết để tạo OTA package từ thiết bị.

Để tạo một full update, ta sử dụng tool ota_from_target_files :
```sh
./build/make/tools/releasetools/ota_from_target_files dist_output/tardis-target_files.zip ota_update.zip
```
Câu lệnh trên sẽ tạo một file ota_update.zip có thể gửi đến thiết bị khác để bắt đầu cài đặt.
### Build một bản update cho phiên bản hiện tại (incremental update)
Ở đây, ta build một bản update cho một phiên bản đang có sẵn trên thiết bị, bản update này luôn có kích thước nhỏ hơn bản full update do nó chỉ chứa thông tin về các file thay đổi. 

Để tạo một incremental update, ta cần có một file zip từ bản build cũ (bản cần update) và file zip từ bản build mới bằng cách tạo file zip như khi build một bản full update.

Để tạo một bản incremental build, ta sử dụng câu lệnh :
```
./build/make/tools/releasetools/ota_from_target_files -i PREVIOUS-tardis-target_files.zip dist_output/tardis-target_files.zip incremental_ota_update.zip
```
Trong đó, PREVIOUS-tardis-target_files.zip là file zip từ bản build trước, tardis-target_file.zip là file zip của bản build mới nhất. Câu lệnh trên sẽ tạo ra file incremental_ota_update.zip dùng để update.


## signing buid for release

## Tài liệu
<https://source.android.com/devices/tech/ota/tools>

Tool dùng để build OTA update package.
https://android.googlesource.com/platform/build/+/master/tools/generate-self-extracting-archive.py
