# Feature: Luyện tập

**Owner:** Thành viên Luyện tập.

## Được code
- `screens/`: Practice Hub và các màn luyện tập.
- `components/`: question, answer option, flashcard, exam timer, result...
- `data/catalog.ts`: đọc bài đã xuất bản từ `practice_content` và `grammar_exercises` qua Supabase. Nghe, Đọc, Viết và Nói có bộ bài dự phòng đi kèm ứng dụng. Ngữ pháp lấy danh sách nhóm qua view `practice_grammar_topics`. Với database chưa có view, ứng dụng dùng danh sách nhóm của bộ seed. Mỗi nhóm tải ID câu hỏi theo trang, còn nội dung và giấy phép được tải khi mở từng câu.
- `hooks/`: quiz state, timer, review queue, spaced repetition...
- `types/`: type câu hỏi/kết quả.

## Không tự sửa
Backend/Auth/Supabase/layout chung. Khi cần lưu kết quả, gọi API do Backend/Core thống nhất.

## Start
Code UI trong `screens/PracticeScreen.tsx`; tab `app/(tabs)/practice.tsx` đã trỏ tới file này.

Màn làm bài nằm ở `screens/PracticeExerciseScreen.tsx`. Kết quả trắc nghiệm cộng vào thống kê học tập chung. Bản nháp bài Viết lưu trên thiết bị theo tài khoản và bài. Bản ghi âm bài Nói dùng để nghe lại trong bài hiện tại.

## Chấm phát âm trên web

Người học đăng nhập, đọc câu mẫu và bấm **Dừng ghi âm**. Trình duyệt chuyển bản ghi sang WAV mono 16 kHz. Edge Function `pronunciation-assessment` đọc câu mẫu đã xuất bản từ `practice_content`, kiểm tra số lượt rồi gửi bản ghi đến Azure Speech (`en-US`). App hiển thị điểm toàn câu, từng từ và từng âm khi Azure cung cấp. Android, iOS và khách trên web dùng chức năng nghe mẫu và nghe lại.

### Bật trên Supabase

1. Lấy khóa và mã vùng của Azure Speech resource từ **Keys and Endpoint**. Thêm `AZURE_SPEECH_KEY` và `AZURE_SPEECH_REGION` (ví dụ `southeastasia` nếu đúng vùng của resource) trong **Edge Functions → Secrets** của Supabase. Giữ các giá trị này ở backend.
2. Chạy migration `supabase/migrations/202611270001_pronunciation_quota.sql` bằng SQL Editor hoặc quy trình migration của nhóm. Migration cấp tối đa 15 yêu cầu Azure mỗi tài khoản trong ngày theo giờ Việt Nam. Các yêu cầu đã chuyển đến Azure tính một lượt.
3. Từ repo đã liên kết đúng dự án, chạy `supabase functions deploy pronunciation-assessment`. Cần có các bài `speaking` đã xuất bản trong `practice_content`.
4. Mở `/practice?skill=speaking` từ localhost hoặc HTTPS, đăng nhập và thử ghi âm một câu mẫu.

Bản ghi được chuyển tiếp trong yêu cầu chấm. HustLingo chỉ lưu bộ đếm theo ngày trong Supabase và hiển thị điểm của bản ghi trong màn hiện tại.

Để xem giao diện khi chưa có tài khoản hay khóa Azure, chạy Expo ở chế độ phát triển và mở `http://localhost:8081/practice/speak-1?skill=speaking&demo=pronunciation`. Bản thử ghi âm và nghe lại ngay trong trình duyệt, rồi hiển thị điểm minh họa.
