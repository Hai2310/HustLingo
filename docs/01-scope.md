# 01. Định hướng và phạm vi 10 tuần

## Định hướng theo README chính

HustLingo nối **học → luyện → ôn → tiến độ → đồng bộ**, sau đó mở rộng giao tiếp với gia sư AI. Người dùng mục tiêu gồm sinh viên, người học từ vựng/ngữ pháp theo A1–C1, bốn kỹ năng và TOEIC/IELTS. Sản phẩm có Home, Lessons, Practice, Tutor và Profile, xây từ một codebase Expo cho web/Android/iOS.

Bốn module vẫn giữ trách nhiệm của README: **Huy — Lessons**, **Dương — Practice**, **Khánh — Tutor**, **Hải — Backend/Core**. Các chức năng admin là phần bổ sung trong hướng này.

## Bản bàn giao đề xuất trong 10 tuần

**P0** là mốc cần hoàn thành; **P1** làm sau khi P0 ổn định. Đây là kế hoạch triển khai tối thiểu cho tầm nhìn rộng của README, không yêu cầu hoàn thiện mọi nội dung A1–C1 hoặc toàn bộ kho từ trong 10 tuần.

| Mảng | P0 trong 10 tuần | P1 / giai đoạn sau |
| --- | --- | --- |
| Guest/Core | Mở Home không ép đăng nhập, học/luyện mẫu, lưu local; email + Google/Facebook qua Supabase; chuyển và đồng bộ tiến độ tài khoản | Đồng bộ nhiều thiết bị có xử lý xung đột phức tạp |
| Lessons | Hub chọn level/topic, bài từ vựng/ngữ pháp; ít nhất một bài mẫu có thể mở/thao tác ở mỗi kỹ năng nghe/nói/đọc/viết | Lộ trình đầy đủ A1–C1, nội dung lớn có biên soạn toàn diện |
| Practice | Flashcard, quiz từ vựng/ngữ pháp, từ đã lưu, review và kết quả; một bộ TOEIC rút gọn và một bộ IELTS rút gọn minh họa timer/navigation/result | Đề thi đầy đủ và đánh giá theo chuẩn bài thi |
| Tutor | Tutor list/detail, scenario, chat/call UI, demo conversation, điều khiển trạng thái cuộc gọi | STT → LLM → TTS thật, đánh giá phát âm và phản hồi viết bằng AI |
| Tài khoản | Hồ sơ, tiến độ, feedback; hai role, chống tự nâng quyền/sửa status | Admin web quản trị nội dung và tài khoản có audit, gói Free/Plus/Pro và thanh toán |

Không đặt lại phạm vi thành ứng dụng chỉ có 4 × 25 từ. Có thể dùng một tập từ nhỏ được duyệt để kiểm thử, trong khi kho từ dùng chung và cấu trúc nhiều kỹ năng/luyện thi vẫn được giữ. Guest được làm bài luyện cục bộ; kết quả đó là thống kê tự luyện.

## Nền tảng và triển khai

Web và Android là môi trường kiểm thử bắt buộc của bản 10 tuần; iOS vẫn thuộc nền tảng mục tiêu, chỉ tuyên bố đã kiểm thử khi có thiết bị/môi trường và bằng chứng. Công nghệ triển khai theo README/DEPLOYMENT: Expo export + EAS Deploy cho web, EAS Build cho mobile và Supabase Cloud cho backend.

## Điều kiện hoàn thành

Có luồng guest → Lessons → Practice → review → đăng nhập → đồng bộ → mở lại trên thiết bị khác; Tutor demo thể hiện rõ không có AI thật; các bài kỹ năng và hai bộ luyện thi rút gọn hoạt động đúng dữ liệu mẫu. Không lộ dữ liệu account khác hoặc cho learner đổi role/status. Nội dung được duyệt theo tập bàn giao, không quảng cáo CEFR/TOEIC/IELTS chính thức. Kế hoạch và kiểm thử tại tài liệu 06/07.
