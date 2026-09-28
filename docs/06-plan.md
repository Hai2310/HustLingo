# 06. Kế hoạch triển khai 10 tuần

## Cách tổ chức

Giả định nhóm 3–4 người: **ứng dụng/UI**, **backend/dữ liệu**, **nội dung/UX**, **kiểm thử/tích hợp**. Nếu chỉ có 3 người, gộp nội dung/UX với kiểm thử, nhưng vẫn cần người thứ hai rà soát tiếng Anh. Mỗi tuần có bản chạy được hoặc bằng chứng rõ; không đợi đến cuối kỳ mới tích hợp.

## Lịch và mốc bàn giao

| Tuần | Trọng tâm | Bàn giao và điều kiện qua mốc |
| --- | --- | --- |
| 1 | Chốt phạm vi và ma trận hai role; cài Flutter/Dart, Supabase CLI; đánh giá clickable prototype; spike mic/STT/TTS | `flutter doctor` đạt môi trường Android/web, chốt package theo tài liệu 10, wireframe/luồng được duyệt, mẫu âm thanh hoặc quyết định thay thế |
| 2 | Auth, bảng role/trạng thái, RLS/quyền ghi, mẫu nội dung và quy trình bootstrap admin | Đăng ký mặc định learner, một admin bootstrap, kiểm tra learner không tự nâng quyền; 1 chủ đề mẫu/seed |
| 3 | Danh sách/chủ đề, bài giảng ngắn, flashcard, TTS; khung quản trị nội dung web | Learner học 25 thẻ trên Android/web; admin tạo/sửa bản nháp và xem trước trên web |
| 4 | 3 chủ đề còn lại, ngân hàng quiz gồm câu hỏi hình ảnh, kiểm tra nội dung và phát hành | Đủ 100 từ/câu hỏi đã duyệt; ít nhất một câu hình hợp lệ trong nội dung đã phát hành; admin phát hành được chủ đề, learner không thấy bản nháp |
| 5 | Nộp quiz trên máy chủ, tiến độ, lịch ôn | Điểm/lịch ôn chỉ ghi qua function; đăng nhập chéo thiết bị thấy tiến độ; thử truy cập trực tiếp bằng hai learner và admin |
| 6 | Luồng luyện nói và STT | Ghi âm, quyền mic, bản chép lời, mức khớp, retry; đo độ trễ/chi phí trên Android/web |
| 7 | Phản hồi câu viết bằng AI, hạn mức, quyền riêng tư | Phản hồi theo schema, kiểm tra nội dung/timeout, giới hạn 5 lượt/ngày, thông báo dữ liệu được gửi ra dịch vụ |
| 8 | Quản trị tài khoản web, tích hợp, UX/accessibility, xóa dữ liệu | Admin tìm/khóa/mở learner, gửi reset, đổi role có log; thử token cũ; luồng chính không gãy |
| 9 | Kiểm thử hệ thống, phân quyền và thử với người học mới | Ma trận kiểm thử hoàn tất, thử ít nhất 5 người, kiểm tra trực tiếp RLS/API và sửa lỗi cản trở |
| 10 | Ổn định, đo chỉ số, tài liệu vận hành, demo | Bản Android, web learner/admin, seed/backup, biên bản nghiệm thu; demo phát hành nội dung và khóa tài khoản |

## Các cổng quyết định

- **Cuối tuần 1:** nếu ghi âm/STT trên web không chạy ổn định, quyết định làm adapter web khác hoặc hạ luyện nói web xuống demo có thông báo rõ; không để rủi ro đến tuần 6.
- **Cuối tuần 2:** khóa 4 chủ đề, schema và nhà cung cấp AI/STT sau khi đo chi phí/điều khoản. Không thêm tính năng ngoài P0.
- **Cuối tuần 4:** admin phải phát hành được một chủ đề từ bản nháp; nếu quá tải, giữ form quản trị đơn giản và import hàng loạt, không làm trình soạn thảo giàu định dạng.
- **Cuối tuần 5:** phải có đường học không phụ thuộc AI: flashcard → quiz → tiến độ → ôn. Nếu chưa có, ưu tiên hoàn tất trước khi làm tính năng AI.
- **Cuối tuần 7:** nếu AI/STT vượt hạn mức hoặc chất lượng kém, dùng phản hồi dựa trên quy tắc cho câu viết và STT ở chế độ thử nghiệm; báo minh bạch trong demo. Không tuyên bố chấm chính xác khi chưa kiểm chứng.
- **Đầu tuần 9:** đóng phạm vi tính năng, chỉ sửa lỗi và nội dung.

## Phân rã công việc chính

| Nhóm việc | Đầu ra | Phụ thuộc |
| --- | --- | --- |
| Thiết kế UX | Wireframe màn learner và ba phần admin web, trạng thái lỗi/không quyền/không mạng | Phạm vi, ma trận quyền và luồng học |
| Nội dung | 100 mục từ, ít nhất 40 câu hỏi/chủ đề để rút 10 câu/lượt; ảnh quiz có quyền sử dụng, mô tả và câu chữ thay thế; kiểm duyệt chéo | Schema nội dung |
| Ứng dụng | Auth, màn learner và admin web tối giản, flashcard, quiz, tiến độ, nói, viết | API và thiết kế UX |
| Backend | SQL migrations/RLS, bootstrap admin, version nội dung, quản trị tài khoản, nộp quiz/ôn, TypeScript Edge Functions STT/AI | Schema, tài khoản dịch vụ |
| Chất lượng | Unit test điểm/lịch ôn, integration test role và ghi dữ liệu, kiểm thử Android/web/admin, thử người dùng | Bản tích hợp theo tuần |
| Bàn giao | Hướng dẫn chạy, biến môi trường mẫu, script seed, test report, kịch bản demo | Chức năng đã đóng băng |

## Ước lượng và kiểm soát tiến độ

Với 3–4 người × 10–15 giờ × 10 tuần, tổng năng lực khoảng **300–600 giờ**, gồm cả học công nghệ, nội dung và kiểm thử. Ước lượng này là giả định cần xác nhận ở tuần 1. Mỗi tuần giữ backlog nhỏ, ghi người phụ trách, ngày dự kiến, trạng thái, bằng chứng demo và lỗi. Nếu một hạng mục P0 trễ hơn 1 tuần, bỏ P1 trước và giảm độ bóng giao diện trước khi giảm độ đúng của dữ liệu/quyền riêng tư.

## Định nghĩa hoàn thành cho một hạng mục

Mã chạy trên Android và web nếu hạng mục có giao diện; dữ liệu lỗi được xử lý; có kiểm thử phù hợp; người khác trong nhóm rà soát; tài liệu yêu cầu/API được cập nhật; có ảnh/chạy thử cho mốc tuần. Không coi việc chỉ vẽ màn hình là hoàn thành chức năng.
