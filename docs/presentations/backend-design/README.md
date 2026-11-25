# Báo cáo thiết kế Backend HustLingo

Deck mở rộng được dựng trên file PowerPoint HUST 4:3 hiện có để giữ logo, màu và bố cục của trường. Trang thành viên nằm sau bìa; mục lục đứng trước phần kiến trúc.

## Tệp

- `outline.json`: cấu trúc nội dung của deck 17 slide.
- `design_brief.json`: mục tiêu và quyết định thiết kế.
- `notes.md`: phần giải thích để thuyết trình, giới hạn hiện tại và nguồn trong repo.
- [`scripts/expand_backend_deck.ps1`](../../../scripts/expand_backend_deck.ps1): mở rộng deck có sẵn bằng PowerPoint COM trên Windows, giữ nguyên file nguồn.
- [`scripts/build_backend_deck.ps1`](../../../scripts/build_backend_deck.ps1): dựng bản 9 slide ban đầu từ template HUST.

## Dựng lại trên máy Windows/WSL

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '\\wsl.localhost\Ubuntu-24.04\home\mhai\Project Web\HustLingo\scripts\expand_backend_deck.ps1' -InputPath 'C:\Users\Lenovo\Downloads\HustLingo_Backend.pptx' -OutputPath 'C:\Users\Lenovo\Downloads\HustLingo_Backend_Comprehensive.pptx'
```

Script mở rộng dành cho bản nguồn 12 slide, thêm mục lục, API service, hai slide tra cứu schema gộp toàn bộ 14 bảng public, môi trường triển khai và trạng thái/roadmap. Deck nguồn không bị ghi đè. Số liệu catalog trên slide cũ là giá trị ước tính trong ảnh Supabase Studio; migration Practice/Tutor và `grammar_exercises` có trong repo nhưng cần xác nhận đã chạy và seed trên project Supabase.
