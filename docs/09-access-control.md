# 09. Role và phân quyền

## Danh tính và phạm vi

Có hai role tài khoản: **learner** và **admin**. Admin gộp quản trị viên với nhóm chuyên môn kiểm soát nội dung/tài khoản. Guest là người chưa đăng nhập: app có thể dùng đối tượng guest để hiển thị UI, nhưng giá trị role trên máy không tạo quyền Supabase. Tài khoản đăng ký công khai luôn là learner; admin đầu tiên bootstrap ở server.

Admin có thể học trên dữ liệu của chính mình như learner; quyền quản trị bổ sung không cho phép sửa điểm hoặc đọc dữ liệu học riêng của người khác. Trang admin web P1 thuộc Backend/Core, không đổi cách chia bốn module của README.

## Ma trận quyền mục tiêu

| Thao tác | Guest | Learner | Admin |
| --- | --- | --- | --- |
| Nội dung đóng gói/đã công bố, Lessons/Practice/Tutor demo | Có | Có | Có |
| Lưu tiến độ/draft/saved words trên máy | Có | Có | Có |
| Đồng bộ hồ sơ và tiến độ tự luyện lên Supabase | Không | Chỉ của mình | Chỉ của mình |
| Gửi góp ý account | Không; có thể giữ draft | Có | Có |
| Sửa tên/ảnh/sở thích cá nhân | Local | Chỉ cột cho phép của mình | Chỉ cột cho phép của mình |
| Xem/sửa/publish draft nội dung | Không | Không | Qua API quản trị P1 |
| Tìm/khóa/mở/reset account, cấp/hạ admin | Không | Không | Qua API quản trị P1, có audit |
| Tự đổi role/status qua Data API | Không | Không | Không; chỉ chức năng server được phép |
| Sửa kết quả server/hạn mức/entitlement | Không | Không | Không; chỉ nghiệp vụ server xác nhận |

## Quyền ghi và RLS

Tiến độ tự luyện trong `learning_progress.state` có thể được client cập nhật theo quyền chủ sở hữu để đáp ứng guest-first/sync của README. Dữ liệu đó không phải điểm xác minh và không được dùng để cấp gói trả phí, quyền admin hoặc vượt hạn mức AI. Merge phải kiểm schema, user ID từ JWT, status active và chống ghi trùng; không ghi đè state của account khác.

Hồ sơ `profiles` hiện có role/status cùng trường an toàn; migration cấp owner-write cả hàng. **Cần sửa trước khi nghiệm thu role:** tách role/status sang vùng server-only hoặc thu hồi update toàn bảng và chỉ grant các cột hồ sơ cho phép. Trigger đăng ký lấy role learner mặc định, không tin role trong metadata/request. Account disabled bị DB/API từ chối kể cả còn JWT hợp lệ.

Bảng phản hồi AI, điểm quiz xác minh, lịch ôn server, hạn mức, subscription và audit tương lai chỉ server ghi. Learner có thể đọc kết quả của mình; client không có INSERT/UPDATE/DELETE. Bảng `feedback` hiện tại chứa góp ý người dùng và cho phép insert của chính chủ sau kiểm tra độ dài; đây là loại dữ liệu khác với AI feedback.

## Admin P1

Tạo/import draft → xem trước → kiểm dữ liệu/ảnh → publish version mới hoặc hide. Người soạn và người rà soát cùng role admin, dùng checklist/metadata để ghi trách nhiệm. Draft/private asset không đưa vào bundle hoặc API công khai.

API account kiểm JWT, role và status hiện thời trước thao tác; service key giữ ở server. Reset qua Auth link, không xem mật khẩu. Đổi role/khóa/mở có xác nhận và audit; bảo vệ admin cuối trong giao dịch, thử token cũ sau hạ quyền. Admin không sửa kết quả học tự ý.

## Kiểm chứng

Thử bằng Data API trực tiếp với guest, learner A/B và admin: đọc chéo, tự sửa role/status, JWT disabled, thao tác quản trị và bảng server-only. Route guard chỉ hỗ trợ UI; kết quả kiểm thử DB/API mới chứng minh quyền. Luồng nhập guest không làm guest có quyền account trước khi Auth hoàn tất.
