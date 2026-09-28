# 07. Kiểm thử và nghiệm thu

## Môi trường thử

- Android: một máy thật tầm trung hoặc emulator, kiểm tra mic và TTS trên máy thật trước demo.
- Web: Chrome và Edge hoặc Firefox bản hiện có, kích thước 360 × 800 và 1280 × 800; thử trên HTTPS vì quyền mic thường cần ngữ cảnh an toàn.
- Hai tài khoản learner thử độc lập (A, B), một tài khoản admin và một tài khoản learner bị khóa; một learner có từ cần ôn.
- Dữ liệu: 4 chủ đề đã duyệt, một bản seed cố định; dịch vụ AI/STT thật cho bài kiểm thử tích hợp và mock cho lỗi có kiểm soát.

## Ma trận ca kiểm thử trọng yếu

| Mã | Liên kết | Các bước chính | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC-01 | FR-01 | Đăng ký, đăng xuất, đăng nhập lại | Vào đúng tài khoản, phiên/tiến độ tồn tại; mật khẩu sai báo lỗi chung |
| TC-02 | FR-02/03 | Mở từng chủ đề, đi hết thẻ, phát âm thanh | Mỗi chủ đề đúng 25 từ; nội dung đầy đủ; thẻ/nút không tràn ở hai cỡ màn |
| TC-03 | FR-04 | Làm quiz với đáp án đúng/sai xen kẽ | 10 câu hợp lệ, đáp án đúng duy nhất, điểm khớp 0–100 và từ sai được liệt kê |
| TC-04 | FR-04/05 | Thoát giữa quiz rồi đăng nhập trên nền tảng khác | Lượt chưa nộp không tính; lượt đã nộp hiện cùng điểm trên hai nền tảng |
| TC-05 | FR-05/06 | Sai một từ trong quiz, xem hàng ôn, ôn đúng rồi kiểm tra `due_at` | Từ sai vào ôn ngay; sau khi ôn đúng lịch tăng 3 → 7 ngày; sai trong ôn đặt lại 1 ngày |
| TC-06 | FR-07 | Cấp quyền mic, nói đúng từ, nói từ khác, im lặng | Hiện transcript và ba trạng thái phù hợp; không nói “điểm phát âm” |
| TC-07 | FR-07/NFR-04 | Từ chối quyền mic, mất mạng, STT timeout | Thông báo dễ hiểu, có thử lại; quiz vẫn dùng được; không giữ audio gốc |
| TC-08 | FR-08 | Gửi câu đúng, câu có lỗi, câu không chứa từ, câu quá dài | Phản hồi đúng schema hoặc lỗi đầu vào rõ; không trả văn bản dài mất kiểm soát |
| TC-09 | FR-08 | Gửi đủ 5 lượt thành công, gửi lượt thứ 6; mô phỏng AI lỗi | Lượt thứ 6 bị chặn; lỗi dịch vụ không trừ lượt và câu vẫn còn trên UI |
| TC-10 | NFR-02 | Dùng token/tài khoản A thử đọc/sửa tiến độ B | Bị từ chối ở DB/API; khóa dịch vụ không xuất hiện trong bundle/web source |
| TC-11 | FR-10/NFR-03 | Yêu cầu xóa tài khoản thử, rà DB/storage/log | Quy trình xóa có bằng chứng; dữ liệu cá nhân không còn theo chính sách đã công bố |
| TC-12 | NFR-01/05/06 | Thử màn chính trên thiết bị/cỡ màn; bật phóng to chữ/keyboard web; đo 5 lượt tải | Không tràn/che nút, tác vụ chính dùng được, trung vị đạt mục tiêu hiệu năng hoặc có ghi nhận sai lệch |
| TC-13 | FR-13/NFR-02 | Đăng ký mới, sửa request/metadata để tự nhận admin; gọi API admin và đọc bản nháp/đáp án quiz | Tài khoản vẫn là learner; API và DB từ chối; không lộ bản nháp/đáp án |
| TC-14 | FR-14 | Admin tạo bản nháp bài giảng/từ/quiz, xem trước, thử phát hành nội dung thiếu rồi hoàn thiện và phát hành | Nội dung thiếu bị từ chối; learner chỉ thấy bản đã phát hành; bản nháp không hiện; phiên quiz cũ dùng snapshot cũ |
| TC-15 | FR-15/16 | Admin tìm, khóa/mở learner, gửi link reset, cấp/hạ role; dùng token cũ sau thay đổi; thử hạ admin cuối cùng | Quyền có hiệu lực ngay ở API và DB; hành động có log; admin cuối cùng không bị hạ; không xem được mật khẩu/tiến độ learner |
| TC-16 | NFR-02 | Learner dùng Supabase API trực tiếp sửa `quiz_attempts`, `review_items`, `writing_feedback`, `user_roles`, `account_status` | Mọi ghi trái phép bị từ chối; chỉ Edge Functions hợp lệ thay đổi kết quả/hạn mức/role/trạng thái |
| TC-17 | FR-06 | Mở hàng ôn, nhận câu hỏi rồi nộp một lựa chọn; thử nộp lại, đổi ID câu, dùng phiên của người khác | `start_review` cấp câu không lộ đáp án; `submit_review` chỉ chấm đúng phiên một lần, không đổi được lịch ôn người khác |
| TC-18 | FR-04/14 | Admin tạo câu xem hình chọn từ; thử ảnh đúng, ảnh hỏng/không có quyền, câu thay thế sai đáp án; learner làm quiz trên Android/web và bật trình đọc màn hình | Chỉ câu hợp lệ được phát hành; ảnh hiện rõ, câu chữ thay thế hoạt động khi ảnh lỗi, mô tả truy cập được; điểm vẫn do máy chủ tính |

## Kiểm thử tự động tối thiểu

- Unit: chuẩn hóa transcript và so khớp đáp án; tính điểm quiz; cập nhật lịch ôn 1/3/7 ngày; kiểm tra hạn mức và schema phản hồi AI.
- Integration: `submit_quiz` không tin điểm client; `start_review`/`submit_review` dùng phiên hợp lệ; RLS từ chối truy cập chéo và ghi trực tiếp; role/trạng thái kiểm tra hiện thời; dữ liệu quiz/ôn được ghi nhất quán; lỗi nhà cung cấp không tạo phản hồi thành công.
- UI smoke: đăng nhập → chủ đề → flashcard → quiz → tiến độ trên Android và web. Chỉ tự động hóa nếu không làm trễ mốc tích hợp; nếu không, có checklist và bằng chứng chạy thủ công mỗi tuần.

## Thử với người học mới

Ít nhất 5 người không tham gia phát triển, tự chọn chủ đề và hoàn thành flashcard + quiz trên một thiết bị. Người quan sát không hướng dẫn trừ khi bị kẹt; ghi thời gian, bước mắc, câu nói của người dùng và kết quả. Mục tiêu: ít nhất 4/5 hoàn thành độc lập. Nếu không đạt, sửa điểm gây vướng rồi thử lại với người khác hoặc báo rõ giới hạn ở biên bản.

## Điều kiện nghiệm thu tuần 10

1. Tất cả yêu cầu P0 ở tài liệu 03 có bản chạy và bằng chứng; trường hợp FR-10 xử lý thủ công phải có quy trình và lần thực hành được ghi nhận.
2. TC-01 đến TC-11 và TC-13 đến TC-18 đạt; TC-12 không có lỗi cản trở thao tác chính. Không còn lỗi nghiêm trọng gây mất tiến độ, sai quyền, rò dữ liệu hoặc crash trong luồng chính.
3. Đủ 4 × 25 từ đã kiểm duyệt và ngân hàng câu hỏi hợp lệ; không có nội dung thiếu trường bắt buộc.
4. Demo learner trên Android và web bằng cùng tài khoản, admin phát hành một bản nháp và khóa/mở một tài khoản thử; chứng minh tiến độ đồng bộ và ít nhất một phản hồi nói/viết từ dịch vụ thật. Nếu dịch vụ ngoài lỗi trong buổi demo, dùng bản ghi kết quả kiểm thử trước đó và ghi rõ chế độ mock.
5. Có hướng dẫn dựng môi trường, seed dữ liệu, cấu hình bí mật, tài liệu API, biên bản kiểm thử và danh sách giới hạn đã biết.

Biên bản nghiệm thu ghi ngày, phiên bản commit/build, thiết bị/trình duyệt, các ca đạt/chưa đạt, người xác nhận và các giới hạn còn lại. Không tự nhận đạt chỉ vì đã hoàn thành mã.
