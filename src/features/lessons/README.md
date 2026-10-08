# Feature: Bài học

**Owner:** Thành viên Bài học.

## Được code
- `screens/`: màn Bài học. Điểm vào là `LessonsScreen.tsx`.
- `components/`: component chỉ dùng cho Bài học.
- `data/`: dữ liệu lesson, grammar, listening, speaking, reading, writing và toàn bộ 10.000 vocabulary qua `vocabulary.ts`.
- `hooks/`: logic React riêng của Bài học.
- `types/`: type riêng.

## Không tự sửa
`AuthContext`, `LearningContext`, `src/services/supabase.ts`, `supabase/migrations`, `app/(tabs)/_layout.tsx`, `package.json`. Khi cần API lưu progress, thống nhất với Backend/Core.

## Start
Code UI trong `screens/LessonsScreen.tsx`; tab `app/(tabs)/lessons.tsx` đã trỏ tới file này.
