# Backend / Core ownership

**Owner:** Thành viên Backend/Core.

Code backend hiện tại KHÔNG bị di chuyển để tránh làm gãy project. Phạm vi thật:
- `src/services/` — Supabase/service layer.
- `src/contexts/` — Auth/Learning state dùng chung.
- `supabase/` — migration, RLS, database.
- Auth, Guest→Account sync, progress, saved words, subscription.

Ba feature khác yêu cầu dữ liệu/backend thông qua interface/service thống nhất, không tự sửa migration.
