# Ghi chú thuyết trình: Thiết kế Backend HustLingo

## Bản deck mở rộng

Deck `HustLingo_Backend_Comprehensive.pptx` mở rộng bản HUST 4:3 lên 17 slide, thêm mục lục, API service, hai slide tra cứu chi tiết toàn bộ bảng, cấu hình triển khai và roadmap. File nguồn được giữ nguyên. Slide API phân biệt service client-side với REST API do PostgREST cung cấp; không mô tả các hàm TypeScript như endpoint server tự viết.

## Thông điệp chính

HustLingo không tự vận hành một máy chủ API riêng. Ứng dụng Expo gọi Supabase qua SDK: Supabase Auth quản lý danh tính, PostgREST cung cấp truy vấn PostgreSQL và Row Level Security (RLS) kiểm soát dữ liệu. Nội dung học là catalog dùng chung; hồ sơ và tiến độ gắn với tài khoản. Tiến độ được ghi local trước, sau đó đồng bộ cloud theo cơ chế debounce. Đây là bản demo có kiến trúc rõ ràng, nhưng hàng đợi offline và backend gọi mô hình AI chưa được triển khai.

## Danh sách thành viên

- Hoàng Minh Hải — 20235072
- Nguyễn Quang Huy — 20230039
- Hoàng Đức Khánh — 20235117
- Nguyễn Tùng Dương — 20230024

## 1. Kiến trúc tổng quan

Người dùng chạy cùng ứng dụng Expo trên web hoặc thiết bị di động. Context quản lý trạng thái ứng dụng; lớp `src/services/learningContent.ts` là đường đọc catalog đã xuất bản, còn `src/services/supabaseData.ts` là đường đọc/ghi dữ liệu cá nhân như profile, tiến độ và feedback. Supabase Auth cấp session, PostgREST gửi truy vấn đến PostgreSQL, còn RLS quyết định hàng nào người dùng được đọc hoặc sửa. `AsyncStorage` hỗ trợ tiến độ khách và dữ liệu tiến độ local.

Đường nhập nội dung tách khỏi ứng dụng client: dữ liệu được chuẩn bị trong các nguồn JSON/TypeScript rồi nạp qua `scripts/import-content.mjs`. Khóa service role chỉ được dùng trong môi trường nhập phía server/local đáng tin cậy; không đưa khóa này vào bundle Expo.

## 2. Thiết kế dữ liệu

Miền tài khoản gồm `auth.users`, `profiles`, `learning_progress` và `feedback`. `profiles.id` tham chiếu trực tiếp tới `auth.users.id`; tiến độ dùng `user_id` làm khóa chính và khóa ngoại tới tài khoản; feedback có mã riêng và `user_id` để liên kết người gửi. Trigger `handle_new_user` tạo profile và bản ghi tiến độ khi tài khoản Supabase Auth mới được tạo.

Miền nội dung học gồm `topics`, `vocabulary_entries`, `lessons`, `lesson_items`, `grammar_points`, `grammar_examples`, `grammar_exercises`, `practice_content`, `ai_tutors`, `tutor_scenarios` và `tutor_scenario_messages`. Một chủ đề có thể chứa nhiều từ vựng và nhiều bài học. `lesson_items` liên kết bài với từng mục học và ràng buộc để một dòng chỉ trỏ đến từ vựng hoặc điểm ngữ pháp. Một điểm ngữ pháp có nhiều ví dụ; bài tập cloze lưu nguồn và đáp án riêng; practice lưu payload theo kỹ năng; tutor liên kết đến scenario rồi hội thoại mẫu. Khóa ngoại và quy tắc xóa giúp dữ liệu liên quan không bị mồ côi.

Tiến độ hiện lưu trong một cột JSONB để cập nhật trạng thái học thuận tiện cho demo: danh sách ID, số câu đúng/tổng câu và số phút học trong ngày. Đổi lại, truy vấn phân tích theo từng sự kiện hoặc xử lý cập nhật đồng thời sẽ khó hơn mô hình event/row chuyên biệt.

## 3. Xác thực và bảo mật

Supabase Auth hỗ trợ Google OAuth và email/password. Trên web, ứng dụng dùng PKCE cho callback; session được lưu bền trên client bằng adapter lưu trữ của Expo. Sau khi xác thực, SDK gửi access token; Postgres dùng `auth.uid()` để áp dụng policy.

Policy của `profiles` và `learning_progress` giới hạn người đăng nhập vào đúng `id` hoặc `user_id` của mình. Catalog dùng chung chỉ cho phép đọc những dòng có `is_published = true`. Client chỉ cần publishable key vì đó là khóa dành cho môi trường public và quyền thực tế vẫn do RLS giới hạn. Service role có thể vượt qua RLS nên phải giữ ở phía nhập liệu, không nhúng vào ứng dụng.

## 4. Đồng bộ và hoạt động khi mất mạng

Khi người dùng là guest, tiến độ giữ trong AsyncStorage. Khi có tài khoản, ứng dụng đọc bản local và gọi `getProgress()` để lấy bản cloud; `mergeProgress()` hợp các danh sách ID để không mất mục đã học/lưu/hoàn tất. Bản hợp nhất được ghi lại local. Mỗi thay đổi tiếp theo reset bộ đếm debounce 1,2 giây rồi gọi `putProgress()` để upsert JSONB theo user.

Ứng dụng vì thế có thể giữ một phần trải nghiệm tiến độ khi mất kết nối, nhưng chưa phải cơ chế đồng bộ offline bền vững. Lỗi `putProgress()` hiện bị bắt và bỏ qua; không có outbox lưu các thay đổi chưa đồng bộ, retry có backoff, hay báo trạng thái đồng bộ. Hai thiết bị cập nhật đồng thời có thể ghi đè nhau; dùng `Math.max` khi hợp số đếm tránh giảm số nhưng có thể làm mất các lượt tăng độc lập. Catalog chưa có cache offline riêng.

Hướng cải tiến phù hợp: ghi từng thay đổi vào outbox local với ID idempotent; thử lại khi online với exponential backoff; gửi các sự kiện qua RPC/Edge Function để cập nhật nguyên tử; bổ sung `updated_at`/version và chính sách xử lý xung đột. Với nội dung, cache các trang đã đọc cùng version/TTL và làm rõ trạng thái offline trong UI.

## 5. Pipeline nội dung

Quy trình gồm chuẩn bị dataset, validate/chuẩn hóa, upsert theo lô bằng script import, đặt `is_published`, rồi ứng dụng truy vấn theo cấp độ/chủ đề/loại nội dung với phân trang. Tách cờ publish khỏi dữ liệu giúp người biên tập có thể nhập nội dung trước khi công khai. RLS bảo đảm client chỉ đọc phần đã xuất bản.

Ảnh Supabase Studio đã gửi hiển thị ước tính 10.000 từ vựng, 15 chủ đề, 98 điểm ngữ pháp, 196 ví dụ ngữ pháp, 169 bài học và 4.227 lesson_items. Đây là số ước tính UI của Studio tại thời điểm ảnh được chụp, không phải số liệu truy vấn đếm chính xác.

Các file migration cho catalog Practice/Tutor và `grammar_exercises` tồn tại trong repo. Không khẳng định các bảng mới hoặc dataset mới đã có trên Supabase từ ảnh cũ; cần xác nhận migration đã được chạy và importer đã seed dữ liệu trên project thật.

## 6. Trạng thái hiện thực hóa

Đã có trong code: Supabase client, đăng nhập, tạo/đọc hồ sơ, đọc catalog published, đọc/ghi tiến độ theo người dùng, feedback, lưu tiến độ khách local và service query cho catalog practice/tutor. Schema Practice/Tutor và `grammar_exercises` có trong migration repo; trạng thái áp dụng trên remote phải kiểm tra lại.

Phần chưa nên trình bày như đã hoàn thành: các tab Bài học/Luyện tập/Gia sư AI đang được để giao diện trống theo yêu cầu; có data service không đồng nghĩa UI đã nối xong. Gia sư hiện có dữ liệu tutor/scenario mẫu trong thiết kế catalog nhưng chưa có API backend gọi LLM, quản lý khóa provider hoặc lưu lịch sử hội thoại hoàn chỉnh.

## Nguồn trong repository

- `src/contexts/AuthContext.tsx`
- `src/contexts/LearningContext.tsx`
- `src/services/supabase.ts`
- `src/services/supabaseData.ts`
- `src/services/learningContent.ts`
- `supabase/migrations/202610050001_init_hustlingo.sql`
- `supabase/migrations/202610160001_content_catalog.sql`
- `supabase/migrations/202610210001_practice_tutor_catalogs.sql`
- `supabase/migrations/202610210002_grammar_exercise_catalog.sql`
- `scripts/import-content.mjs`
