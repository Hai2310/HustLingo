# 04. Nội dung và dữ liệu học tập

## Nguồn dùng chung theo README

Vocabulary, grammar, listening, speaking, reading, writing, TOEIC/IELTS và review chia sẻ data layer. Lessons dạy nội dung, Practice dùng để luyện/ôn, Tutor dùng một phần làm ngữ cảnh tương lai; feature chỉ giữ mapping/config hoặc adapter riêng, không nhân bản kho từ.

README mô tả đích `src/data/vocabulary/` và các thư mục theo kỹ năng. Hiện repo dùng `src/data/vocabulary-en.json` nạp qua `src/data/vocabulary-en.ts`, cùng các file dữ liệu mẫu tại `src/features/*/data/`. Chưa di chuyển thư mục trong lần cập nhật docs này.

## Chất lượng từ vựng

- `ENGLISH_VOCABULARY`: 10.000 raw records phục vụ tương thích/rà soát.
- `PRODUCTION_VOCABULARY`: 4.129 bản ghi qua cổng chất lượng; vẫn cần duyệt nghĩa/ví dụ trước khi đưa vào bài bàn giao.
- `VOCABULARY_REVIEW_QUEUE`: 5.871 bản ghi chưa được phép đưa mặc định vào luồng học.
- `cefrLevel` hiện là ước lượng tần suất; `toeicRelevance`/`ieltsRelevance` là mức liên quan, không phải nguồn bài thi chính thức.

Schema TypeScript hiện có gồm `id`, `term`, `translation`, `ipa/pronunciation`, `partOfSpeech`, `exampleSentence`, `exampleTranslation`, `topicId`, `cefrLevel`, nguồn/confidence/quality. Synonyms, antonyms, collocations và verified trong README là mục tiêu bổ sung metadata, chưa có đầy đủ. Xem [VOCABULARY_DATA_PRODUCTION.md](VOCABULARY_DATA_PRODUCTION.md).

## Manifest nội dung bản 10 tuần

| Mảng | Tập mẫu cần bàn giao |
| --- | --- |
| Vocabulary/Grammar | Ít nhất một topic đã duyệt và bài ngữ pháp có giải thích/ví dụ/câu luyện; ID nối được Lessons/Practice |
| Listening | Ít nhất một bài audio/TTS có transcript và câu hỏi |
| Speaking | Ít nhất một prompt/câu mẫu, nghe mẫu hoặc điều khiển luyện nói; ghi rõ chưa có đánh giá phát âm thật |
| Reading | Ít nhất một đoạn đọc và câu hỏi có đáp án/giải thích |
| Writing | Ít nhất một prompt và lưu draft; không giả phản hồi AI |
| TOEIC/IELTS | Mỗi loại ít nhất một bộ rút gọn có cấu trúc câu hỏi, thời gian và kết quả mẫu |
| Tutor | Emma/David, scenario và demo messages, không có hội thoại AI runtime |

Tập bàn giao phải ghi ID, người soạn/duyệt, nguồn/license và phiên bản; không đồng nghĩa đã phủ đủ A1–C1. Có thể chọn 100 từ để kiểm thử, nhưng không cố định sản phẩm chỉ có 100 từ.

## Câu hỏi quiz và ảnh

| Dạng | Ví dụ |
| --- | --- |
| Chọn nghĩa | mother → chọn “mẹ” |
| Chọn từ theo nghĩa | “mẹ” → chọn mother |
| Điền từ bằng lựa chọn | My ___ is kind. → mother |
| Xem ảnh chọn từ | Ảnh con hổ → chọn tiger giữa tiger/lion/bear |

Câu ảnh cần `imageAsset`, `imageAltVi`, `fallbackPromptVi`; ảnh rõ một mục tiêu, không ghi từ đáp án, có quyền sử dụng và tải được trên Android/web. Câu chữ thay thế và ảnh dẫn tới cùng đáp án. Bài học phải dạy từ mục tiêu trước khi kiểm tra; không ép từ trừu tượng vào câu ảnh.

Bài tự luyện cục bộ có thể chứa đáp án để phản hồi offline. Ngân hàng dùng cho kết quả được server xác nhận phải tách riêng, không đóng gói đáp án trong app. Bài học/quy tắc nội dung admin P1 dùng draft → review → publish; câu đang làm giữ đúng phiên bản cũ.

## Quy tắc kiểm duyệt

Một nghĩa chính phù hợp ngữ cảnh; ví dụ ngắn, chính xác; distractors không tạo nhiều đáp án đúng. TTS/IPA có thể khác giọng, không dùng để tuyên bố chấm âm vị. Kiểm tra ID unique, đáp án thuộc options, tài sản tồn tại, time limit và tags đúng. AI sinh nội dung phải được người duyệt trước khi công bố.
