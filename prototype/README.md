# HustLingo clickable prototype

Bản này mô phỏng giao diện và luồng bấm của HustLingo bằng HTML/CSS/JavaScript thuần, **không phải ứng dụng Flutter cuối cùng**. Nó chạy không cần tài khoản, không kết nối Supabase và không gửi dữ liệu ra ngoài. Dữ liệu demo lưu cục bộ trong trình duyệt; nút đặt lại nằm ở màn Tiến độ.

## Mở prototype

- Cách nhanh: mở [index.html](index.html) bằng trình duyệt.
- Nếu trình duyệt hạn chế tài sản trên `file://`, từ thư mục `prototype` chạy `python -m http.server 8000`, rồi mở `http://localhost:8000`.

Không cần `npm install` hoặc dịch vụ mạng. Tài sản hình minh họa là SVG có sẵn trong `assets/`.

## Những màn có thể bấm thử

**Learner:** Tổng quan → Chủ đề → Bài giảng ngắn → Flashcard lật thẻ/TTS trình duyệt → Quiz 3 câu mẫu (có ảnh bát cơm) → Kết quả → Ôn tập; thêm màn Luyện nói, Đặt câu và Tiến độ.

**Admin:** Tổng quan → Danh sách nội dung → Sửa bản nháp/xem trước/mô phỏng phát hành → Câu hỏi hình ảnh → Danh sách tài khoản với tìm kiếm, khóa/mở và đổi role mẫu. Nút **Đổi sang Admin/Learner** ở thanh trên cùng.

## Giới hạn được thể hiện rõ trong UI

- Mỗi chủ đề chỉ có **4 từ mẫu** và quiz **3 câu mẫu**; MVP thật cần 25 từ và 10 câu/lượt từ ngân hàng ít nhất 40 câu/chủ đề.
- Quiz/progress/review tính trong JavaScript để minh họa; sản phẩm thật phải tính và ghi phía Edge Functions theo tài liệu kiến trúc.
- Nút micro chỉ hiển thị kết quả STT giả lập; đặt câu dùng quy tắc mẫu, không gọi AI.
- Role, khóa tài khoản, phát hành và kiểm tra nội dung chỉ đổi dữ liệu local demo; đây không phải cơ chế bảo mật.
- TTS dùng `speechSynthesis` của trình duyệt nếu có. Giọng phát có thể khác theo máy.

## Mang sang Flutter

Giữ nội dung, thứ tự màn, cách hiển thị trạng thái và quy tắc UX đã được duyệt; viết lại widget bằng Flutter/Dart theo [stack triển khai](../docs/10-implementation-stack.md). Các chức năng bảo mật và dữ liệu thật được xây theo [kiến trúc](../docs/05-architecture.md) và [phân quyền](../docs/09-access-control.md), không tái sử dụng localStorage hoặc dữ liệu giả làm backend.
