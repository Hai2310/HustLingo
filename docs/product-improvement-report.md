# Đề xuất cải tiến HustLingo

Nhánh khảo sát `huy2` · 25/11/2026

HustLingo đã có bài từ vựng và ngữ pháp A1–C1, thẻ từ có minh họa và tiến độ học lưu trên thiết bị. Khi Supabase không kết nối được, mục Bài học vẫn mở được nội dung có sẵn. Tab Luyện tập còn trống và nhóm chưa kiểm thử được luồng đồng bộ qua Supabase trong đợt này.

Ưu tiên đợt tiếp theo là làm trọn **một lượt học → luyện tập → ôn câu sai** bằng nội dung mẫu. Luồng này giúp người học biết mình nhớ được gì ngay sau bài và cho nhóm một kịch bản demo chạy được trong thời gian chờ backend.

## Có thể làm ngay khi Supabase chưa kết nối

| Ưu tiên | Đề xuất | Kết quả để nghiệm thu | Phụ trách đề xuất |
| --- | --- | --- | --- |
| 1 | Thêm nút **Luyện ngay** ở cuối một bài Vocabulary A1. Dùng chung ID bài và từ giữa Lessons và Practice. | Người học mở quiz 5 câu về chính bài vừa học. Mỗi câu có giải thích ngắn và cuối lượt có danh sách câu sai. | Huy + Dương |
| 2 | Cho ôn lại câu sai và từ đã lưu. Thử một câu chọn từ theo ảnh có chủ thể rõ ràng. | Người học mở được mục ôn sau khi tải lại app. Câu hỏi ảnh có cách hiển thị thay thế phù hợp nếu ảnh lỗi. | Dương + Huy |
| 3 | Làm rõ trạng thái kết nối trong Bài học. Phân biệt nội dung offline, tiến độ đã lưu trên máy và tiến độ tài khoản đã đồng bộ. | Khi mô phỏng lỗi mạng, người học vẫn mở được bài có sẵn. Nút **Thử lại** tải danh mục online khi kết nối phục hồi. Kiểm tra trên web và Android. | Huy + Hải |

Giới hạn lượt thử đầu tiên ở một bài từ vựng và một quiz để nhóm kiểm tra hết luồng. Khi luồng ổn định, áp dụng cùng cấu trúc cho một bài Grammar A1. Gia sư AI có thể được trình diễn bằng hội thoại mẫu, với nhãn **Chế độ demo** để người xem nhận biết.

## Kiểm tra sau khi Supabase hoạt động lại

- **Hải + Huy** kiểm tra tải danh mục, đăng nhập và đồng bộ tiến độ trên môi trường thử nghiệm. Mở cùng tài khoản trên hai thiết bị để xác nhận bài đã học xuất hiện đúng và dữ liệu học lúc mất mạng được giữ khi kết nối lại.
- **Hải + Dương** thống nhất cách lưu lượt luyện. Nếu có điểm chính thức hoặc lịch ôn áp dụng chung cho tài khoản, máy chủ cần chấm điểm và kiểm soát ghi kết quả. Ứng dụng tiếp tục có thể chấm tại chỗ cho lượt tự luyện offline.
- **Khánh + Hải** chạy thử một kịch bản Gia sư từ mở hội thoại đến xem phản hồi, rồi kiểm tra màn hình báo lỗi và cách thử lại khi dịch vụ gián đoạn.

Đợt cải tiến có thể bàn giao khi nhóm demo được một lượt **mở bài → học từ → làm quiz → ôn câu sai** ở chế độ khách, kể cả khi mô phỏng Supabase không truy cập được. Sau đó mới mở rộng thêm chủ đề và bài luyện kỹ năng.
