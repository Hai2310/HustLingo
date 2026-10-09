# Tài liệu dự án HustLingo

## Cơ sở cập nhật

Bộ tài liệu này triển khai chi tiết hướng trong [README chính](../README.md): **Expo + React Native + TypeScript + Expo Router**, bốn module Lessons/Practice/Tutor/Backend-Core, chế độ guest trước khi đăng nhập, AsyncStorage cho dữ liệu cục bộ và Supabase cho Auth/đồng bộ. README chính là cơ sở định hướng sản phẩm; docs phân biệt **định hướng**, **hiện trạng mã** và **mốc bàn giao đề xuất 10 tuần**.

## Danh mục

| Tài liệu | Nội dung |
| --- | --- |
| [01-scope.md](01-scope.md) | Tầm nhìn README và phạm vi bản 10 tuần |
| [02-user-flow.md](02-user-flow.md) | Guest, account, Lessons, Practice, Tutor và admin |
| [03-requirements.md](03-requirements.md) | Yêu cầu có thể kiểm chứng, P0/P1/roadmap |
| [04-content.md](04-content.md) | Kho từ dùng chung, nội dung kỹ năng và quiz ảnh |
| [05-architecture.md](05-architecture.md) | Thành phần, dữ liệu, đồng bộ, API hiện có/dự kiến |
| [06-plan.md](06-plan.md) | Phân công bốn thành viên và mốc 10 tuần |
| [07-testing.md](07-testing.md) | Kiểm thử guest, sync, modules, RLS và nghiệm thu |
| [08-risks.md](08-risks.md) | Rủi ro và quyết định theo hướng mới |
| [09-access-control.md](09-access-control.md) | Hai role tài khoản, guest và quản trị |
| [10-implementation-stack.md](10-implementation-stack.md) | Công nghệ, ngôn ngữ, thư mục, chạy/build/deploy |
| [11-tutor-ai-design.md](11-tutor-ai-design.md) | Thiết kế sản phẩm, dữ liệu và API của Gia sư AI |
| [12-tutor-ai-milestones.md](12-tutor-ai-milestones.md) | Milestone thực thi Tutor text-first và voice mở rộng |
| [VOCABULARY_DATA_PRODUCTION.md](VOCABULARY_DATA_PRODUCTION.md) | Kết quả kiểm tra bộ dữ liệu từ vựng |
| [architecture/README.md](architecture/README.md) | Ảnh sơ đồ và nguồn Graphviz |

## Hiện trạng cần hiểu đúng

Repo có khung Expo, các context/service Supabase, nội dung mẫu và migration cơ bản. Tutor hiện đã có vertical slice Home → Scenario → Chat → Summary với local fallback và Edge Function contract; Lessons/Practice vẫn là màn khung. Nhiều thư mục/package/service trong README vẫn là cấu trúc dự kiến. Đường dẫn nguồn từ hiện tại là `src/data/vocabulary-en.json` và `src/data/vocabulary-en.ts`; cấu trúc `src/data/vocabulary/` trong README là đích tổ chức lại, chưa tồn tại.

10.000 là số bản ghi nguồn, trong đó 4.129 qua cổng dữ liệu production và 5.871 chờ rà soát; không phải 10.000 mục đã kiểm duyệt toàn bộ. CEFR hiện là ước lượng. `npm run validate` kiểm tra các invariant của repo, còn Tutor cần thêm smoke/integration test khi kết nối AI thật.

Hai role `admin`/`learner` và công cụ quản trị được giữ từ yêu cầu trước đây; chúng là phần bổ sung vào Backend/Core. Guest không phải role thứ ba. Role/status phải do máy chủ kiểm soát; tiến độ guest và bản đồng bộ client là dữ liệu tự luyện, chưa phải điểm thi được máy chủ xác nhận.
