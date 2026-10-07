```bash
rm -rf node_modules .expo package-lock.json
npm install
npm run web:clear
```

Nếu dùng package-lock đi kèm bản ZIP này thì ưu tiên:

```bash
rm -rf node_modules .expo
npm ci
npm run web:clear
```

## 2. Tạo Supabase project

Tạo project mới trên Supabase Dashboard.

Sau khi project sẵn sàng:

- mở **SQL Editor**;
- mở file:

```text
supabase/migrations/202610050001_init_hustlingo.sql
```

- copy toàn bộ SQL;
- bấm **Run**.

SQL sẽ tạo:

```text
profiles
learning_progress
feedback
```

và RLS để mỗi user chỉ đọc/sửa dữ liệu của chính mình.

## 3. Cấu hình `.env`

```bash
cp .env.example .env
```

Điền:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxx
```

Lấy hai giá trị này trong Supabase Project Settings / Connect.

`Publishable key` là key public cho client. **Không đưa service_role key vào Expo.**

Sau khi đổi `.env`, restart Metro:

```bash
npm run start:clear
```

## 4. Email/password

Supabase Dashboard:

```text
Authentication
→ Providers
→ Email
```

Bật Email provider.

Trong giai đoạn test bạn có 2 lựa chọn:

- giữ `Confirm email` bật: user phải xác nhận email rồi mới đăng nhập;
- tắt `Confirm email`: đăng ký xong vào app ngay.

HustLingo đã xử lý cả hai trường hợp.

## 5. Google Login

### Google Cloud

Tạo OAuth 2.0 Client tại Google Cloud Console.

Lấy:

```text
Client ID
Client Secret
```

### Supabase

Vào:

```text
Authentication
→ Providers
→ Google
```

Bật Google và điền Client ID + Client Secret.

Supabase sẽ hiển thị **Callback URL** dạng:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Thêm URL đó vào **Authorized redirect URIs** của Google OAuth Client.

Google secret chỉ nằm trong Supabase Dashboard, không nằm trong source Expo.

## 6. Facebook Login

Tạo app trong Meta for Developers và thêm Facebook Login.

Supabase:

```text
Authentication
→ Providers
→ Facebook
```

Bật Facebook rồi nhập:

```text
Facebook App ID
Facebook App Secret
```

Trong Meta/Facebook Login thêm callback URL của Supabase:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

Không có Apple Login trong HustLingo.

## 7. Supabase Redirect URLs cho Expo

Vào:

```text
Supabase Dashboard
→ Authentication
→ URL Configuration
```

Thêm ít nhất:

```text
hustlingo://oauth
http://localhost:8081/oauth
```

Khi deploy web bằng Expo/EAS Hosting, thêm URL web thật, ví dụ:

```text
https://your-project.expo.app/oauth
```

Code sử dụng `makeRedirectUri({ scheme: 'hustlingo', path: 'oauth' })`, vì vậy:

- Development Build: `hustlingo://oauth`
- Web local: origin hiện tại + `/oauth`
- Web production: domain web + `/oauth`

## 8. Chạy app

```bash
npm install
cp .env.example .env
# điền Supabase URL + publishable key
npm run web:clear
```

Mobile:

```bash
npm run start:clear
```

Sau đó:

```text
a = Android
w = Web
```

OAuth native nên test bằng **development build / EAS build** với scheme `hustlingo`.

## 9. Kiểm tra project

```bash
npm run validate
npm run typecheck
npx expo-doctor
```

Hoặc:

```bash
npm run check
```

## 10. EAS – Android/iOS

Cài CLI:

```bash
npm install -g eas-cli

eas login
```

Kết nối project:

```bash
eas init
```

Development APK:

```bash
eas build --platform android --profile development
```

Preview APK:

```bash
eas build --platform android --profile preview
```

Production Android:

```bash
eas build --platform android --profile production
```

Production iOS:

```bash
eas build --platform ios --profile production
```

Trước khi build production, thêm biến môi trường Supabase vào EAS environment/project settings:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Đây là public client configuration; bảo mật dữ liệu dựa trên Supabase Auth + RLS.

## 11. Deploy Expo Web

Export thử:

```bash
npx expo export --platform web
```

EAS Hosting:

```bash
eas login
eas deploy
```

Sau khi có domain production, nhớ thêm:

```text
https://YOUR_DOMAIN/oauth
```

vào Supabase **Authentication -> URL Configuration -> Redirect URLs**.

## 12. Deploy database bằng Supabase CLI (không Docker Compose)

Bạn có thể dùng SQL Editor như mục 2, hoặc dùng CLI với project Supabase từ xa:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

`supabase db push` sẽ đẩy migration trong `supabase/migrations/` lên project đã link.

Không cần chạy backend Node riêng và không cần `docker-compose up`.

## 13. Cấu trúc chính

```text
HustLingo/
├── app/                    Expo Router screens
├── assets/                 logo/images
├── src/
│   ├── components/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── services/
│   │   ├── supabase.ts
│   │   └── supabaseData.ts
│   ├── theme/
│   └── types/
├── supabase/
│   └── migrations/
├── eas.json
├── app.config.js
├── .env.example
└── package.json
```

## 14. Gia sư AI

`Gia sư AI` hiện chỉ là UI demo. Không có:

- Gemini/OpenAI/Claude;
- Qwen/Llama;
- LocalAI;
- AI API key;
- AI backend;
- model download.

Điều này là chủ đích của bản hiện tại.
