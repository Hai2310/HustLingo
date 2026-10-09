# Sơ đồ trong README

README ở gốc sử dụng ba ảnh PNG:

| Ảnh | Nội dung | Nguồn |
| --- | --- | --- |
| [01-system-overview.png](01-system-overview.png) | Thành phần hiện có và công nghệ deploy dự kiến | [01-system-overview.dot](01-system-overview.dot) |
| [02-auth-data-flow.png](02-auth-data-flow.png) | Luồng đăng nhập/merge/sync mục tiêu, còn cần hoàn thiện | [02-auth-data-flow.dot](02-auth-data-flow.dot) |
| [03-team-modules.png](03-team-modules.png) | Định hướng bốn module; không phải toàn bộ tính năng đã triển khai | Ảnh hiện có, đã kiểm tra bố cục |

Hai sơ đồ đầu được dựng bằng Graphviz: đường nối tự cắt tại mép ô, có khoảng cách giữa các tầng và nhánh để tránh đi xuyên qua thành phần. Sơ đồ đăng nhập dùng đường nối vòng ngoài cho nhánh offline.

Sơ đồ tổng quan mô tả ứng dụng hiện có và bốn nguồn/dịch vụ nó truy cập. Mũi tên chỉ phía thực hiện thao tác đến phía được gọi, có nhãn đọc/lưu/đăng nhập/đồng bộ; phản hồi được lược bỏ. Các phần UI, Context và Supabase client nằm trong một ô ứng dụng. Nội dung cục bộ/AsyncStorage và Supabase Auth/PostgreSQL được nhóm theo nơi chạy. Ô “Công nghệ triển khai” ghi kế hoạch Expo export + EAS Deploy cho web, EAS Build cho mobile và Supabase Cloud cho backend theo [DEPLOYMENT.md](../../DEPLOYMENT.md); đường nét đứt biểu thị build/phát hành. Subscription và các dịch vụ tương lai chưa nằm trong sơ đồ này.

Để dựng lại sau khi sửa file `.dot`, cài Graphviz và chạy từ gốc repo bằng PowerShell:

```powershell
./scripts/render-architecture.ps1
```

Script thay hai PNG ở đúng đường dẫn README đang dùng. Sau mỗi lần thay đổi bố cục, mở ảnh để kiểm tra mũi tên, chữ và khoảng trống giữa các ô.
