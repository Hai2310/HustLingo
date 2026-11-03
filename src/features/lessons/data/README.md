# Lessons data

- **grammar.ts** là nguồn grammar dùng chung cho tab Bài học và bài luyện grammar. Bộ dữ liệu hiện có 98 bài: A1 (21), A2 (21), B1 (22), B2 (18), C1 (16). Mỗi mục có CEFR level, nhóm chủ điểm, công thức, giải thích tiếng Việt, hai ví dụ song ngữ và một lỗi thường gặp.
- **vocabulary.ts** cung cấp learner-facing vocabulary từ dataset gốc **src/data/vocabulary-en.ts** bằng import/re-export, không nhân bản dữ liệu.

## Phạm vi chương trình grammar

HustLingo xây lộ trình theo CEFR A1–C1 vì CEFR mô tả năng lực giao tiếp, không đưa ra một danh sách ngữ pháp tiếng Anh duy nhất áp dụng cho mọi giáo trình. Phạm vi chủ điểm được đối chiếu với Reference Level Descriptions dành cho từng ngôn ngữ và các mục grammar theo A1–A2, B1–B2, C1 của British Council LearnEnglish. Cách xếp từng điểm vào level là lộ trình biên soạn của HustLingo; không phải nhãn chứng nhận của các tổ chức trên.

Nội dung giải thích và ví dụ trong **grammar.ts** được viết riêng cho HustLingo. Nguồn tham khảo và đường dẫn được export tại **grammarCurriculumSources**.
