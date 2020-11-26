# Thiết kế các API cho OTA Server
## Các chức năng chính của OTA server
OTA server thực hiện các chức năng chính sau :
* Điện thoại gửi request lên server xác nhận có phiên bản OS mới hay không, nếu có trả về đường link nếu có bản update mới.
* Nhận notifi từ điện thoại khi update thành công hay thất bại.
* Developer upload bản update OS mới lên server, server kiểm tra tính hợp lệ và gửi lên CDN.
* Nhận thông tin về điện thoại gửi lên từ Tool PC khi lần đầu nạp firmware.
##  Các API của server theo chức năng
### 1. Điện thoại gửi request lên server xác nhận phiên bản mới
Điện thoại gửi request đến server :
 ```
 URL: /device/1.0/update/info?IMEI=<IMEI>&requestID=<requestID>&signKey=<signKey>&OSVersion=<OSVersion>&HWversion=<HWversion> 
 Method: GET
 ```
Trong đó các parameter gồm :

|Parameter| Ý Nghĩa |
|:-----|:----|
|IMEI | IMEI của điện thoại yêu cầu update|
|requestID| requestID là một số random được tạo phía điện thoaij|
|signKey| là một chữ ký số được tạo bởi hàm HMAC_SHA256 với key là HMAC key và data là chuỗi IMEI+ request ID|
|OSVersion| Phiên bản OS hiện tại của điện thoại |
|HWVersion | Phiên bản hardware hiện tại của điện thoại |

Khi có bản update mới, server trả về mã code 200 và chuỗi json có nội dung : 
```
{
    "update": "yes",
    "OS": "<Link to update>"
}
```

Khi không có bản update mới, server trả về mã code 200 và chuỗi json :
```
{
    "update":"no",
    "OS":""
}
```
Mã lỗi trả về :
```
200: OK 
403: Authentication is failed
400: Bad request
```
Server trả về OK nếu client gửi lên request đầy đủ các parameter cần thiết và có signKey hợp lệ, server trả về mã lỗi 403 nếu signKey là không hợp lệ và trả về 500 nếu thiếu parameter cần thiết.
### 2.Điện thoại gửi notifi lên server xác nhận phiên bản update hiện tại của thiết bị

Điện thoại gửi request :
```
URL: /device/1.0/update/noti
Method: POST
Request Body:
    {
      "IMEI" : <IMEI>,
      "requestID" : <requestID>,
      "signKey" : <signKey>,
      "OSVersion" : <OSVersion>,
      "HWVersion" : <HWVersion>
    }

```
Trong đó các parameter gồm :

|Parameter| Ý Nghĩa |
|:-----|:----|
|IMEI | IMEI của điện thoại yêu cầu update|
|requestID| requestID là một số random được tạo phía điện thoaij|
|signKey| là một chữ ký số được tạo bởi hàm HMAC_SHA256 với key là HMAC key và data là chuỗi IMEI+ request ID|
|OSVersion| Phiên bản OS hiện tại của điện thoại |
|HWVersion | Phiên bản hardware hiện tại của điện thoại |

Sau khi update và load OS lần đầu, điện thoại sẽ gửi thông tin về bản OS mới lên server, server lưu thông tin về phiên bản OS hiện tại của thiết bị lên database.


Server trả về :
```
200: OK
403: Authentication failed
400: Bad Request
500: Fail
```
Trường hợp server ghi nhận request chứa đầy đủ thông tin và signkey hợp lệ, server tiến hành ghi thông tin vào database. Nếu không xảy ra lỗi, server trả về mã code 200, nếu request thiếu parameter, server trả về 400, nếu signKey không hợp lệ, nó trả về 403, nếu Server gặp lỗi trong quá trình ghi dữ liệu vào database hoặc bất kì lỗi nào khác khi thực hiện hàm, nó trả về mã code 500.


### 3.Developer upload bản OS mới lên server.
Web client sẽ gọi vào API của OTA server để upload firmware lên.

```
URL: /dev/1.0/upload?user=<user>&requestID=<requestID>&signKey=<signKey>&production=<production>
Method: POST
Content Type: “form-data”
Body:
  file: file content
```

Trong đó các parameter gồm :

|Parameter| Ý Nghĩa |
|:-----|:----|
|user| là username của developer được thực hiện việc update|
|requestID| requestID là một số random được tạo phía điện thoại |
|signKey| là một chữ ký số được tạo bởi hàm HMAC_SHA256 với key là developer key tương ứng với user trong database, data là chuỗi gồm user+ request ID|
|production| production id tương ứng với thiết bị đang sử dụng |

Server trả về :
```
200: OK
403: Authentication failed
400: Bad request
500: Fail
```
Khi developer update thành công, server trả về mã code 200, khi việc xác thực thất bại, server trả về mã code 403, khi update không thành công, server trả về mã code 500.


### 4.Tool PC gửi thông tin của điện thoại lên server khi lần đầu nạp firmware cho điện thoại

Tool PC gửi request lên server:
```
URL: /dev/1.0/device?user=<user>&requestID=<requestID>&signKey=<signKey>&IMEI=<IMEI>&production=<production>&OSVersion=<OSVersion>&key=<key>
Method: POST
Respone code:
  200: OK
  400: Bad Request
  403: Authentication is failed
  500: Fail
```
Trong đó các parameter gồm :

|Parameter| Ý Nghĩa |
|:-----|:----|
|user| là username của developer được thực hiện việc update|
|requestID|requestID là một số random được tạo phía điện thoại |
|signKey|là một chữ ký số được tạo bởi hàm HMAC_SHA256 với key là developer key tương ứng với user trong database, data là chuỗi gồm user+ request ID |
|IMEI| IMEI của thiết bị |
|production| production id của thiết bị |
|OSVersion| phiên bản OS hiện tại |
|key | HMAC key của thiết bị |

