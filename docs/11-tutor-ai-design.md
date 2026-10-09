# 11. Thiết kế Gia sư AI

## 1. Mục tiêu

Gia sư AI giúp người học luyện tiếng Anh theo tình huống thực tế. Phiên bản đầu tiên tập trung vào một vòng lặp ngắn, dễ hiểu:

```text
Chọn tình huống
    ↓
Trò chuyện với AI
    ↓
Nhận sửa lỗi và gợi ý
    ↓
Xem tổng kết buổi học
```

Mục tiêu là tạo cảm giác đang luyện với một gia sư, không phải xây một chatbot tổng quát.

## 2. Nguyên tắc sản phẩm

- Text-first: hoàn thiện hội thoại văn bản trước khi thêm voice.
- Scenario-first: AI luôn có vai trò, mục tiêu và bối cảnh cụ thể.
- KISS: một luồng học hoàn chỉnh quan trọng hơn nhiều màn hình rời rạc.
- Feedback ngắn: sửa lỗi vừa đủ để người học tiếp tục nói.
- Dữ liệu học dùng chung: Tutor đọc dữ liệu từ `src/data/`, không sao chép kho từ.
- API thật chạy phía server; Expo app không chứa API key.
- Khi AI lỗi hoặc hết hạn mức, app vẫn hiển thị trạng thái rõ ràng và không mất session.

## 3. Luồng người dùng

```text
Tutor Home
    ↓
Chọn tutor hoặc scenario
    ↓
Scenario Detail
    ↓
Start Practice
    ↓
Tutor Chat
    ├── Gửi câu trả lời
    ├── Xin gợi ý
    ├── Xem sửa lỗi
    └── Kết thúc session
    ↓
Session Summary
```

### Tutor Home

Hiển thị:

- Emma: Everyday Conversation.
- David: Career and Interview English.
- Scenario nổi bật.
- Level và mục tiêu học.
- Session gần nhất nếu đã đăng nhập.

### Scenario Detail

Mỗi scenario có:

- `id`, tiêu đề, mô tả.
- Tutor phù hợp.
- Level.
- Vai trò của người học.
- Mục tiêu giao tiếp.
- Từ/cụm từ nên dùng.
- Câu mở đầu mẫu.
- Nút bắt đầu luyện tập.

### Tutor Chat

Chức năng tối thiểu:

- Hiển thị message của learner và tutor.
- Gửi message đến API.
- Loading/typing state.
- Retry khi request lỗi.
- Xin gợi ý câu trả lời.
- Hiển thị correction sau câu trả lời của learner.
- Kết thúc session.

Chat không tự động sửa mọi câu trong luồng chính. Correction được hiển thị gọn bên dưới message để không ngắt cuộc hội thoại.

### Session Summary

Kết quả một session gồm:

- Số lượt trao đổi.
- Các lỗi nổi bật.
- Từ/cụm từ mới.
- Câu trả lời tốt.
- Gợi ý luyện tiếp theo.
- Nút lưu từ vào learning state.

### Session lifecycle

Một session bắt đầu khi user bấm `Start practice` và kết thúc khi user bấm `Finish`,
đạt 30 lượt learner, hoặc hoàn tất mục tiêu scenario. Rời màn hình chưa xóa session;
local storage giữ snapshot để có thể phục hồi ở bước tiếp theo.

Trạng thái được dùng:

```text
active → completed
active → paused → abandoned
```

MVP chỉ tạo summary khi kết thúc. Long-term memory chưa tự lưu toàn bộ transcript;
chỉ các correction/vocabulary có cấu trúc mới được phép trở thành learning signal sau
khi có bước lọc phía server.

## 4. Phân loại scenario và dữ liệu

Scenario dùng dữ liệu riêng trong `src/features/tutor/data/`, còn nội dung học lấy từ data layer chung.

| Scenario | Tutor | Chủ đề dữ liệu chính | Kỹ năng hỗ trợ |
|---|---|---|---|
| Coffee Shop | Emma | `food`, `shopping`, `daily` | Speaking, Listening |
| University | Emma | `education`, `academic` | Speaking, Reading |
| Travel | Emma | `travel`, `daily` | Speaking, Listening |
| Job Interview | David | `workplace`, `business` | Speaking, Writing |
| Presentation | David | `academic`, `business`, `communication` | Speaking, Writing |
| Meeting | David | `workplace`, `business`, `communication` | Listening, Speaking |

Nguồn dữ liệu:

- `src/data/vocabulary-en.ts` và `src/data/vocabulary-en.json`: vocabulary source of truth.
- `src/data/vocabulary-topics.ts`: topic IDs và metadata.
- `src/data/content.ts`: topics và dữ liệu mẫu listening/reading/writing/speaking.
- `src/data/grammar.ts`: grammar dùng để giải thích correction.
- `src/features/tutor/data/`: tutor, scenario mapping và demo data.

Không gửi toàn bộ 10.000 từ vào mỗi prompt. Server chỉ chọn một context nhỏ theo:

```text
scenario topic
user level
session goal
recent mistakes
```

Topic mapping phải dùng ID trong `VOCABULARY_TOPICS`. Ví dụ Daily Life dùng `daily`, không tạo một topic `daily-life` thứ hai chỉ cho Tutor.

## 5. API contract

API key và prompt hệ thống nằm ở Supabase Edge Function hoặc backend tương đương.

### Request

```json
{
  "sessionId": "session-uuid",
  "scenarioId": "coffee",
  "tutorId": "emma",
  "action": "message",
  "message": "I want order a coffee",
  "history": [
    {
      "role": "tutor",
      "content": "Welcome. What would you like?"
    }
  ]
}
```

Các action MVP:

- `message`
- `hint`
- `correct`
- `summary`

### Response

```json
{
  "message": "Sure. What size would you like?",
  "correction": {
    "original": "I want order a coffee",
    "corrected": "I would like to order a coffee.",
    "explanation": "Use 'would like to' for a polite order."
  },
  "suggestedReplies": [
    "A medium latte, please."
  ],
  "newVocabulary": [
    {
      "term": "medium",
      "meaning": "cỡ vừa"
    }
  ],
  "usage": {
    "inputTokens": 120,
    "outputTokens": 80
  }
}
```

Client không được tự gửi `userId`, role hoặc entitlement để server tin tưởng. Server lấy user từ JWT và tự kiểm tra session ownership.

## 6. Prompt context

Server tạo prompt từ các lớp sau:

1. Tutor persona.
2. Scenario rules.
3. Learner level và goal.
4. Một tập vocabulary/grammar nhỏ liên quan.
5. Recent conversation.
6. Recent correction, nếu có.

Tutor phải:

- Giữ đúng vai trò scenario.
- Trả lời ngắn, phù hợp level.
- Không biến mọi message thành bài giảng.
- Chỉ sửa lỗi quan trọng hoặc khi learner yêu cầu.
- Không bịa điểm thi/chứng chỉ chính thức.
- Không trả về dữ liệu riêng của user khác.

## 7. Cấu trúc code đề xuất

```text
src/features/tutor/
├── screens/
│   ├── TutorScreen.tsx
│   ├── ScenarioScreen.tsx
│   ├── TutorChatScreen.tsx
│   └── TutorSummaryScreen.tsx
├── components/
│   ├── TutorCard.tsx
│   ├── ScenarioCard.tsx
│   ├── ChatBubble.tsx
│   ├── ChatComposer.tsx
│   ├── CorrectionCard.tsx
│   └── TypingIndicator.tsx
├── hooks/
│   ├── useTutorChat.ts
│   └── useTutorSession.ts
├── services/
│   └── tutorApi.ts
├── data/
├── types/
└── index.ts
```

`tutorApi.ts` chỉ gọi Edge Function. Không đặt provider SDK hoặc secret trong `src/`.

## 8. State và lỗi

Chat cần các state:

- `idle`
- `loading`
- `streaming`
- `ready`
- `error`
- `completed`

Các trường hợp phải xử lý:

- Chưa cấu hình API.
- Timeout.
- Mất mạng.
- Hết hạn mức.
- Response không hợp lệ.
- User rời màn hình khi request đang chạy.

Session đang mở phải giữ local để user có thể retry hoặc xem lại lỗi. Chỉ ghi progress/vocabulary sau khi request thành công.

## 9. Phạm vi chưa làm trong MVP

- Voice real-time.
- Pronunciation scoring.
- Multi-agent/group conversation.
- Long-term memory toàn bộ lịch sử.
- Subscription và quota trả phí.
- Admin CMS cho prompt/scenario.
- Chấm điểm TOEIC/IELTS chính thức.

Voice là phase tiếp theo sau khi text chat, correction và summary ổn định.
