import { isAuthError } from '@supabase/supabase-js';

const messages = new Map([
  ['email_address_not_authorized', 'Supabase chưa cho phép gửi email xác nhận tới địa chỉ này. Bạn có thể thử đăng ký bằng Google.'],
  ['over_email_send_rate_limit', 'Dự án đã đạt giới hạn gửi email. Vui lòng đợi rồi thử lại.'],
  ['over_request_rate_limit', 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi rồi thử lại.'],
  ['email_not_confirmed', 'Bạn cần bấm liên kết xác nhận trong email trước khi đăng nhập.'],
  ['email_address_invalid', 'Địa chỉ email này không hợp lệ. Hãy kiểm tra rồi thử lại.'],
  ['user_already_exists', 'Email này đã có tài khoản. Hãy đăng nhập.'],
  ['invalid_credentials', 'Email hoặc mật khẩu chưa đúng.'],
  ['signup_disabled', 'Dự án Supabase đang tạm tắt đăng ký tài khoản mới.'],
  ['pkce_code_verifier_not_found', 'Nếu bạn vừa xác nhận email, hãy quay lại trang đăng nhập để đăng nhập bằng mật khẩu. Với Google, hãy thử lại trong trình duyệt đã mở app.'],
]);

export function authMessage(error: unknown, fallback: string) {
  if (isAuthError(error)) return messages.get(error.code ?? '') ?? error.message;
  return error instanceof Error ? error.message : fallback;
}
