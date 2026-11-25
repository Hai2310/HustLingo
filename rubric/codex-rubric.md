# Rubric đánh giá sản phẩm HustLingo

Rubric dùng để đánh giá bản chạy được của HustLingo, bắt đầu từ nhánh `huy2`. Phạm vi gồm Bài học, Luyện tập, Gia sư, tiến độ, trải nghiệm đa nền tảng và kết nối Supabase. Mốc tham chiếu là phạm vi bản bàn giao 10 tuần. [Phạm vi sản phẩm](../docs/01-scope.md) · [Kịch bản kiểm thử](../docs/07-testing.md)

## Cách chấm

Mỗi tiêu chí tối đa **5 điểm**, tổng **100 điểm**. Thực hiện thao tác trong cột **Đạt 5 điểm** trên bản app đang đánh giá và lưu bằng chứng như ảnh màn hình, video ngắn hoặc kết quả kiểm tra. Ghi commit, ngày, nền tảng và chế độ khách/tài khoản để nhóm có thể thử lại.

| Điểm | Mức đạt |
| --- | --- |
| **5** | Hoàn thành toàn bộ hành vi trong mô tả và có bằng chứng. |
| **3** | Hoàn thành thao tác chính, còn thiếu ít nhất một kết quả hoặc trường hợp được nêu. |
| **1** | Mở được màn hình hoặc bắt đầu thao tác, nhưng chưa hoàn thành được thao tác chính. |
| **0** | Chức năng chưa có hoặc lỗi khiến không thể bắt đầu thao tác. |
| **B** | Đã có luồng cần thử, nhưng môi trường đang chặn kiểm chứng. Ghi nguyên nhân và ca cần chạy lại. |

Khi Supabase gián đoạn, vẫn chấm các luồng chạy được ở chế độ khách. Mục phụ thuộc Supabase đã triển khai nhưng chưa chạy được nhận **B**. Chức năng xác nhận còn thiếu nhận **0**. Chỉ chấm iOS nếu có bằng chứng chạy trên iOS. Các ca dùng tài khoản, đồng bộ và quyền truy cập chạy trên môi trường thử nghiệm của nhóm.

## Tiêu chí

### Bài học — 20 điểm

| Mã | Tiêu chí | Đạt 5 điểm |
| --- | --- | --- |
| BH1 | Tìm và mở bài | Ở chế độ khách, lọc theo cấp độ A1–C1 và loại bài, mở một chủ đề rồi vào chi tiết. Quay lại được danh sách và vẫn thấy bộ lọc đã chọn. |
| BH2 | Học từ vựng | Mở một bài có minh họa. Thẻ hiển thị từ, nghĩa, phiên âm và ví dụ. Nghe được phát âm, xem được bản dịch ví dụ và lưu được từ. Hình minh họa phù hợp với từ hoặc có nhãn ngữ cảnh rõ ràng. |
| BH3 | Học ngữ pháp | Mở một bài Grammar và xem đủ công thức, ví dụ và lỗi thường gặp. Đánh dấu đủ các phần thì bài đạt 100% và hiển thị hoàn thành. |
| BH4 | Bài học kỹ năng | Mở được ít nhất một bài mẫu cho mỗi kỹ năng nghe, nói, đọc và viết. Mỗi bài có nội dung, hướng dẫn và một thao tác học phù hợp với kỹ năng. |

### Luyện tập và ôn lại — 20 điểm

| Mã | Tiêu chí | Đạt 5 điểm |
| --- | --- | --- |
| LT1 | Học xong chuyển sang luyện | Từ một bài đã học, mở được lượt luyện dùng nội dung của chính bài đó. Có thể hoàn thành lượt luyện ở chế độ khách với dữ liệu có sẵn. |
| LT2 | Quiz và phản hồi | Làm được một quiz có cả câu đúng và sai để đối chiếu điểm. Sau khi trả lời, người học thấy đáp án và giải thích. Có ít nhất một câu chọn từ theo ảnh với cách hiển thị thay thế phù hợp khi ảnh lỗi. |
| LT3 | Flashcard và ôn câu sai | Mở được flashcard từ danh sách từ đã lưu và ôn lại những câu làm sai. Đóng rồi mở lại app vẫn thấy các mục cần ôn. |
| LT4 | Luyện thi rút gọn | Có lượt luyện mẫu TOEIC và IELTS. Mỗi lượt có đồng hồ, chuyển câu, nộp bài và kết quả. Kết quả được ghi rõ là điểm tự luyện. |

### Gia sư — 15 điểm

| Mã | Tiêu chí | Đạt 5 điểm |
| --- | --- | --- |
| GS1 | Tìm kịch bản hội thoại | Mở danh sách gia sư, chọn kịch bản và xem được cấp độ, chủ đề, mục tiêu trước khi bắt đầu. |
| GS2 | Hội thoại mẫu | Ở chế độ khách, gửi được tin nhắn và nhận phản hồi mẫu. Kết thúc được lượt luyện, xem được tóm tắt và thấy nhãn chế độ demo. |
| GS3 | Hội thoại qua dịch vụ | Với tài khoản thử, gửi tin nhắn qua dịch vụ gia sư và nhận phản hồi phù hợp kịch bản. Khi có lỗi dịch vụ, app báo rõ và cho thử lại. |

### Tiến độ, offline và tài khoản — 25 điểm

| Mã | Tiêu chí | Đạt 5 điểm |
| --- | --- | --- |
| TD1 | Lưu tiến độ trên máy | Khách đánh dấu một từ đã học và lưu từ. Sau khi đóng mở app, từ đã lưu, số từ đã học và phần trăm bài học vẫn đúng. |
| TD2 | Tiếp tục học khi mất kết nối | Khi danh mục online không tải được, app hiển thị thông báo offline và mở được bài có sẵn. Khi kết nối trở lại, nút thử lại tải được danh mục online. Ghi riêng kết quả nửa đầu nếu backend chưa phục hồi. |
| TD3 | Đăng nhập và hồ sơ | Đăng nhập bằng tài khoản thử, mở đúng hồ sơ và đăng xuất được về chế độ khách. Trường hợp đăng nhập thất bại có thông báo rõ. |
| TD4 | Chuyển và đồng bộ tiến độ | Học một bài ở chế độ khách, đăng nhập rồi mở cùng tài khoản trên thiết bị thứ hai. Tiến độ xuất hiện đúng, không bị nhân đôi khi đăng nhập lại và giữ được thay đổi sau khi kết nối phục hồi. |
| TD5 | Quyền truy cập dữ liệu | Kiểm tra chính sách quyền cùng người phụ trách backend và chạy ca thử với hai tài khoản trên môi trường thử nghiệm. Mỗi tài khoản chỉ truy cập và thay đổi dữ liệu được cấp quyền. Quyền quản trị và trạng thái tài khoản do máy chủ kiểm soát. |

### Trải nghiệm và chất lượng bản chạy — 20 điểm

| Mã | Tiêu chí | Đạt 5 điểm |
| --- | --- | --- |
| UX1 | Web và Android | Chạy luồng Trang chủ → Bài học → Chi tiết → Quay lại trên web và Android. Thử web ở 360 và 1280 px. Nội dung, ảnh và nút chính hiển thị đầy đủ và không tràn ngang. |
| UX2 | Dễ đọc và dễ thao tác | Người dùng đọc được nghĩa và hướng dẫn, phân biệt được các trạng thái bằng chữ hoặc biểu tượng ngoài màu sắc. Nút nghe, lưu và quay lại có tên dễ hiểu khi dùng bàn phím hoặc trình đọc màn hình. |
| UX3 | Phản hồi khi thao tác | Kiểm tra đang tải, danh sách trống, lỗi và hoàn thành. Mỗi trạng thái cho biết điều gì đang xảy ra và cách tiếp tục phù hợp, như thử lại hoặc quay về danh sách. |
| UX4 | Chạy lại và kiểm tra tự động | Hướng dẫn trong repo đủ để một thành viên khác mở app. `npm run check` chạy đạt và có kết quả chạy thử ít nhất một luồng học trên bản đang chấm. |

## Ghi kết quả

- Ghi mỗi mục theo mẫu `BH2 · 3/5 · Web · đã thấy thẻ minh họa và bản dịch, chưa nghe được phát âm · [bằng chứng]`.
- Cộng điểm các mục đã chấm. Báo cáo đồng thời **điểm đạt trên số điểm đã kiểm chứng** và **số điểm đang bị chặn**. Nếu có **B**, báo cáo khoảng điểm trên thang 100, với cận dưới là điểm đã đạt và cận trên cộng thêm điểm tối đa của các mục bị chặn. Ví dụ đạt **54/80 điểm đã kiểm chứng**, **20 điểm bị chặn**, khoảng **54–74/100**.
- Ghi riêng lỗi nghiêm trọng như app không mở, mất tiến độ hoặc truy cập sai quyền. Những lỗi này cần được xử lý trước khi xác nhận sẵn sàng bàn giao.

Để bắt đầu trên bản hiện tại, chấm phần Bài học và tiến độ local trước. Mở tab Luyện tập để xác nhận phần nào đã có thể thao tác, rồi chấm Gia sư ở chế độ khách. Để kiểm tra lại các mục online, dùng cùng commit sau khi Supabase hoạt động. [Báo cáo cải tiến HustLingo](../docs/product-improvement-report.md)
