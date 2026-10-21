# HustLingo Supabase

HustLingo 1.1 không cần Express, PostgreSQL tự host, Docker hoặc Docker Compose.
Supabase cung cấp:

- Auth: email/password, Google, Facebook.
- PostgreSQL hosted.
- Row Level Security (RLS).
- Profile, learning progress, feedback.
- Danh mục nội dung: chủ đề, từ vựng, grammar và lesson liên kết.

Schema nằm trong các file `migrations/`. Migration nội dung là
`migrations/202610160001_content_catalog.sql`.

## Cách nhanh nhất

1. Tạo project tại Supabase Dashboard.
2. Mở SQL Editor.
3. Chạy lần lượt các migration trong `migrations/`.
4. Project Settings / Connect: copy Project URL và Publishable key vào `.env`.
5. Authentication -> Providers: bật Google và Facebook.
6. Authentication -> URL Configuration: thêm redirect URL của app.

Không đưa `service_role` key vào app Expo.

## Quan hệ dữ liệu

```mermaid
erDiagram
  AUTH_USERS ||--|| PROFILES : has
  AUTH_USERS ||--|| LEARNING_PROGRESS : owns
  AUTH_USERS ||--o{ FEEDBACK : sends
  TOPICS ||--o{ VOCABULARY_ENTRIES : groups
  TOPICS ||--o{ LESSONS : organizes
  GRAMMAR_POINTS ||--o{ GRAMMAR_EXAMPLES : demonstrates
  LESSONS ||--o{ LESSON_ITEMS : contains
  VOCABULARY_ENTRIES ||--o{ LESSON_ITEMS : included_in
  GRAMMAR_POINTS ||--o{ LESSON_ITEMS : included_in
```

## Nhập dữ liệu học tập

Sau khi đã chạy migration nội dung, nhập dữ liệu hiện có từ project bằng Node:

Có thể dùng `.env` hiện có hoặc tạo file `.env.backend.local` ở thư mục gốc project (cả hai đều được Git ignore). Với file riêng cho backend, thêm:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_SECRET_KEY
```

Trên Linux/macOS, giới hạn quyền đọc file rồi chạy importer:

```sh
# Chọn một dòng khớp với file đang giữ secret:
chmod 600 .env
# hoặc: chmod 600 .env.backend.local
npm run db:seed:content
```

Importer đọc `SUPABASE_URL` và `SUPABASE_SECRET_KEY` từ file backend này (hoặc environment của terminal), không đọc hay in key ra log. Nếu project chỉ còn legacy key, script cũng chấp nhận `SUPABASE_SERVICE_ROLE_KEY`. Nó đọc `src/data/vocabulary-en.json` và `src/features/lessons/data/grammar.ts`, rồi upsert theo lô. Nó đưa vào đủ 10.000 từ vựng, 98 điểm grammar cùng ví dụ; các bản production được công khai, còn bản review được lưu ở trạng thái riêng tư nhờ RLS. Nó tạo lesson từ từng điểm grammar và nhóm từ vựng theo chủ đề/trình độ. Có thể chạy lại sau khi cập nhật dữ liệu nguồn.

Lấy Project URL ở nút Connect của project; lấy secret key trong Settings → API Keys. Dùng key `sb_secret_...` cho importer. Secret key có quyền cao, bỏ qua RLS; chỉ giữ trong file local bị ignore hoặc môi trường backend, không gửi qua chat, không thêm tiền tố `EXPO_PUBLIC_`, không commit và không đưa vào app Expo. Publishable key của app vẫn là biến `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Migration cấp quyền đọc nội dung đã publish cho anon/authenticated, còn client không có quyền sửa nội dung.

Màn hình Lessons ưu tiên tải grammar đã publish từ Supabase khi app có cấu hình; nếu chưa cấu hình, chưa nhập dữ liệu hoặc đang offline thì dùng bộ grammar đóng gói làm dự phòng. `supabaseData.getVocabulary()` cung cấp truy vấn từ vựng phân trang/lọc để nối vào màn hình từ vựng.
