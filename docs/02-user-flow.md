# 02. Người dùng và luồng sử dụng

## Guest và tài khoản

Người dùng mở Home ngay ở chế độ guest. Guest có thể mở Lessons/Practice, lưu từ, làm quiz/bộ luyện thi mẫu, xem tiến độ và thử Tutor demo; dữ liệu nằm trên thiết bị bằng AsyncStorage. Guest không có JWT hay quyền quản trị. Xóa dữ liệu ứng dụng/trình duyệt có thể làm mất dữ liệu này.

Khi muốn đồng bộ, người dùng đăng nhập bằng email, Google hoặc Facebook qua Supabase Auth. App lấy snapshot guest trước khi chuyển sang khóa lưu của account, cho người dùng chọn nhập tiến độ, hợp nhất theo ID ổn định và chỉ đánh dấu đã nhập khi server xác nhận. Thử lại không tạo lượt trùng; account khác trên cùng máy không tự nhận lại snapshot đã nhập. Đây là luồng cần bổ sung, mã hiện tại chưa chuyển đầy đủ guest sang account.

## Luồng Lessons và Practice

1. Home → Lessons Hub → level A1–C1 → topic → lesson.
2. Mở vocabulary, grammar hoặc bài kỹ năng mẫu; xem hướng dẫn, ví dụ và tài sản hợp lệ.
3. Chuyển sang Practice: flashcard, vocabulary/grammar quiz, luyện kỹ năng hoặc bộ TOEIC/IELTS rút gọn.
4. Xem kết quả/giải thích, lưu từ cần học, đưa từ chưa nhớ vào review.
5. Review cấp câu hỏi và lựa chọn trước khi nhận câu trả lời; cập nhật lịch ôn và LearningContext.
6. Profile/Progress hiển thị kết quả tự luyện; guest chỉ có dữ liệu trên máy, account có trạng thái đang đồng bộ/đã đồng bộ/lỗi.

Quiz ảnh “ảnh con hổ → chọn tiger” cần nội dung đã dạy, ảnh rõ và có quyền sử dụng; có mô tả truy cập được và câu chữ thay thế khi tải lỗi.

## Luồng Tutor của bản 10 tuần

Chọn Emma/David → scenario → Tutor detail → chat UI hoặc call UI. Chat dùng demo messages; call hiển thị trạng thái kết nối, mic/speaker và kết thúc. Gắn nhãn demo, không giả nhận xét của AI hoặc cuộc gọi thật. STT/LLM/TTS qua server là giai đoạn tiếp theo.

## Luồng admin bổ sung

Account admin mở khu vực quản trị web khi chức năng P1 được triển khai: tạo/import draft → sửa từ/bài/quiz/ảnh → xem trước → kiểm tra → phát hành/ẩn; tìm account → khóa/mở → gửi reset link → cấp/hạ admin có audit. Learner và guest chỉ xem nội dung được công bố. UI kiểm role để điều hướng; backend vẫn kiểm quyền.

## Trạng thái cần xử lý

Loading, empty, error, normal, completed phải có ở các màn chính. Mất mạng giữ bản local và hiển thị chưa đồng bộ; không giả báo đã lưu trên cloud. OAuth hủy/lỗi cho thử lại và giữ guest. Nếu account bị khóa, API từ chối và UI cập nhật trạng thái; bản local không được coi là quyền tiếp tục gọi API.
