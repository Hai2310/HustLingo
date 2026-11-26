import type { Ionicons } from '@expo/vector-icons';
import type { PracticeModeId } from '../types';

type IconName = keyof typeof Ionicons.glyphMap;

/** Practice hub entries. `route` is the Expo Router path of the mode. */
export const PRACTICE_MODES: { id: PracticeModeId; title: string; subtitle: string; icon: IconName; color: string; background: string; route: string; group: 'core' | 'skill' | 'exam' }[] = [
  { id: 'vocabulary', title: 'Vocabulary Quiz', subtitle: 'Trắc nghiệm Anh ↔ Việt, điền từ', icon: 'text-outline', color: '#3478F6', background: '#EAF2FF', route: '/practice/quiz', group: 'core' },
  { id: 'review', title: 'Ôn tập', subtitle: 'Flashcard lặp lại ngắt quãng', icon: 'albums-outline', color: '#D10A34', background: '#FFF0F3', route: '/practice/review', group: 'core' },
  { id: 'listening', title: 'Listening', subtitle: 'Nghe, chỉnh tốc độ, xem transcript', icon: 'headset-outline', color: '#12B8C4', background: '#E4FAFB', route: '/practice/listening', group: 'skill' },
  { id: 'speaking', title: 'Speaking', subtitle: 'Ghi âm, nghe lại, so với mẫu', icon: 'mic-outline', color: '#FF5B62', background: '#FFE9E7', route: '/practice/speaking', group: 'skill' },
  { id: 'reading', title: 'Reading', subtitle: 'Đọc hiểu có giải thích', icon: 'reader-outline', color: '#39B980', background: '#E6F8F0', route: '/practice/reading', group: 'skill' },
  { id: 'writing', title: 'Writing', subtitle: 'Đếm từ, lưu nháp, bài mẫu', icon: 'create-outline', color: '#D78218', background: '#FFF1D9', route: '/practice/writing', group: 'skill' },
  { id: 'toeic', title: 'TOEIC', subtitle: 'Listening & Reading, có bấm giờ', icon: 'school-outline', color: '#6C63FF', background: '#EFEEFF', route: '/practice/exam?exam=toeic', group: 'exam' },
  { id: 'ielts', title: 'IELTS', subtitle: '4 kỹ năng, band ước lượng', icon: 'ribbon-outline', color: '#B98520', background: '#F8E8B9', route: '/practice/exam?exam=ielts', group: 'exam' },
];
