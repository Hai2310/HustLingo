# Components

UI dùng chung của HustLingo. Code hiện tại được phân nhóm nhưng đường dẫn cũ vẫn hoạt động nhờ compatibility re-export.

- `common/`: UI dùng ở nhiều màn hình.
- `home/`: UI riêng Trang chủ.
- `auth/`: UI đăng nhập/đăng ký.
- `navigation/`: UI điều hướng.
- `motion/`: animation dùng chung.

Ba thành viên feature không nên sửa component shared nếu chưa thống nhất với người tích hợp/core.
