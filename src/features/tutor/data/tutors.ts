import type { TutorProfile } from '../types';

export const tutors: TutorProfile[] = [
  {
    id: 'emma',
    name: 'Emma',
    role: 'Conversation Tutor',
    initials: 'EM',
    description: 'Friendly • Everyday English',
    tone: 'Thân thiện, nói tự nhiên và khuyến khích bạn diễn đạt tự tin.',
    accent: '#FCECEF',
    specialties: ['Daily conversation', 'Travel', 'Confidence'],
  },
  {
    id: 'david',
    name: 'David',
    role: 'Interview Coach',
    initials: 'DV',
    description: 'Professional • Career English',
    tone: 'Rõ ràng, chuyên nghiệp và tập trung vào cách nói trong công việc.',
    accent: '#EEF4FF',
    specialties: ['Interview', 'Presentation', 'Workplace'],
  }
];
