# Feature: Gia sư AI

**Owner:** Thành viên Gia sư AI.

## Được code
- `screens/`: Tutor home, tutor detail, scenario, chat và summary.
- `components/`: TutorAvatar, TutorCard, ScenarioCard, ChatBubble, CorrectionCard và TypingIndicator.
- `data/`: Emma/David, scenario metadata, demo messages và adapter vocabulary dùng chung.
- `hooks/`: session state, message sending, correction/hint và summary.
- `services/`: API adapter, local fallback và session storage.
- `types/`: tutor, scenario, message, session, correction và API contract.

## Start
Tab `app/(tabs)/tutor.tsx` mở Tutor Home. Luồng hiện tại là:

```text
Tutor Home → Scenario → Chat → Summary
```

Khi Supabase đã cấu hình và user đăng nhập, `services/tutorApi.ts` gọi Edge Function
`tutor-chat`. Khi chưa có backend/AI key, guest dùng local fallback để UI vẫn chạy.
