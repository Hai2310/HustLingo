# 01. Tổng quan và phạm vi MVP

## Vấn đề và giá trị

Người mới học tiếng Anh thường biết mặt chữ nhưng khó nhớ nghĩa, nghe phát âm, dùng từ trong câu và duy trì ôn tập. HustLingo đưa người học qua một vòng ngắn: **xem từ → nghe và đọc theo → nhận biết qua quiz → tự đặt câu → ôn lại**. Nội dung ít, có thứ tự và phản hồi ngay để người mới không bị quá tải.

## Mục tiêu của phiên bản 10 tuần

1. Người học hoàn thành được một chủ đề 20–30 từ trên Android và web bằng cùng tài khoản.
2. Người học xem được tiến độ, từ cần ôn và tiếp tục học sau khi đăng nhập lại.
3. Người học luyện nói một từ/câu mẫu và nhận phản hồi mức khớp dựa trên STT, kèm giới hạn rõ về độ tin cậy.
4. Người học viết một câu chứa từ mục tiêu và nhận phản hồi ngắn, hữu ích, an toàn; có lối xử lý khi dịch vụ AI lỗi.
5. Nhóm có ứng dụng chạy được, bộ nội dung kiểm duyệt, kiểm thử và bản demo cuối tuần 10.

## Giả định lập kế hoạch

- Nhóm có 3–4 thành viên, mỗi người khoảng 10–15 giờ/tuần; có người phụ trách kiểm duyệt tiếng Anh.
- Ưu tiên **Android và web** để chứng minh tính đa nền tảng. Mã Flutter được thiết kế để hỗ trợ iOS, nhưng phát hành/kiểm thử iOS chỉ khi nhóm có máy Mac và thiết bị hoặc tài khoản cần thiết. Không tính iOS là điều kiện nghiệm thu MVP.
- Có kết nối mạng cho đăng nhập, đồng bộ, STT và phản hồi AI. Nội dung chủ đề đã tải có thể xem lại nếu triển khai bộ nhớ đệm; học và chấm điểm ngoại tuyến không nằm trong cam kết.
- Dùng dịch vụ AI/STT có hạn mức thử nghiệm hoặc ngân sách được cấp; kiến trúc có thể thay nhà cung cấp. Không cam kết miễn phí ở mọi mức sử dụng.
- Nội dung từ, nghĩa, ví dụ và đáp án do nhóm biên soạn/kiểm duyệt, không để AI tạo trực tiếp cho người học mà không kiểm tra.
- Có đúng hai role `admin` và `learner`. Admin gồm quản trị viên và nhóm chuyên môn; giao diện quản trị ưu tiên web. Chi tiết quyền ở [09-access-control.md](09-access-control.md).

## Phạm vi

| Mức | Chức năng | Lý do |
| --- | --- | --- |
| MVP | Đăng ký/đăng nhập email, đăng xuất; hồ sơ tên hiển thị | Lưu và đồng bộ tiến độ |
| MVP | Admin quản lý chủ đề, bài giảng ngắn, từ, quiz và phát hành nội dung trên web | Có quy trình kiểm soát nội dung ngay trong sản phẩm |
| MVP | Admin xem danh sách tài khoản, khóa/mở learner, gửi liên kết đặt lại mật khẩu, cấp/thu hồi admin | Quản trị tài khoản với đúng hai role |
| MVP | 4 chủ đề, mỗi chủ đề 25 từ; flashcard có từ, IPA, nghĩa, ví dụ, âm thanh; hình minh họa khi có quyền sử dụng | Đủ dữ liệu để chứng minh luồng học |
| MVP | Quiz 10 câu/chủ đề/lượt: chọn nghĩa, chọn từ theo nghĩa, điền từ bằng lựa chọn | Kiểm tra nhận biết và nhớ từ |
| MVP | Ôn từ sai hoặc đến hạn theo lịch đơn giản; thống kê số từ đã học và độ chính xác | Tạo vòng học lặp lại |
| MVP | Ghi âm và STT cho từ/câu mẫu, báo “khớp/chưa khớp/không nhận diện được” | Luyện nói có phản hồi, không ngụy tạo điểm phát âm |
| MVP | Viết 1 câu có từ mục tiêu; AI nhận xét theo mẫu cố định, giới hạn lượt/ngày | Luyện dùng từ trong ngữ cảnh |
| MVP | Giao diện tiếng Việt, responsive, trạng thái tải/lỗi, bảo vệ dữ liệu người dùng | Dùng được trên hai nền tảng |
| Sau MVP | Bài giảng video/trình soạn thảo giàu định dạng, nhiều cấp duyệt, chatbot hội thoại mở, luyện đề tổng hợp, chấm phát âm ở cấp âm vị, chấm bài viết dài, đủ cả 4 kỹ năng, gamification, bảng xếp hạng | Vượt nguồn lực/độ tin cậy của 10 tuần |

**Làm rõ từ ý tưởng gốc:** “AI chấm phát âm” được thu hẹp thành kiểm tra nội dung lời nói qua STT. Muốn chấm âm, trọng âm, ngữ điệu cần dịch vụ đánh giá phát âm chuyên dụng và bộ kiểm chứng riêng. “AI chấm đặt câu” chỉ là nhận xét hỗ trợ, không phải chứng chỉ hay điểm chuẩn hóa.

## Chỉ số thành công của bản demo

| Chỉ số | Mức tối thiểu |
| --- | --- |
| Nội dung đã kiểm duyệt | 4 chủ đề × 25 từ; không trùng ID, không thiếu từ/IPA/nghĩa/ví dụ/đáp án |
| Luồng chính | 1 người dùng mới học xong chủ đề, làm quiz, luyện nói, đặt câu, đăng nhập lại và xem tiến độ |
| Phân quyền | Learner không truy cập được màn/API quản trị hoặc dữ liệu tài khoản khác; admin tạo bản nháp, kiểm tra và phát hành được một chủ đề; khóa learner có hiệu lực với phiên đang mở |
| Chất lượng chức năng | 100% ca kiểm thử mức chặn bàn giao đạt; không lỗi làm mất tiến độ hoặc lộ dữ liệu chéo tài khoản |
| Trải nghiệm | Thử với ít nhất 5 người mới học; ít nhất 4/5 tự hoàn thành flashcard và quiz không cần hướng dẫn |
| Hiệu năng mục tiêu | Màn chủ đề hiển thị trong 3 giây ở mạng thử nghiệm ổn định; thao tác lật thẻ tức thời; chấm AI có trạng thái chờ và timeout |

Các mức trên là **tiêu chí dự án**, không phải số liệu đã đo. Điều kiện và cách đo nằm ở [07-testing.md](07-testing.md).
