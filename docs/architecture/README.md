# Sơ đồ trong README

README ở gốc sử dụng ba ảnh PNG:

| Ảnh | Nội dung | Nguồn |
| --- | --- | --- |
| [01-system-overview.png](01-system-overview.png) | Kiến trúc tổng quan | [01-system-overview.dot](01-system-overview.dot) |
| [02-auth-data-flow.png](02-auth-data-flow.png) | Đăng nhập và đồng bộ dữ liệu | [02-auth-data-flow.dot](02-auth-data-flow.dot) |
| [03-team-modules.png](03-team-modules.png) | Phân chia bốn module | Ảnh hiện có, đã kiểm tra bố cục |

Hai sơ đồ đầu được dựng bằng Graphviz: đường nối tự cắt tại mép ô, có khoảng cách giữa các tầng và nhánh để tránh đi xuyên qua thành phần. Sơ đồ đăng nhập dùng đường nối vòng ngoài cho nhánh offline.

Để dựng lại sau khi sửa file `.dot`, cài Graphviz và chạy từ gốc repo bằng PowerShell:

```powershell
./scripts/render-architecture.ps1
```

Script thay hai PNG ở đúng đường dẫn README đang dùng. Sau mỗi lần thay đổi bố cục, mở ảnh để kiểm tra mũi tên, chữ và khoảng trống giữa các ô.
