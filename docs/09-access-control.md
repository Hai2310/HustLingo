# 09. Role và phân quyền

## Hai role của MVP

- **`admin`:** một role chung cho quản trị viên và thành viên chuyên môn. Có quyền quản lý tài khoản người dùng, biên soạn/kiểm duyệt/phát hành nội dung. MVP không tách thêm các role biên tập, kiểm duyệt hoặc hỗ trợ.
- **`learner`:** tài khoản học viên tự đăng ký; học nội dung đã phát hành và xem dữ liệu học của chính mình. Người học không có quyền quản trị.

Tài khoản mới luôn nhận `learner`. Tài khoản `admin` đầu tiên được cấp bằng quy trình bootstrap phía máy chủ khi triển khai; không có nút “đăng ký admin”. Admin có thể cấp/thu hồi quyền admin cho tài khoản khác qua chức năng bảo mật trên máy chủ. Không cho hạ quyền admin cuối cùng, tự nâng quyền hoặc thay role bằng cách sửa request/DB từ client.

## Ma trận quyền

| Tài nguyên/thao tác | Learner | Admin |
| --- | --- | --- |
| Đăng nhập, đổi thông tin hồ sơ của mình, yêu cầu đặt lại mật khẩu | Có | Có |
| Xem chủ đề, bài giảng ngắn, từ và quiz đã phát hành | Có | Có ở chế độ xem trước/quản trị |
| Học, nộp quiz, ôn tập, luyện nói, viết câu, xem tiến độ | Chỉ dữ liệu của mình | Không thao tác với tư cách learner; dùng tài khoản learner thử riêng |
| Xem bản nháp và sửa chủ đề, bài giảng, từ vựng, câu hỏi, tài sản | Không | Có |
| Kiểm tra hợp lệ và phát hành/ẩn nội dung | Không | Có |
| Xem danh sách tài khoản (email, tên, role, trạng thái), tìm kiếm | Không | Có |
| Khóa/mở tài khoản learner; gửi liên kết đặt lại mật khẩu | Không | Có |
| Cấp/thu hồi role admin | Không | Có, qua chức năng máy chủ và có nhật ký |
| Xem/sửa điểm, câu viết, ghi âm hoặc tiến độ riêng của learner | Chỉ xem dữ liệu của mình; không tự sửa kết quả | Không trong MVP; việc hỗ trợ/xóa theo quy trình riêng |
| Xóa tài khoản của mình | Có theo FR-10 | Có theo quy trình quản trị, không xóa admin cuối cùng |

## Phạm vi màn quản trị trong 10 tuần

Giao diện **web** có ba phần: (1) danh sách nội dung và trạng thái bản nháp/đã phát hành, (2) form sửa chủ đề/bài giảng ngắn/từ/câu hỏi và kiểm tra trước khi phát hành, (3) danh sách tài khoản và thao tác khóa/mở, đặt lại mật khẩu, đổi role. Nội dung nhiều mục được nạp bằng seed/import có kiểm tra cấu trúc, sau đó admin sửa và duyệt trên web. Không xây trình soạn thảo giàu định dạng, video bài giảng, nhiều cấp duyệt hay bảng thống kê học viên trong MVP.

“Bài giảng” ở MVP là phần mở đầu của một chủ đề: mục tiêu học, 2–5 đoạn hướng dẫn ngắn, ví dụ và tài sản minh họa tùy chọn. Flashcard, quiz và luyện tập tiếp nối cùng chủ đề. Mọi phần do admin kiểm duyệt trước khi phát hành.

## Quy trình nội dung

1. Admin tạo/nhập chủ đề ở trạng thái `draft`, sửa bài giảng, từ, câu hỏi và tài sản.
2. Admin xem trước như learner. Máy chủ kiểm tra đủ trường bắt buộc, 20–30 từ, tối thiểu 40 câu hỏi hợp lệ, quyền dùng tài sản và câu trả lời duy nhất. Câu hình cần ảnh tải được, mô tả truy cập được và câu chữ thay thế cùng đáp án.
3. Admin nhấn **Phát hành**; máy chủ ghi người phát hành, thời điểm và tăng `content_version`. Learner chỉ thấy phiên bản đã phát hành.
4. Khi cần sửa nội dung đã phát hành, admin tạo bản nháp mới; phiên bản cũ vẫn phục vụ lượt quiz đang diễn ra đến khi hết hạn. Ẩn chủ đề sẽ chặn lượt học mới nhưng giữ lịch sử/tiến độ của người học.

Vì chỉ có một role admin, việc một người nhập và người khác rà soát là **quy trình nhóm**, không phải quyền hệ thống riêng. Nhóm ghi người soạn/người rà soát trong metadata hoặc checklist; người phát hành chịu trách nhiệm kiểm tra lần cuối.

## Quy trình tài khoản

- Đăng ký công khai tạo `learner` với trạng thái `active` bằng trigger phía máy chủ. Email/mật khẩu do Supabase Auth quản lý; admin không xem hoặc đặt mật khẩu trực tiếp.
- Admin có thể khóa (`disabled`) hoặc mở (`active`) tài khoản learner. Tài khoản bị khóa không được gọi chức năng học/API; phiên đăng nhập cũ cũng bị từ chối ở máy chủ ở mỗi yêu cầu. UI hiển thị lý do chung và cách liên hệ nhóm.
- Admin gửi liên kết đặt lại mật khẩu qua cơ chế Auth; không gửi mật khẩu thô. Đổi role/khóa tài khoản yêu cầu xác nhận trong UI và ghi `actor`, `target`, `action`, `timestamp` vào nhật ký.
- Đổi từ learner sang admin hoặc ngược lại không xóa dữ liệu học cũ. Role mới có hiệu lực theo kiểm tra phía máy chủ ngay sau thay đổi; client tải lại màn tương ứng. Tài khoản admin bị hạ quyền không còn dùng API quản trị dù còn token cũ.
- Chỉ admin được xử lý yêu cầu xóa tài khoản người khác, theo quy trình được ghi nhận; không cho admin xóa dữ liệu học hoặc sửa điểm tùy ý.

## Quy tắc thực thi

Client chỉ dùng role để **ẩn/hiện giao diện**. Mọi API đặc quyền kiểm tra JWT, tra role và trạng thái hiện thời từ DB phía máy chủ; không tin role, `user_id` hoặc `is_admin` do client gửi. Role lưu trong bảng riêng không cho client ghi. Những bảng kết quả học và hạn mức chỉ được chức năng máy chủ ghi sau kiểm tra; learner chỉ được đọc dữ liệu của mình. Nội dung bản nháp/câu trả lời quiz và danh sách tài khoản không được phát qua API công khai. Dùng service key chỉ trong Edge Functions, RLS theo nguyên tắc quyền tối thiểu và kiểm thử cả đường truy cập DB trực tiếp lẫn API.
