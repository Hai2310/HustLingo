# Feature: Luyện tập

**Owner:** Thành viên Luyện tập.

## Được code
- `screens/`: Practice Hub và các màn luyện tập.
- `components/`: question, answer option, flashcard, exam timer, result...
- `data/catalog.ts`: đọc bài đã xuất bản từ `practice_content` và `grammar_exercises` qua Supabase. Nghe, Đọc, Viết và Nói có bộ bài dự phòng đi kèm ứng dụng. Ngữ pháp tải theo trang và hiển thị nguồn, giấy phép của từng câu.
- `hooks/`: quiz state, timer, review queue, spaced repetition...
- `types/`: type câu hỏi/kết quả.

## Không tự sửa
Backend/Auth/Supabase/layout chung. Khi cần lưu kết quả, gọi API do Backend/Core thống nhất.

## Start
Code UI trong `screens/PracticeScreen.tsx`; tab `app/(tabs)/practice.tsx` đã trỏ tới file này.

Màn làm bài nằm ở `screens/PracticeExerciseScreen.tsx`. Kết quả trắc nghiệm cộng vào thống kê học tập chung. Bản nháp bài Viết lưu trên thiết bị theo tài khoản và bài. Bản ghi âm bài Nói dùng để nghe lại trong bài hiện tại.
