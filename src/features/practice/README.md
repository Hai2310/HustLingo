# Feature: Luyện tập

**Owner:** Dương ([@smileviel](https://github.com/smileviel)).

## Chức năng

| Mã | Màn | Route | File |
| --- | --- | --- | --- |
| LT-02 | Practice hub (thống kê ngắn, ôn tập hôm nay) | `/(tabs)/practice` | `screens/PracticeScreen.tsx` |
| LT-03 | Vocabulary Quiz: Anh→Việt, Việt→Anh, điền từ, trộn | `/practice/quiz` | `screens/VocabularyQuizScreen.tsx` |
| LT-05 | Ôn tập flashcard theo Spaced Repetition | `/practice/review` | `screens/ReviewScreen.tsx`, `engine/srs.ts` |
| LT-07 | Listening: phát, nghe lại, tốc độ, transcript sau khi nộp | `/practice/listening` | `screens/ListeningScreen.tsx` |
| LT-08 | Speaking: ghi âm → nghe lại → so mẫu → tự đánh giá | `/practice/speaking` | `screens/SpeakingScreen.tsx`, `components/Recorder.tsx` |
| LT-09 | Reading: đoạn văn + câu hỏi + giải thích, có câu nhiều đáp án | `/practice/reading` | `screens/ReadingScreen.tsx` |
| LT-10 | Writing: editor, đếm từ, lưu nháp, bài mẫu | `/practice/writing` | `screens/WritingScreen.tsx` |
| LT-11/12 | TOEIC & IELTS trên một exam engine chung | `/practice/exam?exam=toeic\|ielts` | `screens/ExamScreen.tsx`, `engine/exam.ts` |
| LT-13 | Result & Analytics | `/practice/result?id=…`, `/practice/analytics` | `screens/ResultScreen.tsx`, `screens/AnalyticsScreen.tsx` |
| LT-14 | Test logic | `npm run test:practice` | `scripts/test-practice.mjs` |

Các route cũ `app/quiz.tsx`, `app/flashcards.tsx`, `app/exam.tsx` vẫn chuyển về tab Luyện tập (validator H.1 yêu cầu).

## Cấu trúc

- `engine/`: logic thuần, không phụ thuộc React, có test.
  - `srs.ts`: một luật Spaced Repetition (SM-2 rút gọn) dùng chung cho quiz và flashcard. Quên → ôn lại sau 10 phút; nhớ → 1 → 3 → interval × ease ngày (tối đa 365); ≥ 21 ngày là "đã nhớ".
  - `quiz.ts`: sinh câu hỏi từ vựng, xáo đáp án, chấm chọn một/nhiều đáp án và điền từ.
  - `exam.ts`: tạo đề theo phần thi/chế độ, bấm giờ, chấm theo phần, quy đổi TOEIC/IELTS **ước lượng**.
  - `analytics.ts`: lưu/đọc dữ liệu, thống kê theo kỹ năng và dạng câu hỏi, gợi ý phần cần ôn.
- `data/`: ngân hàng Listening/Reading/Speaking/Writing (`skillBanks.ts`) và đề TOEIC/IELTS (`examBank.ts`). Câu hỏi do nhóm tự soạn theo định dạng luyện thi, không phải đề chính thức.
- `hooks/usePracticeData.ts`: lịch SRS, lịch sử kết quả, bản nháp được lưu trong AsyncStorage **theo từng tài khoản/guest**. Mỗi câu trả lời cũng gọi `LearningContext` (`recordAnswer`, `markWord`, `addMinutes`) nên số liệu chung vẫn đồng bộ Supabase như cũ.
- `components/PracticeUI.tsx`: shell, nút, câu hỏi trắc nghiệm dùng chung, thanh audio.

## Ghi chú

- Audio Listening dùng `expo-speech` (giọng đọc của thiết bị); ghi âm Speaking dùng `expo-audio`, bản ghi chỉ ở trên máy.
- Speaking/Writing là **tự đánh giá**, chưa có chấm AI.
- Câu ví dụ trong ngân hàng từ vựng hiện là câu mẫu tự sinh, nên quiz không dùng chúng cho dạng điền từ (`isTemplateExample`). Khi có câu ví dụ thật, dạng điền vào câu tự bật lại.
- `summarisePractice()` trong `engine/analytics.ts` trả về số liệu tổng hợp, có thể dùng cho trang Progress chung khi Backend/Core thống nhất.

## Không tự sửa
Backend/Auth/Supabase/layout chung. Khi cần lưu kết quả lên server, gọi API do Backend/Core thống nhất.
