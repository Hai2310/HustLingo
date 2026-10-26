# 10. Công nghệ và cấu trúc triển khai

## Stack theo README và package.json

| Thành phần | Framework/công nghệ | Ngôn ngữ, trạng thái |
| --- | --- | --- |
| Ứng dụng | Expo SDK 54, React Native 0.81, React 19; React Native Web | TypeScript/TSX; một codebase hướng web/Android/iOS |
| Điều hướng | Expo Router 6 | Routes tại `app/`, layout/tabs/auth |
| UI và state | React Native components, React Context, theme/common UI/motion | AuthContext/LearningContext hiện có; SubscriptionContext dự kiến |
| Bộ nhớ trên máy | AsyncStorage 2.2 | Guest/account state và Supabase session; cần merge/import an toàn |
| Auth và DB client | Supabase JS 2, Supabase Auth | `supabase.ts` tạo client, `supabaseData.ts` adapter chạy trong app |
| Database/backend | Supabase PostgreSQL, SQL migrations, RLS | SQL; profiles/progress/feedback hiện có |
| Audio/OAuth | expo-speech, expo-audio, expo-auth-session, expo-web-browser, expo-linking | Dependencies hiện có; từng luồng vẫn cần tích hợp và kiểm thử |
| Dữ liệu | JSON + TypeScript adapters/types | Raw/production/review vocabulary, dữ liệu kỹ năng/tutor mẫu |
| Backend mở rộng | Supabase Edge Functions trên Deno, RPC PostgreSQL cho transaction | TypeScript/SQL; cần viết cho admin/AI/hạn mức hoặc kết quả xác minh |
| Build/deploy | Expo export + EAS Deploy, EAS Build, Supabase Cloud | Hướng trong README và DEPLOYMENT, chưa phải bằng chứng đã phát hành |

Frontend, client services và Edge Functions dùng TypeScript; database migrations dùng SQL. Không có backend Express riêng trong hướng hiện tại. Phiên bản chính xác lấy từ `package.json`/`package-lock.json`, không tự nâng package giữa chừng khi chưa thử tương thích.

## Thư mục đang có

```text
app/                              Expo Router, auth/tabs/routes
src/features/lessons/             Huy: screens/components/data/hooks/types
src/features/practice/            Dương: screens/components/data/hooks/types
src/features/tutor/               Khánh: screens/components/data/hooks/types
src/features/backend/             Ghi chú Backend/Core
src/components/                   Common, home, auth, navigation, motion
src/contexts/                     AuthContext, LearningContext
src/services/                     supabase.ts, supabaseData.ts
src/data/vocabulary-en.json        10.000 raw records
src/data/vocabulary-en.ts          raw/production/review exports
src/data/                         Các file content/grammar/topics/exam/tutor mẫu
supabase/migrations/               Schema SQL/RLS hiện tại
scripts/                          Validators, render-architecture.ps1
docs/                             Bộ tài liệu triển khai
```

README đề xuất `src/data/vocabulary/`, thư mục theo kỹ năng, services theo chức năng, screens/components chi tiết và nhiều validators. Các mục chưa có phải được tạo/di chuyển có kiểm tra imports; không mô tả như đã tồn tại. Cấu trúc đề xuất là đích tổ chức lại, không lý do để nhân bản dataset.

## Trách nhiệm triển khai

Huy/Dương/Khánh viết trong feature của mình, routes là điểm vào. Hải quản lý Auth, contexts, Supabase/schema/RLS và đồng bộ. Feature dùng chung theme/types/data, mô tả typed contract khi cần backend. Shared/core thay đổi theo interface nhóm thống nhất trong README.

Role/status, entitlement/hạn mức và kết quả xác minh do server kiểm soát. Client chỉ dùng publishable key và JWT. Progress tự luyện được đồng bộ theo chủ sở hữu; cần merge chống trùng/mất update. AI secrets/service key không nằm trong Expo bundle hay `EXPO_PUBLIC_*`.

## Chạy local theo README

```powershell
npm install
Copy-Item .env.example .env
npx expo start --web --clear
```

Chỉ copy `.env.example` nếu chưa có `.env`; điền URL/publishable key của project dev. Không commit secret. Android emulator dùng `npx expo start --android`; điện thoại có thể dùng `npx expo start --tunnel` và Expo Go khi phù hợp. OAuth redirect phải cấu hình cho scheme/domain theo [DEPLOYMENT.md](../DEPLOYMENT.md). Trên Windows dùng `npx` trực tiếp nếu npm script chứa cú pháp biến môi trường kiểu Unix không chạy được.

## Kiểm tra

```powershell
npm run typecheck
npm run validate
node scripts/validate-vocabulary-production.mjs
```

Typecheck cần dependencies. Validator project hiện là gate H.1 còn yêu cầu màn/route feature trống, cần cập nhật khi triển khai UI. Validator vocabulary kiểm 10.000 raw/quality/tags, không chứng minh toàn bộ nội dung đã được người duyệt. `validate-team-structure.mjs` hiện đọc IDs ở TS thay vì JSON nên lỗi; `validate-learning-data.mjs` và bộ validators kỹ năng trong README chưa có. Ghi rõ chúng là công việc cần bổ sung, không dùng làm gate đã đạt.

## Build và deploy dự kiến

Theo README/[DEPLOYMENT.md](../DEPLOYMENT.md), trên project EAS/Supabase đã cấu hình:

```text
npx expo export --platform web
eas deploy
eas build --platform android --profile preview
eas build --platform ios --profile production
```

Các lệnh mô tả quy trình; không được chạy deploy/build cloud trong lần cập nhật tài liệu này. Thêm domain OAuth sau deploy web; migration/RLS phải thử với tài khoản giả trước khi apply vào môi trường thật. iOS cần cấu hình, credentials và kiểm thử riêng, không suy ra hoạt động từ Android.
