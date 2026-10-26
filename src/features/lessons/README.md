# Feature: Bài học

**Owner:** Huy — Bài học.

## Được code
- `screens/`: màn Bài học. Điểm vào là `LessonsScreen.tsx`.
- `components/`: component chỉ dùng cho Bài học.
- `data/`: dữ liệu lesson, grammar, listening, speaking, reading, writing và toàn bộ 10.000 vocabulary qua `vocabulary.ts`.
- `hooks/`: logic React riêng của Bài học.
- `types/`: type riêng.

## Không tự sửa
`AuthContext`, `LearningContext`, `src/services/supabase.ts`, `supabase/migrations`, `app/(tabs)/_layout.tsx`, `package.json`. Khi cần API lưu progress, thống nhất với Backend/Core.

## Hiện trạng

Tab `app/(tabs)/lessons.tsx` trỏ tới `screens/LessonsScreen.tsx`. Đã có thư viện, chủ đề và chi tiết bài từ vựng/ngữ pháp cho A1–C1. Đọc nội dung qua `src/services/learningContent.ts`; lưu tiến độ qua `LearningContext`, không truy vấn database trực tiếp từ screen.

Xem phạm vi BH-01–06, BH-11–13, luồng dữ liệu, cách tính tiến độ và kiểm tra tại [Lessons implementation](../../../docs/lessons-implementation.md).
