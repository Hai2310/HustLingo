# Shared data services

`learningContentService` là nguồn dữ liệu nội dung dùng chung cho tab Bài học, Luyện tập và Gia sư AI. Service chỉ trả về nội dung đã publish; RLS áp dụng trên Supabase. Mỗi method nhận query phù hợp, trả về Promise và ném lỗi Supabase lên cho hook/component xử lý. Danh sách được phân trang; `limit` mặc định là 100 và tối đa 500.

## Bài học

| Method | Nội dung |
| --- | --- |
| `getTopics({ level, limit, offset })` | Chủ đề đã publish, gồm mô tả, subtitle, icon, CEFR và màu accent. |
| `getLessons({ level, type, limit, offset })` | Danh mục lesson đã publish, không tải nội dung chi tiết. `type` là `vocabulary` hoặc `grammar`. |
| `getLessonItems(lessonId, { limit, offset })` | Từ vựng hoặc điểm grammar theo thứ tự trong lesson; grammar trả kèm ví dụ và bản dịch. |
| `getVocabulary(query)` | Từ vựng phân trang, lọc theo CEFR, chủ đề, từ tìm kiếm, exam tag hoặc danh sách ID. |
| `getGrammarPoints(query)` | Grammar phân trang, lọc theo CEFR, category, tiêu đề hoặc danh sách ID; trả kèm giải thích, ví dụ, lỗi thường gặp. |

## Luyện tập

`getPracticeContent({ skill, level, ids, limit, offset })` trả về bản ghi phân biệt theo `skill`: `listening`, `reading`, `writing` hoặc `speaking`. Mỗi bản ghi giữ đủ payload của nguồn, gồm transcript/văn bản/câu hỏi, lựa chọn và đáp án với bài trắc nghiệm; prompt và gợi ý với bài viết; câu mẫu và bản dịch với speaking.

Đáp án luyện tập hiện được tải cùng nội dung đã publish. Với bài thi cần chống xem trước đáp án, việc chấm điểm và trả kết quả phải chuyển sang backend trước khi dùng cho kỳ thi thật.

## Gia sư AI

| Method | Nội dung |
| --- | --- |
| `getTutors({ limit, offset })` | Hồ sơ gia sư đã publish. |
| `getTutorScenarios({ tutorId, level, limit, offset })` | Tình huống, kèm hồ sơ gia sư. |
| `getTutorScenarioMessages(scenarioId)` | Hội thoại mẫu theo thứ tự. |
| `getTutorScenarioBundle(scenarioId)` | Tình huống, hồ sơ gia sư và hội thoại mẫu trong một lần gọi; trả `null` nếu không có tình huống đã publish. |

Các method nội dung không cần người dùng đăng nhập. Dữ liệu đọc bằng `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; không dùng secret/service-role key ở app. `supabaseData` vẫn dành cho hồ sơ, tiến độ học và feedback gắn với tài khoản.

Catalog Gia sư chỉ cấp persona, tình huống và hội thoại mẫu. Để tạo phản hồi AI trực tiếp, gọi backend/Edge Function có giữ kín khóa nhà cung cấp; không gọi model bằng secret từ Expo.
