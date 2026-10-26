export type BillingCycle = 'monthly' | 'yearly';
export type PlanId = 'free' | 'plus' | 'pro';

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  eyebrow: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  highlight?: string;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    eyebrow: 'BẮT ĐẦU',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Đủ để tạo thói quen học tiếng Anh mỗi ngày.',
    features: ['Từ vựng & flashcard cơ bản', 'Bài luyện nghe, đọc, ngữ pháp', 'Lưu tiến độ trên thiết bị'],
  },
  {
    id: 'plus',
    name: 'Plus',
    eyebrow: 'PHỔ BIẾN',
    monthlyPrice: 49000,
    yearlyPrice: 470000,
    description: 'Dành cho người học đều đặn và muốn lộ trình sâu hơn.',
    highlight: 'Được chọn nhiều',
    features: ['Toàn bộ nội dung Free', 'Bộ luyện TOEIC & IELTS mở rộng', 'Ôn tập nâng cao theo tiến độ', 'Đồng bộ tiến độ nhiều thiết bị'],
  },
  {
    id: 'pro',
    name: 'Pro',
    eyebrow: 'TỐI ĐA',
    monthlyPrice: 99000,
    yearlyPrice: 950000,
    description: 'Cho người học nghiêm túc, luyện thi và theo dõi tiến bộ dài hạn.',
    features: ['Toàn bộ nội dung Plus', 'Full mock test & bộ đề nâng cao', 'Thống kê học tập chuyên sâu', 'Ưu tiên các tính năng mới'],
  },
];

export function formatVnd(value: number) {
  if (value === 0) return '0đ';
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`;
}
