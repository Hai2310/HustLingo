# Feature: Luyện tập

**Owner:** Thành viên Luyện tập.

## Được code
- `screens/`: Practice Hub và các màn luyện tập.
- `components/`: question, answer option, flashcard, exam timer, result...
- `data/`: cấu hình hiển thị như practice modes, exam catalog và review config. Nội dung vocabulary, grammar và bài luyện đã publish được lấy qua `learningContentService` trong `src/services/learningContent.ts`.
- `hooks/`: quiz state, timer, review queue, spaced repetition...
- `types/`: type câu hỏi/kết quả.

## Không tự sửa
Backend/Auth/Supabase/layout chung. Khi cần lưu kết quả, gọi API do Backend/Core thống nhất.

## Start
Code UI trong `screens/PracticeScreen.tsx`; tab `app/(tabs)/practice.tsx` đã trỏ tới file này.

Xem danh sách phương thức và bộ lọc dữ liệu trong `src/services/README.md`.
