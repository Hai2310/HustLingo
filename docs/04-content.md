# 04. Nội dung học tập

## Kế hoạch nội dung MVP

| Chủ đề | 25 từ theo nhóm | Tình huống đặt câu | Ví dụ từ mẫu |
| --- | --- | --- | --- |
| Gia đình và con người | quan hệ gia đình, tuổi, mô tả đơn giản | Giới thiệu người thân | mother, brother, kind |
| Nhà ở và đồ vật | phòng, đồ dùng, vị trí | Mô tả nhà/phòng | kitchen, table, under |
| Đồ ăn và đồ uống | món phổ biến, bữa ăn, sở thích | Gọi món/nói sở thích | rice, water, breakfast |
| Hoạt động hằng ngày | động từ và mốc thời gian cơ bản | Kể lịch sinh hoạt | wake up, study, evening |

Danh sách từ cụ thể được chốt ở tuần 2. Chọn từ mức A0–A1, có ích trong giao tiếp thường ngày, tránh từ nhiều nghĩa khó trong ví dụ đầu tiên. Mỗi chủ đề cần đủ từ để sinh câu hỏi với ba phương án nhiễu hợp lý.

## Cấu trúc một mục từ

```json
{
  "id": "family_mother",
  "topic_id": "family",
  "content_version": 1,
  "word": "mother",
  "part_of_speech": "noun",
  "ipa": "/ˈmʌðər/",
  "meaning_vi": "mẹ",
  "example_en": "My mother is kind.",
  "example_vi": "Mẹ tôi tốt bụng.",
  "accepted_speech": ["mother"],
  "image_asset": null,
  "audio_asset": null,
  "sort_order": 1
}
```

`audio_asset = null` nghĩa là dùng TTS trên thiết bị/trình duyệt. Nếu có file âm thanh do nhóm tự tạo hoặc được phép sử dụng, điền đường dẫn và ưu tiên phát file. Hình là tùy chọn; không lấy ảnh từ sản phẩm khác nếu không có quyền sử dụng.

## Cấu trúc bài học của một từ

1. **Nhận biết:** xem từ và nghe âm thanh, đoán nghĩa trước khi lật thẻ.
2. **Hiểu:** đọc nghĩa, từ loại và một câu ví dụ ngắn với bản dịch.
3. **Nhớ:** trả lời câu hỏi chọn nghĩa hoặc chọn từ trong quiz.
4. **Dùng:** nói từ/câu mẫu và đặt một câu mới. Hai bước này có thể mở từ chi tiết chủ đề sau flashcard, không chặn việc hoàn thành quiz.
5. **Ôn:** từ sai và từ đến hạn xuất hiện ở màn tiến độ.

## Quy tắc viết và kiểm duyệt

- Mỗi từ có một nghĩa chính phù hợp câu ví dụ; nếu nhiều nghĩa, chỉ kiểm tra nghĩa đã dạy.
- Câu ví dụ dài khoảng 3–10 từ, cấu trúc quen thuộc, không dựa vào kiến thức văn hóa riêng.
- IPA dùng cùng một biến thể nhất quán; ghi biến thể được chọn trong metadata chủ đề. Âm TTS có thể khác giọng IPA, nên không dùng làm căn cứ chấm âm vị.
- Phương án nhiễu là từ/nghĩa cùng loại nhưng không gây hai đáp án đúng. Người kiểm duyệt tự làm quiz mẫu trước khi phát hành.
- Dữ liệu có `content_version`, ngày rà soát và người duyệt. Sửa lỗi chính tả giữ ID; thay nghĩa hoặc đáp án tăng phiên bản và rà soát câu hỏi liên quan.
- Từ, ví dụ, hình, âm thanh và bản dịch phải có nguồn hoặc người tạo trong bảng theo dõi nội dung của nhóm. Không sao chép nguyên bộ dữ liệu từ ứng dụng khác.

## Mẫu câu hỏi quiz

| Dạng | Ví dụ | Đáp án |
| --- | --- | --- |
| Chọn nghĩa | “mother” nghĩa là gì? A. mẹ B. bố C. chị gái | A |
| Chọn từ | Từ tiếng Anh của “mẹ” là gì? A. father B. mother C. sister | B |
| Điền từ bằng lựa chọn | My ___ is kind. A. mother B. rice C. kitchen | A |

MVP không dùng nhập tự do cho quiz để tránh nhiều cách viết đúng khó chấm. Mỗi lượt quiz 10 câu rút từ bộ câu hỏi được duyệt; nếu chưa đủ câu hỏi hợp lệ, không phát hành chủ đề.

## Đánh giá câu tự viết

Ứng dụng gửi `word`, `meaning_vi`, `example_en`, câu của người học và yêu cầu phản hồi bằng tiếng Việt. Phản hồi cần cho biết từ mục tiêu có được dùng đúng ngữ cảnh không, chỉ ra tối đa hai lỗi quan trọng, đưa một câu sửa/gợi ý. Câu đúng cũng nhận lời xác nhận ngắn. Không suy đoán trình độ tổng quát từ một câu.
