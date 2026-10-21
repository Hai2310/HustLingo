# Feature: Bài học

**Owner:** Thành viên Bài học.

## Được code
- `screens/`: màn Bài học. Điểm vào là `LessonsScreen.tsx`.
- `components/`: component chỉ dùng cho Bài học.
- `data/`: nội dung nguồn dùng để seed database; runtime lấy nội dung đã publish qua `learningContentService` trong `src/services/learningContent.ts`.
- `hooks/`: logic React riêng của Bài học.
- `types/`: type riêng.

Backend cung cấp danh sách chủ đề, lesson đã publish và nội dung của từng lesson. Xem danh sách API và kiểu trả về trong `src/services/README.md`.

## Không tự sửa
`AuthContext`, `LearningContext`, `src/services/supabase.ts`, `supabase/migrations`, `app/(tabs)/_layout.tsx`, `package.json`. Khi cần API lưu progress, thống nhất với Backend/Core.

## Start
Code UI trong `screens/LessonsScreen.tsx`; tab `app/(tabs)/lessons.tsx` đã trỏ tới file này.
