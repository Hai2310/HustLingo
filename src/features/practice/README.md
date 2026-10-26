# Feature: Luyện tập

**Owner:** Thành viên Luyện tập.

## Được code
- `screens/`: Practice Hub và các màn luyện tập.
- `components/`: question, answer option, flashcard, exam timer, result...
- `data/`: toàn bộ 10.000 vocabulary, grammar/listening/reading/writing source data, practice modes, exam catalog, review config.
- `hooks/`: quiz state, timer, review queue, spaced repetition...
- `types/`: type câu hỏi/kết quả.

## Không tự sửa
Backend/Auth/Supabase/layout chung. Khi cần lưu kết quả, gọi API do Backend/Core thống nhất.

## Start
Code UI trong `screens/PracticeScreen.tsx`; tab `app/(tabs)/practice.tsx` đã trỏ tới file này.
