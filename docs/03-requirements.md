# 03. Yêu cầu sản phẩm

P0 là tiêu chí của bản 10 tuần đề xuất theo README. P1 là phần bổ sung sau khi P0 đạt. AI runtime thật, thanh toán và lộ trình nội dung đầy đủ là roadmap.

## Chức năng

| ID | Mức | Tiêu chí chấp nhận |
| --- | --- | --- |
| FR-01 | P0 | Mở Home ở guest, dùng được Lessons/Practice mẫu và Tutor demo; không bắt đăng nhập. Guest lưu local, có thể mở lại và thấy dữ liệu. |
| FR-02 | P0 | Email/password, Google và Facebook qua Supabase Auth; xử lý OAuth callback, hủy đăng nhập, lỗi và giữ guest. Session account còn sau khi mở lại app. |
| FR-03 | P0 | Sau đăng nhập có nhập tiến độ guest với xác nhận, ID chống lặp và xử lý mất mạng; không tự chuyển dữ liệu giữa hai account trên cùng máy. |
| FR-04 | P0 | Lessons Hub chọn level/topic; mở vocabulary, grammar và ít nhất một bài mẫu cho mỗi kỹ năng listening/speaking/reading/writing; không tạo dữ liệu trùng nguồn. |
| FR-05 | P0 | Flashcard có nghĩa/ví dụ/IPA khi có, phát âm bằng TTS hoặc audio hợp lệ; lưu/bỏ lưu từ; không lấy mục bị quarantine để dạy. |
| FR-06 | P0 | Vocabulary/grammar quiz có câu/lựa chọn, một đáp án đúng, điểm và giải thích. Tập demo có ít nhất hai dạng lựa chọn và một câu xem ảnh chọn từ kèm alt/fallback. |
| FR-07 | P0 | Hàng ôn chọn từ sai/chưa nhớ; cấp câu và lựa chọn trước khi nộp. Lịch 1/3/7 ngày là quy tắc MVP đề xuất; trả lời sai đặt lại sau 1 ngày. |
| FR-08 | P0 | Bộ TOEIC và IELTS rút gọn có dữ liệu mẫu, timer, chuyển câu, nộp/kết quả. UI ghi rõ luyện tập mẫu, không hiển thị điểm chuẩn hóa nếu chưa có quy tắc được kiểm chứng. |
| FR-09 | P0 | Tutor list/detail, scenario, chat/call UI và demo conversation hoạt động; nhãn demo rõ, không gửi hội thoại đến nhà cung cấp AI. |
| FR-10 | P0 | LearningContext/Progress hiển thị từ đã học, đã lưu, cần ôn, completed lessons và accuracy tự luyện; account đồng bộ qua Supabase và thử được trên hai thiết bị. |
| FR-11 | P0 | Có hai role account admin/learner; tài khoản mới là learner; JWT learner không sửa được role/status hoặc đọc account khác; trạng thái disabled chặn API dù token cũ còn hạn. |
| FR-12 | P0 | Hồ sơ và feedback đúng account; có quy trình yêu cầu xóa dữ liệu/tài khoản được kiểm chứng, có thể thủ công ở demo. |
| FR-13 | P1 | Admin web tạo/import/sửa draft bài học, từ, quiz/ảnh, xem trước, kiểm tra, phát hành/ẩn phiên bản mới; giữ lịch sử học cũ. |
| FR-14 | P1 | Admin tìm/khóa/mở account, gửi reset link, cấp/hạ admin có audit; không hạ admin cuối và không sửa điểm học tùy ý. |
| FR-15 | Roadmap | STT → LLM → TTS thật, phản hồi câu viết/phát âm có giới hạn, secrets/hạn mức ở server; lỗi dịch vụ không làm hỏng trục học. |
| FR-16 | Roadmap | SubscriptionContext, Free/Plus/Pro và cổng thanh toán; server xác nhận entitlement, không tin cờ trả phí ở client. |

## Quy tắc dữ liệu và kết quả

Kho 10.000 bản ghi là nguồn chung; chỉ dùng tập production và nội dung đã kiểm duyệt cho bài bàn giao. CEFR/TOEIC/IELTS chưa được xác minh không ghi “official”. Chủ đề không bị giới hạn cố định ở 4 × 25 từ; số lượng bài được ghi vào manifest nội dung demo.

Quiz guest và bài tự luyện có thể chấm cục bộ, lưu/đồng bộ như dữ liệu cá nhân. Chúng không phải điểm thi đáng tin cậy do server xác nhận. Khi triển khai chế độ kiểm tra có kết quả server, dùng ngân hàng/phiên riêng, không trả đáp án trước khi nộp và không cho client ghi bảng kết quả. Dữ liệu local do người dùng tự sửa không được dùng để cấp quyền, thanh toán hoặc hạn mức AI.

Import guest và sync dùng ID từ/bài/lượt ổn định; không cộng lại lượt cũ. Đổi nội dung giữ ID nếu chỉ sửa chính tả; thay nghĩa/đáp án tăng phiên bản. Review cục bộ phải có câu hỏi/lựa chọn; review server cần start/submit session theo tài liệu 05.

## Phi chức năng

| ID | Tiêu chí |
| --- | --- |
| NFR-01 | Expo/React Native/TypeScript cùng codebase; Android/web chạy được và không tràn ở 360/768/1280 px; iOS ghi riêng trạng thái kiểm thử. |
| NFR-02 | RLS chặn truy cập chéo; quyền role/status chỉ server ghi; service role/AI secrets không có trong bundle hoặc EXPO_PUBLIC. |
| NFR-03 | Loading/empty/error/normal/completed, retry và trạng thái đồng bộ rõ; offline không làm mất local hoặc báo sai đã lưu cloud. |
| NFR-04 | Ảnh/audio có nguồn và quyền sử dụng, nút/ảnh có nhãn truy cập; quiz ảnh có fallback cùng đáp án. |
| NFR-05 | Mục tiêu danh sách bài dưới 3 giây ở mạng ổn định và lật thẻ dưới 300 ms trên thiết bị thử; ghi trung vị 5 lượt. |
| NFR-06 | Typecheck, validator dữ liệu, smoke UI và integration RLS/sync có bằng chứng; core thay đổi theo interface nhóm thống nhất. |
