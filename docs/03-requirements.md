# 03. Yêu cầu sản phẩm

Mã yêu cầu dùng để nối thiết kế, công việc và kiểm thử. **P0** là điều kiện bàn giao, **P1** làm sau P0 trong 10 tuần nếu còn thời gian; phần “sau MVP” ở tài liệu 01 không thuộc danh sách triển khai.

## Chức năng

| ID | Mức | Yêu cầu và tiêu chí chấp nhận |
| --- | --- | --- |
| FR-01 | P0 | Người dùng đăng ký, đăng nhập, đăng xuất bằng email/mật khẩu; phiên còn hiệu lực sau khi mở lại; thông báo lỗi đăng nhập không lộ tài khoản có tồn tại hay không. |
| FR-02 | P0 | Danh sách hiển thị 4 chủ đề, số từ, trạng thái chưa học/đang học/đã làm quiz. Chọn chủ đề mở đúng 25 từ. |
| FR-03 | P0 | Flashcard hiện từ, IPA, nghĩa, ví dụ, âm thanh phát lại được; hình chỉ hiện khi có tài sản đã cấp quyền. Chuyển thẻ không làm mất dữ liệu. |
| FR-04 | P0 | Quiz tạo 10 câu từ chủ đề, có ít nhất 2 dạng câu; chỉ một đáp án đúng; không lặp cùng từ trong một lượt nếu đủ dữ liệu; nộp xong hiển thị điểm và từ sai. |
| FR-05 | P0 | Kết quả quiz được lưu theo người dùng và chủ đề; mở trên Android/web cùng tài khoản thấy kết quả mới nhất và tổng từ đã học. Không ghi lượt chưa nộp. |
| FR-06 | P0 | Từ sai trong quiz được đưa vào hàng ôn ngay; từ đúng được hẹn ôn sau 1 ngày. Khi ôn đúng, hẹn tiếp 3 rồi 7 ngày; khi ôn sai, hẹn lại sau 1 ngày. Giờ hẹn lưu UTC. |
| FR-07 | P0 | Người học ghi âm tối đa 10 giây sau khi cấp quyền. STT trả bản chép lời; hệ thống chuẩn hóa chữ hoa/dấu câu rồi so với từ/câu mẫu để hiển thị khớp, chưa khớp hoặc không nhận diện được. Tối đa 10 lượt/người/ngày; không gọi đó là điểm phát âm. |
| FR-08 | P0 | Người học gửi câu 5–200 ký tự chứa từ mục tiêu; câu không chứa từ bị từ chối với hướng dẫn. Phản hồi AI bằng tiếng Việt có tối đa 3 ý và câu gợi ý. Tối đa 5 lượt/người/ngày; dữ liệu không hợp lệ hoặc dịch vụ lỗi có thông báo và không trừ lượt nếu chưa có phản hồi. |
| FR-09 | P0 | Màn tiến độ hiển thị chủ đề đã hoàn thành quiz, điểm lần gần nhất, độ chính xác quiz tổng hợp, số từ đã học qua, số từ cần ôn và liên kết vào lượt ôn. |
| FR-10 | P0 | Người dùng có thể yêu cầu xóa tài khoản và dữ liệu học; hệ thống xác nhận rồi xóa hoặc lên lịch xóa theo chính sách đã công bố. Chức năng này có thể là đường dẫn hỗ trợ thủ công trong bản demo nếu backend chưa tự động hóa, nhưng phải kiểm chứng quy trình. |
| FR-11 | P1 | Lưu chủ đề đã tải để xem flashcard khi mất mạng; không cho quiz offline nếu chưa có đồng bộ đáng tin cậy. |
| FR-12 | P1 | Bộ lọc chủ đề theo trạng thái và nhắc ôn trong ứng dụng; không yêu cầu push notification. |
| FR-13 | P0 | Hệ thống có đúng hai role `admin` và `learner`; đăng ký công khai luôn tạo learner. Chỉ quy trình bootstrap/Edge Function quản trị mới đổi role; không thể tự nâng quyền qua client, kể cả token cũ. |
| FR-14 | P0 | Admin trên web tạo/sửa bản nháp chủ đề, bài giảng ngắn, từ vựng và câu hỏi; xem trước, kiểm tra hợp lệ rồi phát hành/ẩn. Learner chỉ thấy bản đã phát hành; lượt quiz đang mở giữ đúng phiên bản đến khi hết hạn. |
| FR-15 | P0 | Admin trên web xem/tìm tài khoản theo email/tên/role/trạng thái, khóa/mở learner và gửi liên kết đặt lại mật khẩu. Tài khoản bị khóa không dùng được API học dù còn phiên đăng nhập. Admin không xem mật khẩu hoặc sửa kết quả học. |
| FR-16 | P0 | Admin cấp/thu hồi admin qua API bảo mật, có xác nhận và nhật ký thao tác; không hạ quyền admin cuối cùng. Phân quyền được kiểm tra trên máy chủ ở từng yêu cầu. |
| FR-17 | P1 | Admin có thể mời learner mới qua email; tài khoản chỉ được kích hoạt sau khi người nhận hoàn tất quy trình Auth. |

## Quy tắc nghiệp vụ

- Một chủ đề có 20–30 từ; bản bàn giao dùng 25 từ. Mỗi từ có ID ổn định để giữ tiến độ khi sửa chính tả/nội dung.
- Quiz chọn câu hỏi từ cùng phiên bản bộ nội dung. Khi cập nhật dữ liệu, giữ ID và không thay đáp án đúng mà không tăng phiên bản.
- Điểm quiz = số câu đúng / 10 × 100, làm tròn số nguyên. Chỉ kết quả nộp thành công mới được tính.
- “Đã học qua” là tổng số từ thuộc các chủ đề người học đã hoàn thành ít nhất một quiz; không đồng nghĩa đã thành thạo. Độ chính xác quiz tổng hợp = tổng câu đúng / tổng câu đã nộp.
- Từ sai cần ôn được đánh dấu ngay; lịch ôn dùng quy tắc FR-06. MVP không khẳng định thuật toán lặp lại ngắt quãng tối ưu.
- Kết quả STT khớp khi văn bản sau chuẩn hóa bằng đáp án được chấp nhận trong dữ liệu. Trường hợp thiếu lời nói, nhiễu hoặc độ tin cậy thấp là “không nhận diện được”.
- Phản hồi AI phải tuân thủ cấu trúc do máy chủ kiểm tra. Nếu phản hồi không hợp lệ, không lưu như đánh giá thành công.
- Bài giảng MVP là phần giới thiệu ngắn của chủ đề (mục tiêu, 2–5 đoạn hướng dẫn, ví dụ/tài sản tùy chọn), không phải bài giảng video hay trình soạn thảo tự do.
- Một nội dung đã phát hành không được sửa trực tiếp: admin tạo bản nháp kế tiếp, phát hành thành phiên bản mới. Ẩn chủ đề chặn lượt học mới nhưng giữ dữ liệu học cũ.
- Admin và learner là hai role độc lập. Admin muốn thử luồng học sử dụng tài khoản learner thử riêng; quyền quản trị không tự cho phép đọc tiến độ cá nhân của người khác.

## Phi chức năng

| ID | Yêu cầu | Cách kiểm |
| --- | --- | --- |
| NFR-01 | Android và web chạy được từ cùng mã Flutter, giao diện ở 360 px và 1280 px không tràn, không che nút chính. | Kiểm tra thiết bị/trình duyệt trong tài liệu 07. |
| NFR-02 | Learner chỉ đọc dữ liệu học của mình; điểm, lịch ôn, phản hồi và hạn mức chỉ do chức năng máy chủ ghi. Admin chỉ truy cập nội dung/tài khoản đúng quyền; khóa AI/STT và service key ở máy chủ; giao tiếp HTTPS. | Kiểm tra RLS, truy cập DB trực tiếp/API bằng learner và admin, thử token cũ sau đổi role/khóa. |
| NFR-03 | Không lưu bản ghi âm gốc lâu dài; chỉ chuyển tạm đến STT, xóa sau xử lý. Chỉ lưu bản chép lời khi cần cho lịch sử luyện tập và có thông báo cho người dùng. | Kiểm tra storage/log và chính sách dữ liệu. |
| NFR-04 | Có timeout, thông báo lỗi và khả năng thử lại cho tác vụ mạng; không chặn quiz khi AI/STT ngừng hoạt động. | Mô phỏng lỗi mạng/dịch vụ. |
| NFR-05 | Tải màn danh sách chủ đề dưới 3 giây ở mạng thử nghiệm ổn định; phản hồi thao tác lật thẻ dưới 300 ms trên thiết bị thử. | Đo 5 lượt, lấy trung vị; ghi thiết bị/mạng. |
| NFR-06 | Nội dung tiếng Anh được kiểm duyệt; không có lỗi dữ liệu bắt buộc; tương phản chữ dễ đọc và hỗ trợ trình đọc màn hình cho nút chính. | Checklist nội dung và kiểm tra khả năng tiếp cận. |

## Ngoài phạm vi

Không có bài thi TOEIC/IELTS, hội thoại chatbot mở, chấm phát âm âm vị, bài viết dài, lớp học/giáo viên, thanh toán, bảng xếp hạng, ứng dụng desktop riêng hoặc xuất bản lên cửa hàng ứng dụng trong mốc 10 tuần.
