# 08. Rủi ro và quyết định

## Sổ rủi ro

| Rủi ro | Khả năng / ảnh hưởng | Dấu hiệu sớm | Giảm thiểu và phương án dự phòng | Chủ trì |
| --- | --- | --- | --- | --- |
| Ghi âm/STT khác nhau giữa Android và web | Cao / cao | Spike tuần 1 không chạy trên một nền tảng | Thử thiết bị thật và HTTPS sớm; tách adapter âm thanh theo nền tảng; nếu vẫn lỗi, báo giới hạn và ưu tiên luồng học/quiz ổn định | Ứng dụng |
| STT không phản ánh phát âm thực | Cao / trung bình | Người nói sai âm nhưng transcript vẫn đúng | Chỉ hiển thị mức khớp văn bản; không chấm điểm ngữ âm; thu phản hồi người thử để cải thiện hướng dẫn | Sản phẩm |
| AI phản hồi sai hoặc quá dài | Trung bình / cao | JSON sai schema, sửa câu sai nghĩa | Giới hạn đầu vào/đầu ra, prompt cố định, kiểm tra schema, mẫu kiểm duyệt thủ công; lỗi thì cho thử lại | Backend/nội dung |
| Vượt hạn mức/chi phí dịch vụ | Trung bình / cao | Số lượt/độ trễ tăng nhanh | Hạn mức 5 câu viết/ngày, giới hạn audio, dashboard dùng dịch vụ, cảnh báo ngân sách; có mock cho demo | Backend |
| Nội dung 100 từ/câu hỏi không kịp hoặc sai | Trung bình / cao | Tuần 2 chưa duyệt xong chủ đề đầu | Mẫu dữ liệu và checklist ngay tuần 1; chia chủ đề theo người; rà soát chéo; đóng băng nội dung tuần 4 | Nội dung |
| RLS hoặc khóa API cấu hình sai | Trung bình / rất cao | Tài khoản A thấy dữ liệu B; khóa trong bundle | Kiểm thử hai tài khoản tuần 2 và 5; khóa chỉ ở server; review migration trước demo | Backend |
| Learner tự ghi điểm/lịch ôn hoặc tự nâng role qua API trực tiếp | Trung bình / rất cao | Có chính sách owner-write trên bảng kết quả/role; request client gửi `is_admin` | Thu hồi quyền ghi client, chỉ Edge Functions ghi sau kiểm tra; thử DB trực tiếp bằng JWT learner | Backend |
| Admin bị hạ/khóa nhưng token cũ còn quyền, hoặc mất admin cuối cùng | Trung bình / cao | Quyền dựa vào claim token cũ; không có ràng buộc admin cuối | Tra role/trạng thái hiện thời ở mỗi API và RLS; bảo vệ admin cuối trong giao dịch; kiểm thử token cũ | Backend |
| Giao diện quản trị nội dung/tài khoản quá lớn cho 10 tuần | Trung bình / cao | Tuần 3 chưa có bản nháp xem trước; form mở rộng thành CMS | Chỉ hỗ trợ bài giảng ngắn, form đơn giản, seed/import hàng loạt; không làm video, phân quyền nhiều cấp hoặc báo cáo học viên | Quản lý dự án |
| Quy trình xóa dữ liệu không hoàn chỉnh | Trung bình / cao | Dữ liệu còn ở bảng phụ/storage | Thiết kế quan hệ xóa từ đầu; chạy thử với tài khoản giả tuần 8; công bố thời gian xử lý nếu dùng hỗ trợ thủ công | Backend |
| Thiếu máy Mac để kiểm thử iOS | Cao / thấp với MVP | Không có thiết bị/xcode tuần 1 | Chốt Android + web là hai nền tảng nghiệm thu; không quảng bá phát hành iOS | Quản lý dự án |

## Quyết định đã đề xuất

| ID | Quyết định | Lý do / hệ quả |
| --- | --- | --- |
| D-01 | MVP nhắm Android và web bằng Flutter | Đủ đa nền tảng trong điều kiện 10 tuần; iOS là giai đoạn sau nếu có điều kiện kiểm thử |
| D-02 | Trục học là 4 chủ đề × 25 từ → flashcard → quiz → ôn | Có thể biên soạn và kiểm tra nội dung trọn vẹn |
| D-03 | Luyện nói dùng STT để so văn bản | Trung thực về năng lực kỹ thuật và chi phí; không tuyên bố chấm phát âm chi tiết |
| D-04 | AI chỉ phản hồi một câu ngắn theo từ mục tiêu | Rõ tiêu chí, dễ giới hạn chi phí và kiểm duyệt hơn chatbot mở |
| D-05 | Dùng Supabase làm backend, AI/STT qua Edge Functions | Rút thời gian dựng Auth/DB và giữ khóa API phía máy chủ |
| D-06 | Chỉ có hai role `admin` và `learner`; admin gồm quản trị viên và nhóm chuyên môn | Dễ quản lý trong 10 tuần; quy trình rà soát chéo là quy ước nhóm, không phải role riêng |
| D-07 | Admin web quản lý bản nháp/phát hành nội dung và tài khoản; learner không ghi trực tiếp kết quả học | Quyền tối thiểu, bảo vệ điểm/lịch ôn/hạn mức và nội dung chưa phát hành |

## Việc cần chốt ở tuần 1–2

| Câu hỏi | Hạn chốt | Người quyết định | Dữ liệu cần có |
| --- | --- | --- | --- |
| Nhóm thực tế có bao nhiêu người/giờ mỗi tuần? | Tuần 1 | Nhóm/giảng viên | Lịch và kỹ năng thành viên |
| Nhà cung cấp STT/LLM nào được phép dùng, hạn mức và xử lý dữ liệu ra sao? | Tuần 2 | Backend + quản lý | Spike độ trễ, chi phí, điều khoản, độ chính xác mẫu |
| Có thiết bị Android thật và môi trường web HTTPS để thử mic không? | Tuần 1 | Ứng dụng | Danh sách thiết bị và bản thử |
| Ai duyệt nội dung tiếng Anh và tài sản hình/âm? | Tuần 1 | Nội dung | Checklist và nguồn/giấy phép |
| Ai giữ tài khoản admin đầu tiên và ai được phép cấp admin tiếp theo? | Tuần 1 | Nhóm/giảng viên | Danh sách nhân sự, quy trình bootstrap và bàn giao |
| Có yêu cầu giảng viên về nền tảng, công nghệ, báo cáo hoặc tiêu chí điểm không? | Tuần 1 | Quản lý dự án | Đề bài chính thức |

Nếu giả định ban đầu thay đổi, sửa [01-scope.md](01-scope.md), [03-requirements.md](03-requirements.md), [06-plan.md](06-plan.md) và [07-testing.md](07-testing.md) trong cùng lần cập nhật để phạm vi, lịch và điều kiện nghiệm thu không mâu thuẫn.
