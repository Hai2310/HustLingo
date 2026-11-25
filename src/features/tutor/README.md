# Feature: Gia sư AI

## Được code
- `screens/`: Tutor list, scenario, chat/call UI sau này.
- `components/`: TutorCard, ChatBubble, VoiceWave, CallControls...
- `data/`: dữ liệu nguồn để seed database. Runtime lấy danh sách gia sư, tình huống và hội thoại mẫu đã publish qua `learningContentService` trong `src/services/learningContent.ts`.
- `hooks/`: state chat/call UI.
- `types/`: tutor/message/scenario.

## Start
Code UI trong `screens/TutorScreen.tsx`; tab `app/(tabs)/tutor.tsx` đã trỏ tới file này.

API cung cấp context scenario từ Supabase; kết nối nhà cung cấp mô hình AI cần được thực hiện ở backend/Edge Function để giữ khóa AI ngoài ứng dụng. Danh sách API hiện có nằm trong `src/services/README.md`.
