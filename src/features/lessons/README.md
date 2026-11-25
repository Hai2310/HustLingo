# Feature: Bài học

**Owner:** Huy — Bài học.

## Được code
- `screens/`: màn Bài học. Điểm vào là `LessonsScreen.tsx`.
- `components/`: component chỉ dùng cho Bài học.
- `data/`: nội dung nguồn dùng để seed database; runtime lấy nội dung đã publish qua `learningContentService` trong `src/services/learningContent.ts`.
- `hooks/`: logic React riêng của Bài học.
- `types/`: type riêng.

Backend cung cấp danh sách chủ đề, lesson đã publish và nội dung của từng lesson. Xem danh sách API và kiểu trả về trong `src/services/README.md`.

Điểm ngữ pháp trong giáo trình dùng `learningContentService.getGrammarPoints()`;
ngân hàng bài điền khuyết 27.514 câu được phân trang qua
`learningContentService.getGrammarExercises({ topic, limit, offset })`. Bộ bài tập
được giữ nguyên ngôn ngữ và nội dung nguồn, chỉ dùng cho demo phi thương mại; xem
`supabase/seed/GRAMMAR_DATASET_ATTRIBUTION.md` trước khi hiển thị hoặc phân phối.

## Không tự sửa
`AuthContext`, `LearningContext`, `src/services/supabase.ts`, `supabase/migrations`, `app/(tabs)/_layout.tsx`, `package.json`. Khi cần API lưu progress, thống nhất với Backend/Core.

## Hiện trạng

Tab `app/(tabs)/lessons.tsx` trỏ tới `screens/LessonsScreen.tsx`. Đã có thư viện, chủ đề và chi tiết bài từ vựng/ngữ pháp cho A1–C1. Đọc nội dung qua `src/services/learningContent.ts`; lưu tiến độ qua `LearningContext`, không truy vấn database trực tiếp từ screen.

Xem phạm vi BH-01–06, BH-11–13, luồng dữ liệu, cách tính tiến độ và kiểm tra tại [Lessons implementation](../../../docs/lessons-implementation.md).
