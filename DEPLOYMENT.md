# HustLingo Deployment – Supabase + Expo/EAS

## Backend/database

Không chạy backend Express và không dùng Docker Compose.

1. Tạo Supabase project.
2. Chạy `supabase/migrations/202610050001_init_hustlingo.sql` trong SQL Editor hoặc `supabase db push`.
3. Bật Email, Google, Facebook trong Authentication -> Providers.
4. Đưa Google/Facebook Client Secret vào Supabase Dashboard
5. Thêm `hustlingo://oauth`, `http://localhost:8081/oauth`, và domain web production `/oauth` vào Auth Redirect URLs.

## Expo

```bash
cp .env.example .env
npm ci
npm run check
npm run web:clear
```

Build Android preview:

```bash
eas login
eas init
eas build --platform android --profile preview
```

Deploy web:

```bash
npx expo export --platform web
eas deploy
```

Sau khi deploy web, thêm URL `https://<domain>/oauth` vào Supabase Redirect URLs.

## Tutor AI Edge Function

Tutor text chat chạy qua Supabase Edge Function, không gọi AI provider trực tiếp từ Expo.

```bash
supabase db push
supabase secrets set OPENAI_API_KEY=<provider-key>
supabase secrets set AI_BASE_URL=https://api.openai.com/v1
supabase secrets set OPENAI_MODEL=gpt-4o-mini
supabase functions deploy tutor-chat
```

Không đưa `AI_API_KEY` vào `.env`, `EXPO_PUBLIC_*` hoặc app bundle. Khi chưa cấu hình
Edge Function, guest mode dùng local fallback để có thể kiểm tra UI và luồng session.
