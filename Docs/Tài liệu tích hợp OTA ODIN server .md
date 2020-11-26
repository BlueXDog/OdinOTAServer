# Tích hơp OTA ODIN Server

## Điện thoại gửi request lên server yêu cầu kiểm tra phiên bản cập nhật mới 
Điện thoại gửi request đến server :
 ```
 URL: https://test.ginnovations-inc.com/ota/api/1.5/device/1.0/update/info?IMEI=<IMEI>&requestID=<requestID>&signKey=<signKey>&OSVersion=<OSVersion>&HWversion=<HWversion> 
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

### Cách tạo signkey khi giao tiếp với server 
Signkey được tạo ra bằng thuật toán HMAC-SHA256 với data là chuỗi gồm IMEI + requestID, key là userkey tương ứng với mỗi điện thoại và được lưu trong cơ sở dữ liệu. 
Hàm tạo HMAC trong java :
```
public static String GetSignKey(String key, String data) throws Exception {
  Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
  SecretKeySpec secret_key = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
  sha256_HMAC.init(secret_key);
  return Hex.encodeHexString(sha256_HMAC.doFinal(data.getBytes("UTF-8")));
}
```
Trong hàm trên key là chuỗi string bí mật giữa điện thoại và server, data là chuỗi gồm IMEI +requestID. Hàm này sẽ trả về một Signkey dạng string.

### Ví dụ

Điện thoại gửi lên bản tin có dạng :
```
 URL : https://test.ginnovations-inc.com/ota/api/1.5/device/1.0/update/info?IMEI=014869004732113&RequestID=12244df&SignKey=eb92f8fb0bf3647f6fc72f06c7768e6e2a32c3f8740094a981d5636a749fced9&OSVersion=2.0&HWversion=1.5

 Method : GET
```
Trong bản tin request trên, key là một chuỗi giống như mật khẩu của mỗi điện thoại, chỉ có điện thoại và server biết key này, signkey là một chuỗi số ngẫu nhiên được điện thoại tạo ra. Signkey được tính bằng thuật toán HMAC-SHA256 như trên.

Khi có phiên bản mới, server gửi về  chuỗi json có dạng:
```
{
    "update" : "yes" ,
    "OS" : "https://cdnotastaging.xor.support/odin/OS/1.0.1?Expires=1606213192&Signature=Ik0AIP3NER0SiBgkKOUm5pkDdjNPfqZ~Njqs5eto~OI7Xs1YfvDCzT1m4HByvOhDR-VxXfg3zTx~57uvnn2sxus2GaoXDza2DVeltsyZG4kOILXA~~PZ6335y~UAP1Vgp7WD2iJB8oBO2jghJ-AYxUXE~j0biSU2KUIEPqtg11amk36t1Ul3FC~kqeeZUd7zmUbfUBXgQHdNWpoom2d0g9fas7MG4LJg93fIGvbdIfHoJ7o1xJ4H1cQQLHnM6~767JF2cnLhZ3imYPJwIaswip8qEWNhADcIjIzikNnplZ2srZntrqX2nwqol6bR6OB1~U-huQCT6gdgX6Rlm6E06A__&Key-Pair-Id=K29A25CLJTHSMB"
}
```
Khi không có bản update mới, server gửi về chuỗi json có dạng :
```
{
    "update" : "no",
    "OS" : ""
}
```


## Điện thoại gửi notifi lên server xác nhận phiên bản update hiện tại của thiết bị
Điện thoại gửi request :
```
URL: https://test.ginnovations-inc.com/ota/api/1.5/device/1.0/update/noti
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
```
Trường hợp server ghi nhận request chứa đầy đủ thông tin và signkey hợp lệ, server tiến hành ghi thông tin vào database. Nếu không xảy ra lỗi, server trả về mã code 200, nếu request thiếu parameter, server trả về 400, nếu signKey không hợp lệ, nó trả về 403.

### ví dụ 
Điện thoại notifi cho server :
```
URL : https://test.ginnovations-inc.com/ota/api/1.5/device/1.0/update/noti
Method : POST
Body :
{   
    "IMEI" : "014869004732113",
	"requestID" : "fs1224dgh",
    "signKey" : "eb92f8fb0bf3647f6fc72f06c7768e6e2a32c3f8740094a981d5636a749fced9",
    "OSVersion" : "2.1",
    "HWVersion" : "3.2"
}
```
Server trả về status 200 khi notifi thành công, nếu có lỗi xảy ra server trả về mã code 400 hoặc 403

## Developer upload bản OS mới lên S3 

Chức năng này đang hoàn thiện do đó cần developer thực hiện bằng tay.
Developer cần upload bản OS mới lên S3 bằng tay, sau đó lấy đường dẫn gốc đến bản OS mới và update vào trường url trong bảng odin_version. Số hiệu version của bản OS mới cũng được update vào trường version của bảng odin_version.




