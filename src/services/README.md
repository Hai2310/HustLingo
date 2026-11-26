# Service nội dung và tài khoản

## Loader ưu tiên cho Lessons

`learningContent.ts` là luồng dữ liệu chính của feature Bài học. Khi có cấu hình Supabase, loader lấy danh mục đã publish từ cloud; khi Supabase lỗi, chưa cấu hình hoặc catalog cloud rỗng, nó dùng catalog local. Nội dung bài chỉ tải các từ vựng/điểm grammar mà bài cần, có cache và fallback local khi dữ liệu local tương ứng tồn tại.

`LessonsScreen`, `TopicDetailScreen` và `LessonDetailScreen` tiếp tục dùng `loadLessonCatalog`, `loadLessonContent` và `peekLessonCatalog`. Đây là luồng giữ nguyên type, dữ liệu local và thông báo offline của project.

## API cloud dùng chung

`learningContentApi.ts` cung cấp `learningContentService` cho các feature cần truy vấn Supabase theo trang. API này cần URL Supabase và publishable key; chỉ đọc dữ liệu đã publish và ném lỗi để caller xử lý. Mặc định mỗi trang có 100 dòng, tối đa 500. Có thể import từ `@/services/learningContent` hoặc `@/services`.

| Mảng | Methods |
| --- | --- |
| Nội dung bài học | `getTopics`, `getLessons`, `getLessonItems`, `getVocabulary`, `getGrammarPoints`, `getGrammarExercises` |
| Luyện tập | `getPracticeContent` |
| Catalog gia sư | `getTutors`, `getTutorScenarios`, `getTutorScenarioMessages`, `getTutorScenarioBundle` |

API cloud bổ sung cho loader Lessons, không thay thế loader đó. Payload luyện tập có đáp án để tự học; không dùng đáp án client-readable cho bài thi cần kết quả xác minh từ server.

## Dữ liệu tài khoản

`supabaseData.ts` xử lý hồ sơ, tiến độ và góp ý của tài khoản đã đăng nhập. API này cần phiên Supabase hợp lệ. Chỉ dùng `EXPO_PUBLIC_SUPABASE_URL` và `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` trong app; provider API key và service-role credentials phải nằm phía server.
