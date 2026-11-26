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
npx eas-cli@latest login
npx expo export --platform web
npx eas-cli@latest deploy --prod
```

Lần deploy đầu tiên, EAS sẽ yêu cầu đăng nhập nếu chưa có phiên, liên kết hoặc tạo EAS project, rồi chọn subdomain. URL production sẽ có dạng `https://<subdomain>.expo.app`.

Sau khi deploy web, thêm các URL sau vào Supabase Dashboard → Authentication → URL Configuration → Redirect URLs:

```text
https://<subdomain>.expo.app/oauth
hustlingo://oauth
```

Thay `<subdomain>` bằng tên đã chọn trong EAS. Luồng web lấy callback từ domain đang mở; luồng native dùng scheme `hustlingo://oauth`, nên sau này build app iOS/Android không cần thay callback trong mã nguồn. Google Client Secret tiếp tục được lưu riêng trong Supabase Auth provider.

## Trình chiếu điện thoại trên laptop

```bash
npm run demo
```

Lệnh này khởi động Expo Web và mở `http://localhost:8081/demo-phone.html` trong cửa sổ Chrome riêng khi chạy trên WSL có Chrome trên Windows. Có thể chọn iPhone, Android hoặc màn hình nhỏ, thao tác với app trong khung và bật toàn màn hình bằng nút Trình chiếu. Nhấn Esc hoặc Thoát trình chiếu để quay lại bảng điều khiển.

App trong khung dùng bản web local và cấu hình `.env` hiện tại. Để chọn cổng khác, chạy `HUSTLINGO_DEMO_PORT=8082 npm run demo`. Nhấn Ctrl+C ở terminal chạy lệnh để dừng Expo.
