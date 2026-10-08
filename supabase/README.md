# HustLingo Supabase

HustLingo 1.1 không cần Express, PostgreSQL tự host, Docker hoặc Docker Compose.
Supabase cung cấp:

- Auth: email/password, Google, Facebook.
- PostgreSQL hosted.
- Row Level Security (RLS).
- Profile, learning progress, feedback.

Schema nằm trong `migrations/202610050001_init_hustlingo.sql`.

## Cách nhanh nhất

1. Tạo project tại Supabase Dashboard.
2. Mở SQL Editor.
3. Copy toàn bộ migration và Run.
4. Project Settings / Connect: copy Project URL và Publishable key vào `.env`.
5. Authentication -> Providers: bật Google và Facebook.
6. Authentication -> URL Configuration: thêm redirect URL của app.

Không đưa `service_role` key vào app Expo.
