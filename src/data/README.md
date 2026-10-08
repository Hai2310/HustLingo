# Shared data

- `vocabulary-en.ts`: dataset gốc đầy đủ **10.000 từ tiếng Anh**. Đây là single source of truth.
- `content.ts`: nội dung học hiện có dùng chung (topics, listening, reading, writing, speaking, tutor scenarios).
- `grammar.ts`: compatibility re-export sang `src/features/lessons/data/grammar.ts`.
- `tutors.ts`: compatibility re-export sang `src/features/tutor/data/tutors.ts`.

Mỗi feature có `data/vocabulary.ts` để truy cập toàn bộ 10.000 từ mà không sao chép dataset ba lần trong bundle.
