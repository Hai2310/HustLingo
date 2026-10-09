# 12. Milestone Gia sư AI

## Tổng quan

Milestone được sắp theo một vertical slice: mỗi mốc tạo ra một phần có thể chạy và kiểm thử được.

```text
M0 Foundation
  ↓
M1 Tutor and Scenario UI
  ↓
M2 Real Text Chat
  ↓
M3 Learning Feedback
  ↓
M4 Reliability and Release
  ↓
M5 Voice Extension
```

MVP kết thúc ở M4. M5 là phần mở rộng sau khi text tutor ổn định.

## M0 — Foundation

### Mục tiêu

Chuẩn bị contract và cấu trúc để UI, API và data không phụ thuộc lẫn nhau.

### Công việc

- Tạo types cho tutor, scenario, message, session, correction.
- Chuẩn hóa scenario metadata.
- Tạo topic mapping tới `src/data`.
- Tạo trạng thái session.
- Tạo interface `TutorApi`.
- Quyết định Edge Function/API route.
- Thêm `.env.example` chỉ chứa public URL, không chứa secret AI.

### Hoàn thành khi

- TypeScript compile được.
- Một scenario có thể tạo thành session local.
- Không có API call từ UI trực tiếp tới provider.

## M1 — Tutor and Scenario UI

### Mục tiêu

Người dùng đi được từ tab Tutor đến màn hình bắt đầu luyện tập.

### Công việc

- Tutor Home.
- Tutor card.
- Scenario list.
- Scenario detail.
- Level/objective/topic display.
- Empty/loading/error states.
- Navigation tới Chat screen.

### Hoàn thành khi

- Có thể chọn Emma/David.
- Có thể chọn scenario.
- Có thể bắt đầu một session local.
- UI sử dụng theme và component chung của app.

## M2 — Real Text Chat

### Mục tiêu

Người dùng có thể trò chuyện thật với AI trong một scenario.

### Công việc

- Tạo Edge Function `tutor-chat`.
- Xác thực user bằng JWT.
- Kiểm tra `scenarioId` và session ownership.
- Gửi message tới AI provider phía server.
- Hiển thị loading/typing.
- Retry và timeout.
- Giới hạn độ dài history/context.
- Hiển thị lỗi thân thiện.

### Hoàn thành khi

- User gửi được message và nhận response thật.
- AI giữ đúng scenario.
- Không có API key trong bundle Expo.
- Request lỗi không làm crash app.

## M3 — Learning Feedback

### Mục tiêu

AI không chỉ trả lời mà còn giúp user học từ lỗi.

### Công việc

- Correction card.
- Hint action.
- Suggested replies.
- Vocabulary extraction.
- Session summary.
- Lưu từ mới vào learning state.
- Lưu correction quan trọng.
- Gợi ý scenario tiếp theo.

### Hoàn thành khi

- User xem được lỗi và cách sửa.
- User có thể lưu từ mới.
- Summary phản ánh đúng session hiện tại.
- Không ghi progress khi API trả lỗi.

## M4 — Reliability and Release

### Mục tiêu

Đưa text tutor thành tính năng có thể demo và sử dụng ổn định.

### Công việc

- Local session recovery.
- Offline/error state.
- Empty state.
- Rate limit và token budget phía server.
- Logging lỗi không chứa nội dung nhạy cảm không cần thiết.
- Kiểm tra RLS/session ownership.
- Responsive web/mobile.
- Test navigation và API mock.
- Cập nhật validator để không còn coi Tutor là màn trống.
- Viết hướng dẫn cấu hình và vận hành.

### Hoàn thành khi

- Có thể demo trọn luồng:

```text
Tutor Home
→ Scenario
→ Chat thật
→ Correction
→ Summary
```

- API key không xuất hiện trong source hoặc app bundle.
- User A không xem được session của user B.
- App vẫn hoạt động rõ ràng khi API timeout hoặc hết hạn mức.

## M5 — Voice Extension

### Mục tiêu

Cho phép luyện nói bằng microphone và audio response.

### Công việc

- Speech-to-Text endpoint.
- Recording permission.
- Push-to-talk.
- Recording/processing/speaking states.
- Text-to-Speech endpoint.
- Audio playback và stop.
- Retry khi STT/TTS lỗi.
- Giới hạn thời lượng và chi phí.

### Hoàn thành khi

- User nói một lượt và nhận được transcript.
- AI trả lời bằng text/audio.
- Có thể dừng và thử lại.
- Text chat vẫn dùng được khi voice service lỗi.

## Thứ tự commit đề xuất

```text
feat(tutor): add tutor and scenario types
feat(tutor): build tutor home and scenario flow
feat(tutor): add tutor chat session state
feat(tutor): connect secure tutor chat endpoint
feat(tutor): add corrections and session summary
test(tutor): cover chat states and failure paths
feat(tutor): add voice input and audio response
```

## Tiêu chí giữ phạm vi

- Mỗi milestone phải chạy được độc lập.
- Không thêm voice trước khi text chat ổn định.
- Không thêm memory dài hạn trước khi session summary hoạt động.
- Không đưa logic gọi provider vào component.
- Không nhân bản vocabulary hoặc skill data trong Tutor.
- Mọi API mới phải có timeout, lỗi rõ ràng và giới hạn chi phí.
