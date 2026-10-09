# 06. Kế hoạch triển khai 10 tuần

## Phân công theo README

| Thành viên | Phần việc chính |
| --- | --- |
| Huy | Lessons Hub, level/topic/lesson, vocabulary/grammar và bài kỹ năng mẫu tại `src/features/lessons/` |
| Dương | Practice Hub, quiz/flashcard/review, bài luyện kỹ năng và TOEIC/IELTS rút gọn tại `src/features/practice/` |
| Khánh | Tutor list/detail/scenario, chat/call UI, demo conversation tại `src/features/tutor/` |
| Hải | Auth, guest/account sync, schema/RLS, services/context/core, build/deploy; điều phối admin P1 |

Shared/core đổi theo interface nhóm thống nhất. Mỗi tuần tích hợp một bản chạy; từng module dùng dữ liệu chung và trạng thái loading/empty/error/normal/completed. Không đồng nghĩa toàn bộ A1–C1 hay dữ liệu 10.000 từ đã được biên soạn đủ.

## Mốc đề xuất

| Tuần | Công việc song song | Bàn giao |
| --- | --- | --- |
| 1 | Chạy Expo Android/web; kiểm kê routes trống, schemas/data; thống nhất UI và contracts | Mỗi thành viên chạy cùng repo; manifest nội dung mẫu và ma trận P0/P1 |
| 2 | Hải sửa role/status/RLS và Auth; Huy/Dương dựng hubs; Khánh dựng tutor/scenario | Learner không tự nâng role; guest vào 3 module; không lộ dữ liệu chéo |
| 3 | Vocabulary/grammar lessons, flashcard/quiz; Tutor detail/chat demo; thử OAuth | Một topic từ Lessons sang Practice; chat demo; email/Google/Facebook callback có bằng chứng |
| 4 | Bài listening/speaking/reading/writing mẫu và practice tương ứng; saved words; call UI | Mỗi kỹ năng có một tập mẫu thao tác được; call có nhãn demo và nút điều khiển |
| 5 | Review 1/3/7, result/progress; tập TOEIC/IELTS rút gọn; merge contract và event IDs | Cấp câu ôn trước khi nộp; hai bộ luyện thi có timer/navigation/result |
| 6 | Guest snapshot/import, retry/idempotency, cloud sync; tích hợp các modules | Đăng nhập sau guest không mất tiến độ hoặc nhập lặp; account khác không nhận dữ liệu cũ |
| 7 | Thử đồng bộ hai thiết bị, offline và OAuth cancellation; nội dung/ảnh quiz/accessibility | Android và web dùng cùng account thấy state đúng; ảnh hỏng có fallback |
| 8 | Ổn định P0, feedback/xóa dữ liệu, Expo export/EAS build; admin P1 nếu P0 đạt | Bản thử web/mobile, checklist triển khai; admin draft/publish/account nếu đã làm |
| 9 | Kiểm thử hệ thống/RLS/sync, thử với ít nhất 5 người; sửa lỗi | Ma trận tài liệu 07 có bằng chứng; 4/5 người tự hoàn thành một lesson + practice |
| 10 | Đóng băng nội dung, sửa lỗi cuối, demo/biên bản, hướng dẫn vận hành | Bản Android/web; Tutor demo rõ; trạng thái iOS và P1 chưa làm được công bố |

## Cổng kiểm soát

Cuối tuần 3 phải có một luồng Lessons → Practice và Auth chạy. Cuối tuần 6 phải có guest → account sync; nếu chưa đạt, dừng mở rộng nội dung và P1 để sửa luồng này. Tuần 8 chỉ bắt đầu admin P1 khi P0 có smoke test đạt. AI runtime thật, thanh toán và đề/lộ trình đầy đủ chỉ sau khi P0 ổn định; không thay demo bằng lời tuyên bố AI thật.

## Bàn giao và phụ thuộc

Backend/Core công bố typed contract trước khi UI tích hợp. Lessons và Practice cùng dùng ID từ/topic/lesson và version nội dung. Tutor dùng scenario/demo data riêng cùng theme. Nội dung/asset có người duyệt; bảng tổng hợp manifest giúp kiểm thử biết bài nào nằm trong bản demo. Trạng thái đã có, đang làm và roadmap phải được ghi rõ trong biên bản tuần.
