# 06. Kế hoạch triển khai 10 tuần

## Cách tổ chức

Giả định nhóm 3–4 người: **ứng dụng/UI**, **backend/dữ liệu**, **nội dung/UX**, **kiểm thử/tích hợp**. Nếu chỉ có 3 người, gộp nội dung/UX với kiểm thử, nhưng vẫn cần người thứ hai rà soát tiếng Anh. Mỗi tuần có bản chạy được hoặc bằng chứng rõ; không đợi đến cuối kỳ mới tích hợp.

## Lịch và mốc bàn giao

| Tuần | Trọng tâm | Bàn giao và điều kiện qua mốc |
| --- | --- | --- |
| 1 | Chốt phạm vi, thiết kế luồng, khảo sát Flutter Android/web, spike mic/STT/TTS, tạo repo/cấu hình | Wireframe chính, backlog có ID yêu cầu, mẫu ghi âm và phát âm chạy trên hai nền tảng hoặc quyết định thay thế có ước lượng |
| 2 | Thiết kế dữ liệu/RLS, Auth, mẫu nội dung và quy trình kiểm duyệt | Đăng ký/đăng nhập, schema/migration, 1 chủ đề 25 từ đã rà soát, seed script, lựa chọn dịch vụ và hạn mức |
| 3 | Danh sách/chủ đề, flashcard, TTS, responsive | Luồng đăng nhập → chọn chủ đề → học 25 thẻ chạy trên Android/web; trạng thái lỗi và quyền cơ bản |
| 4 | 3 chủ đề còn lại, ngân hàng quiz, màn quiz | Đủ 100 từ và câu hỏi đã kiểm duyệt; quiz chạy cục bộ với dữ liệu thật; kiểm tra câu không trùng/đáp án rõ |
| 5 | Nộp quiz trên máy chủ, tiến độ, lịch ôn | Điểm tính phía máy chủ, lưu bền, đăng nhập chéo thiết bị thấy tiến độ; RLS thử bằng hai tài khoản |
| 6 | Luồng luyện nói và STT | Ghi âm, quyền mic, bản chép lời, mức khớp, retry; đo độ trễ/chi phí trên Android/web |
| 7 | Phản hồi câu viết bằng AI, hạn mức, quyền riêng tư | Phản hồi theo schema, kiểm tra nội dung/timeout, giới hạn 5 lượt/ngày, thông báo dữ liệu được gửi ra dịch vụ |
| 8 | Tích hợp, UX/accessibility, xử lý lỗi, xóa dữ liệu | Luồng trọn vẹn không gãy; kiểm tra web 360/1280 px; quy trình xóa tài khoản; đóng lỗi P0 |
| 9 | Kiểm thử hệ thống và thử với người học mới | Ma trận kiểm thử hoàn tất, thử ít nhất 5 người, ghi kết quả và sửa lỗi cản trở; chuẩn bị demo |
| 10 | Ổn định, đo chỉ số, tài liệu vận hành, demo | Bản Android cài được, web truy cập được, seed/backup nội dung, biên bản nghiệm thu và video/kịch bản demo |

## Các cổng quyết định

- **Cuối tuần 1:** nếu ghi âm/STT trên web không chạy ổn định, quyết định làm adapter web khác hoặc hạ luyện nói web xuống demo có thông báo rõ; không để rủi ro đến tuần 6.
- **Cuối tuần 2:** khóa 4 chủ đề, schema và nhà cung cấp AI/STT sau khi đo chi phí/điều khoản. Không thêm tính năng ngoài P0.
- **Cuối tuần 5:** phải có đường học không phụ thuộc AI: flashcard → quiz → tiến độ → ôn. Nếu chưa có, ưu tiên hoàn tất trước khi làm tính năng AI.
- **Cuối tuần 7:** nếu AI/STT vượt hạn mức hoặc chất lượng kém, dùng phản hồi dựa trên quy tắc cho câu viết và STT ở chế độ thử nghiệm; báo minh bạch trong demo. Không tuyên bố chấm chính xác khi chưa kiểm chứng.
- **Đầu tuần 9:** đóng phạm vi tính năng, chỉ sửa lỗi và nội dung.

## Phân rã công việc chính

| Nhóm việc | Đầu ra | Phụ thuộc |
| --- | --- | --- |
| Thiết kế UX | Wireframe 7 màn, trạng thái lỗi/không quyền/không mạng | Phạm vi và luồng học |
| Nội dung | 100 mục từ, ít nhất 40 câu hỏi/chủ đề để rút 10 câu/lượt, kiểm duyệt chéo | Schema nội dung |
| Ứng dụng | Auth, danh sách, flashcard, quiz, tiến độ, nói, viết | API và thiết kế UX |
| Backend | Migration/RLS, seed, nộp quiz, lịch ôn, Edge Functions STT/AI | Schema, tài khoản dịch vụ |
| Chất lượng | Unit test quy tắc điểm/lịch ôn, integration test quyền dữ liệu, kiểm thử thủ công Android/web, thử người dùng | Bản tích hợp theo tuần |
| Bàn giao | Hướng dẫn chạy, biến môi trường mẫu, script seed, test report, kịch bản demo | Chức năng đã đóng băng |

## Ước lượng và kiểm soát tiến độ

Với 3–4 người × 10–15 giờ × 10 tuần, tổng năng lực khoảng **300–600 giờ**, gồm cả học công nghệ, nội dung và kiểm thử. Ước lượng này là giả định cần xác nhận ở tuần 1. Mỗi tuần giữ backlog nhỏ, ghi người phụ trách, ngày dự kiến, trạng thái, bằng chứng demo và lỗi. Nếu một hạng mục P0 trễ hơn 1 tuần, bỏ P1 trước và giảm độ bóng giao diện trước khi giảm độ đúng của dữ liệu/quyền riêng tư.

## Định nghĩa hoàn thành cho một hạng mục

Mã chạy trên Android và web nếu hạng mục có giao diện; dữ liệu lỗi được xử lý; có kiểm thử phù hợp; người khác trong nhóm rà soát; tài liệu yêu cầu/API được cập nhật; có ảnh/chạy thử cho mốc tuần. Không coi việc chỉ vẽ màn hình là hoàn thành chức năng.
