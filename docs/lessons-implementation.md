# Lessons — triển khai cho Huy

Phạm vi đợt này: BH-01 đến BH-06 và BH-11 đến BH-13 trong bảng công việc. Các màn nằm trong `src/features/lessons`; tiếp tục dùng Expo, React Native, TypeScript, Expo Router và Supabase theo kiến trúc hiện tại.

## Chức năng

| Mã | Kết quả triển khai |
| --- | --- |
| BH-01 | Giữ tab Bài học, thêm thư viện bài học vào vùng nội dung; giữ cấu trúc tab dùng chung. |
| BH-02 | Điều hướng thư viện → chủ đề → bài học; có nút Back, mở trực tiếp bằng URL và xử lý ID không tồn tại. Các đường dẫn Vocabulary/Grammar từ Home đi đến nội dung tương ứng. |
| BH-03 | Lọc A1, A2, B1, B2, C1 cho toàn bộ thư viện và từng chủ đề; kết hợp tìm kiếm và loại bài. Nội dung học là tiếng Anh, nghĩa và giải thích tiếng Việt được giữ để hỗ trợ người học. |
| BH-04 | University, Family, Travel, Technology, Career và các chủ đề trong kho hiện có. Mỗi chủ đề tính tiến độ từ các bài thuộc chủ đề đó. |
| BH-05 | Từ, IPA, loại từ, nghĩa, câu ví dụ, bản dịch ví dụ, phát âm bằng `expo-speech`, lưu từ và đánh dấu đã học; chia 12 từ mỗi trang. |
| BH-06 | Công thức, giải thích, ví dụ và lỗi thường gặp; chia thành ba phần có thể chuyển qua lại. Dữ liệu nằm ngoài screen. |
| BH-11 | Lưu từng bước học, phần trăm, bài hoàn thành và từ đã học. Khách lưu trên thiết bị; tài khoản đồng bộ vào `learning_progress.state`. |
| BH-12 | Có Loading, Empty, Error, Completed; có thử lại, báo khi dùng bản dữ liệu có sẵn và xử lý bài/chủ đề không tồn tại. |
| BH-13 | Lưới chủ đề thay đổi theo chiều rộng, nội dung có giới hạn chiều rộng trên web; hiệu ứng hiện nội dung và chuyển phần nhẹ, tôn trọng lựa chọn giảm chuyển động của thiết bị. |

## Đường dẫn và mã nguồn

- `/lessons`: tab thư viện, `screens/LessonsScreen.tsx`.
- `/lessons/topics/[topicId]`: danh sách và tiến độ chủ đề, `screens/TopicDetailScreen.tsx`.
- `/lessons/[lessonId]`: bài từ vựng hoặc ngữ pháp, `screens/LessonDetailScreen.tsx`.
- `src/services/learningContent.ts`: đọc danh mục và nội dung đã xuất bản từ Supabase, có thời gian chờ và bản dự phòng local.
- `data/catalog.ts`: ánh xạ chủ đề, tạo thư viện local và tính tiến độ.
- `components/VocabularyLesson.tsx`, `components/GrammarLesson.tsx`: hiển thị từng dạng bài.
- `src/utils/learningProgress.ts`: chuẩn hóa, hợp nhất tiến độ và chuyển dữ liệu khách sang tài khoản.
- `src/contexts/LearningContext.tsx`: lưu thiết bị, đồng bộ và cung cấp trạng thái lưu cho UI.

University dùng ID `education`; Career dùng ID `workplace`. Giữ các ID hiện có để nội dung và tiến độ khớp database. Những bài ngữ pháp chưa có `topic_id` được trình bày trong nhóm **Grammar essentials**; đây là nhóm giao diện, không tạo thêm bản ghi trong database.

## Dữ liệu và cách tính tiến độ

Ưu tiên đọc các bảng `topics`, `lessons`, `lesson_items`, `vocabulary_entries`, `grammar_points`, `grammar_examples`. Chỉ lấy nội dung đã xuất bản; từ vựng còn phải đang hoạt động và đạt mức `production`.

Kho local vẫn xuất phát từ 10.000 bản ghi hiện có, nhưng thư viện học chỉ dùng 4.129 từ đạt `production` và 98 điểm ngữ pháp A1–C1. Các bản ghi cần rà soát không đưa vào bài học. Khi đọc cloud thất bại, có thể dùng bản local khớp ID và thông báo rõ trên màn hình. Nếu bài mới chưa có bản local đầy đủ, hiển thị lỗi để thử lại; không cắt bớt nội dung rồi tính hoàn thành sai. Cơ chế này hỗ trợ khi mất kết nối sau khi app đã mở, không phải cài đặt một PWA để khởi động hoàn toàn offline.

Mỗi từ là một bước; mỗi điểm ngữ pháp có ba bước: quy tắc, ví dụ, lỗi thường gặp. Đánh dấu từ đã học là xác nhận đã xem nội dung, chưa phải kết luận đã thành thạo. Hoàn thành đủ bước thì bài đạt 100%. Tiến độ chủ đề là số bước đã học chia cho tổng số bước của các bài đang được lọc trong chủ đề đó. Chuyển bộ lọc không xóa lịch sử học.

Ví dụ phần mở rộng được lưu trong `learning_progress.state`:

```json
{
  "studiedWordIds": ["word-id"],
  "completedLessonIds": [],
  "lessonProgress": {
    "lesson-id": {
      "completedSteps": ["word:word-id"],
      "lastStepId": "word:word-id",
      "updatedAt": "2026-10-26T08:00:00.000Z"
    }
  }
}
```

Đây là phần bổ sung cho cấu trúc state hiện có; các trường cũ được giữ. Không cần thay bảng hoặc chạy migration.

Khách dùng khóa `hustlingo_learning_state_v1:guest-local` trong AsyncStorage. Mỗi tài khoản dùng khóa riêng theo user ID. Khi đăng nhập, tiến độ khách được ghi nhận cho một tài khoản, lưu vào vùng local của tài khoản đó rồi mới xóa bản khách. Bản ghi chuyển dở có thể được tiếp tục khi mở lại app. Tiến độ tài khoản hợp nhất các bước đã học từ local và cloud, rồi tự đồng bộ sau khoảng 1,2 giây. Nếu lỗi mạng, vẫn giữ bản local và cho phép bấm thử lưu lại. Việc ghi cloud kiểm tra user ID để tránh dùng nhầm dữ liệu khi đổi tài khoản.

## Kiểm tra

Chạy `npm run check`: kiểm tra cấu trúc, TypeScript và 12 bài kiểm thử cho danh mục, tiến độ, dữ liệu lỗi, hợp nhất hai thiết bị, chuyển tiến độ khách, phục hồi khi chuyển dở, bản offline và giới hạn đúng tài khoản. Các bài kiểm thử dùng bộ nhớ giả lập, không truy cập database thật.

Chạy `node scripts/validate-vocabulary-production.mjs` để kiểm tra kho từ vựng.

Kiểm tra giao diện web ở chiều rộng 1440px và 390px: điều hướng, bộ lọc, trạng thái trống, học từ, học ngữ pháp, lưu local sau tải lại trang, hoàn thành và thử lại khi mất kết nối. Kiểm tra trình duyệt dùng tài khoản khách và chặn yêu cầu ghi ra mạng. Đã kiểm tra thêm luồng đăng nhập, chuyển tiến độ khách, hợp nhất cloud, lưu tiến độ mới và thử lại khi đồng bộ lỗi bằng Auth/Profile/Progress giả lập ngay trong trình duyệt; không đăng nhập hay ghi thử tài khoản Supabase thật.

Đã xuất bundle Web, Android, iOS thành công bằng `npx expo export --platform all`. Đây là kiểm tra biên dịch; cần kiểm tra thêm âm thanh và chuyển động trên Android/iOS thực tế.
