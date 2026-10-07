# Feature: Gia sư AI

**Owner:** Thành viên Gia sư AI.

## Được code
- `screens/`: Tutor list, scenario, chat/call UI sau này.
- `components/`: TutorCard, ChatBubble, VoiceWave, CallControls...
- `data/`: Emma/David, scenarios, demo messages và toàn bộ 10.000 vocabulary để dùng cho context/prompt sau này.
- `hooks/`: state chat/call UI.
- `types/`: tutor/message/scenario.

## Hiện tại
Không nối STT/LLM/TTS thật. Tab public vẫn trống cho tới khi thành viên chủ động triển khai.

## Không tự sửa
Supabase/Auth/Layout chung. Future AI service phải thống nhất interface với Backend/Core.

## Start
Code UI trong `screens/TutorScreen.tsx`; tab `app/(tabs)/tutor.tsx` đã trỏ tới file này.
