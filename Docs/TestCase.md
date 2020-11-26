# Test Case cho OTA server

## 1.TestCase cho [1. Điện thoại gửi request lên server xác nhận phiên bản mới](/docs/DesignAPI.md)

|Prerequire | Nội dung Request |Nội dung trả về mong muốn|Response code mong muôn |
|:----|:----|:----|:----:|
|Đã có bản update mới|Request gửi lên đầy đủ thông tin, signKey hợp lệ | Trả về chuỗi json chứa đường link đến thư mục update|200|
|Chưa có bản update mới| Request gửi lên đầy đủ thông tin, signKey hợp lệ | Trả về chuỗi json chứa nội dung update : no, đường link rỗng |200|
|Đã có hoặc chưa có bản update mới |Request chứa đầy đủ thông tin, signKey không hợp lệ| Empty |403|
|Đã có hoặc chưa có bản update mới |Request không chứa đầy đủ thông tin, signKey không hợp lệ| Empty |400|
|Đã có hoặc chưa có bản update mới |Request không chứa đầy đủ thông tin, signKey hợp lệ| Empty |400|


## 2.TestCase cho [2.Điện thoại gửi notifi lên server xác nhận phiên bản update hiện tại của thiết bị](/docs/DesignAPI.md)

|Prerequire | Nội dung Request |Nội dung trả về mong muốn|Response code mong muôn |
|:----|:----|:----|:----:|
|Empty|Request gửi lên không chứa đầy đủ thông tin | Empty| 400|
|Empty| Request gửi lên chứa đầy đủ thông tin, signKey hợp lệ|Empty | 200|
|Empty| Request gửi lên chứa đầy đủ thông tin, signKey không hợp lệ |Empty|403|

## 3.TestCase cho [3.Developer upload bản OS mới lên server.](/docs/DesignAPI.md)
|Prerequire | Nội dung Request |Nội dung trả về mong muốn|Response code mong muôn |
|:----|:----|:----|:----:|
|Empty| Request gửi lên không chứa đầy đủ thông tin | Empty| 400|
|Empty| Request gửi lên đầy đủ thông tin, signKey không hợp lệ | Empty |403|
|Empty| Request gửi lên đầy đủ thông tin, signKey hợp lệ,thông tin production hợp lệ | Empty| 200|
|Empty| Request gửi lên đầy đủ thông tin, signKey hợp lệ, không tìm thấy production id | Empty| 500|
|Empty|Request gửi lên đầy đủ thông tin, signKey hợp lệ, thông tin production id hợp lệ,định dạng file gửi lên sai |Empty | 500|

## 4.TestCase cho [4.Tool PC gửi thông tin của điện thoại lên server khi lần đầu nạp firmware cho điện thoại](/docs/DesignAPI.md)
|Prerequire | Nội dung Request |Nội dung trả về mong muốn|Response code mong muôn |
|:----|:----|:----|:----:|
|Empty| Request gửi lên không chứa đầy đủ thông tin |Empty|400|
|Empty| Request gửi lên chứa đầy đủ thông tin, signKey hợp lệ, production id hợp lệ |Empty| 200|
|Empty| Request gửi lên chứa đầy đủ thông tin, signKey không hợp lệ |Empty| 403|
|Empty|Request gửi lên chứa đầy đủ thông tin, signKey hợp lệ, production id không tồn tại |Empty|500|
