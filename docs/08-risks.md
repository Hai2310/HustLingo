# 08. Rủi ro và quyết định

## Quyết định theo README

| ID | Quyết định |
| --- | --- |
| D-01 | Expo/React Native/TypeScript/Expo Router, một codebase hướng web/Android/iOS |
| D-02 | Guest-first, AsyncStorage → đăng nhập Supabase → merge/sync account |
| D-03 | Giữ Lessons/Practice/Tutor/Backend-Core và ownership Huy/Dương/Khánh/Hải |
| D-04 | Kho từ và learning data dùng chung; không nhân bản dataset giữa features |
| D-05 | Tutor UI/demo trước; STT → LLM → TTS thật ở giai đoạn tiếp theo |
| D-06 | Bản 10 tuần bàn giao các tập kỹ năng/luyện thi mẫu, không tuyên bố đủ toàn bộ A1–C1 |
| D-07 | Hai role account admin/learner; guest không có quyền account; admin UI là P1 bổ sung |
| D-08 | Deploy theo README/DEPLOYMENT: Expo export + EAS Deploy, EAS Build, Supabase Cloud |

## Sổ rủi ro

| Rủi ro | Hệ quả | Xử lý |
| --- | --- | --- |
| README rộng, màn ba features hiện còn trống | Không kịp 10 tuần | Manifest mẫu theo từng module, tích hợp hàng tuần, ưu tiên P0 trước admin/AI thật |
| Gán 10.000 từ thành nội dung “chuẩn” | Dạy từ/nghĩa/CEFR chưa kiểm chứng | Phân biệt 10.000 raw, 4.129 production, 5.871 review; duyệt tập bàn giao |
| Đường dẫn/services dự kiến bị hiểu là đã có | Thành viên import sai/chạy lệnh không tồn tại | Bản đồ hiện có và đích tổ chức lại ở tài liệu 10; kiểm tra trước khi di chuyển |
| Guest mất tiến độ khi Auth đổi account | Người học mất dữ liệu | Snapshot guest trước đổi khóa, import IDs và retry/idempotency |
| Hai thiết bị ghi đè state/cộng counters | Sai progress | Merge transaction/event IDs; không chỉ upsert snapshot hoặc cộng lượt cũ |
| Owner-update profiles cho phép đổi role/status | Tự nâng quyền | Grants theo cột hoặc bảng riêng; kiểm JWT trực tiếp, disabled status ở DB/API |
| Tiến độ client bị hiểu là kết quả xác minh | Người dùng sửa local/own progress | Ghi rõ thống kê tự luyện; entitlement/hạn mức/kết quả server tách riêng |
| OAuth redirect sai Android/web | Không đăng nhập/merge được | Thử Google/Facebook/cancel/callback sớm trên hai nền tảng |
| Quiz ảnh/audio thiếu nguồn hoặc tải lỗi | Sai câu hỏi/trải nghiệm | Kiểm license/asset, alt/fallback, đủ một đáp án |
| Tutor demo bị quảng cáo là AI thật | Hiểu sai chức năng | Nhãn demo rõ; không gửi dữ liệu dịch vụ ngoài khi chưa có runtime |
| iOS chưa có thiết bị/build kiểm thử | Tuyên bố đa nền tảng quá mức | Giữ iOS mục tiêu, công bố riêng bằng chứng kiểm thử |
| Validator chỉ kiểm H.1 trống hoặc lỗi thời | PASS giả về chức năng | Cập nhật validator khi feature bắt đầu có UI; thêm smoke/integration tests |

## Thay đổi cần theo dõi

Mọi thay đổi shared/core cần thống nhất interface giữa feature và Hải. Thêm provider AI, Storage, admin schema, subscription hoặc cổng thanh toán cần cập nhật kiến trúc/quyền/test trước khi tích hợp. Nếu phải đổi cam kết 10 tuần, sửa tài liệu 01/03/06/07 cùng lúc; README chính vẫn là cơ sở định hướng.
