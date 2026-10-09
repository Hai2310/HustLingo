# 07. Kiểm thử và nghiệm thu

## Môi trường

Ứng dụng Expo trên Android thật/emulator và web ở 360/768/1280 px, Supabase project thử có migration/RLS giống demo, ít nhất learner A/B và admin. iOS có mục ghi riêng thiết bị/build/kết quả khi thử được; không suy ra iOS đạt từ Android/web. Prototype HTML cũ chỉ tham khảo UX, không chứng minh chức năng sản phẩm.

## Ma trận P0

| ID | Yêu cầu | Ca kiểm và kết quả mong đợi |
| --- | --- | --- |
| TC-01 | FR-01 | Guest mở Home/3 module, học/lưu từ/làm bài, đóng/mở lại; local tồn tại, không ép Auth |
| TC-02 | FR-02 | Email/password, Google, Facebook; OAuth hủy/lỗi, callback Android/web, mở lại session; đúng account, guest được giữ khi thất bại |
| TC-03 | FR-03 | Guest đăng nhập, import hai lần, mất mạng giữa import, đổi account; không nhân đôi lượt hoặc tự chuyển snapshot cho account khác |
| TC-04 | FR-04/05 | Level/topic/lesson vocabulary/grammar và bốn kỹ năng mẫu; nội dung/asset đúng, dữ liệu quarantine không đi vào tập bàn giao |
| TC-05 | FR-06 | Quiz đúng/sai, ảnh con hổ, ảnh hỏng, giải thích; một đáp án đúng, fallback cùng đáp án, điểm tự luyện rõ |
| TC-06 | FR-07 | Mở review, nhận câu/options, nộp; lịch 1/3/7 và retry đúng, không tạo hai lượt từ một thao tác |
| TC-07 | FR-08 | TOEIC/IELTS rút gọn: timer, next/back, nộp/hết giờ, result; câu/nút đúng, không quảng cáo điểm thi chuẩn |
| TC-08 | FR-09 | Tutor list/detail/scenario/chat/call, demo messages, kết thúc; nhãn demo và không gọi nhà cung cấp AI |
| TC-09 | FR-10 | Học Android, sync, mở web; cùng account thấy đúng ID/lượt/counters; thử đồng thời và offline, không mất update hoặc báo sai đã sync |
| TC-10 | FR-11/NFR-02 | JWT learner A đọc/sửa B, sửa role/status của mình qua Data API, token account disabled; DB/API từ chối, không có service key trong bundle |
| TC-11 | FR-12 | Update profile/feedback/xóa account thử; đúng chủ sở hữu, input hợp lệ, quy trình xóa có bằng chứng |
| TC-12 | NFR-01/03/04/05 | Loading/empty/error/completed, chữ lớn/screen reader, ảnh/audio, responsive và đo 5 lượt; không che nút, có retry, ghi trung vị |

## P1 và roadmap

Admin P1: learner/guest không đọc draft hoặc gọi admin API; admin tạo/sửa/publish/ẩn nội dung, khóa/mở/reset/cấp/hạ role, hành động có audit và bảo vệ admin cuối. Nếu chưa làm, ghi rõ chưa nghiệm thu P1.

Chế độ kết quả server tương lai: start_quiz/start_review phải cấp câu trước submit; không lộ đáp án và không ghi trực tiếp được bảng kết quả; một session chỉ chấm một lần. AI thật: hạn mức/secrets/schema/errors và xóa audio phải được thử riêng, không lấy Tutor demo làm bằng chứng. Subscription trả phí cần entitlement do server xác nhận.

## Kiểm tra tự động và giới hạn hiện tại

`npm run typecheck` kiểm TypeScript sau khi cài dependency. `npm run validate` kiểm các invariant của repo và không còn coi Tutor là màn trống. Tutor cần smoke/integration test riêng cho navigation, local fallback, Edge Function, ownership và lỗi provider. `node scripts/validate-vocabulary-production.mjs` kiểm raw IDs/quality/labels và số lượng.

`validate-team-structure.mjs` hiện tìm IDs trong file TS trong khi payload ở JSON; `validate-learning-data.mjs` và các validator theo kỹ năng trong README là mục tiêu chưa có. Không ghi các lệnh đó là gate đã chạy thành công. Unit tests đề xuất cho scoring/review/merge idempotency, integration JWT/RLS và sync hai máy; UI smoke theo ma trận trên.

## Nghiệm thu

P0 TC-01 đến TC-12 đạt hoặc có sai lệch hiệu năng được ghi và giải thích; không còn lỗi mất dữ liệu/sai quyền/crash ở luồng chính. Ít nhất 5 người ngoài nhóm thử một lesson + practice, mục tiêu 4/5 tự hoàn thành. Biên bản ghi commit/build, nền tảng, manifest nội dung, các ca đạt/chưa đạt, trạng thái P1/iOS và giới hạn dữ liệu/demo AI.
