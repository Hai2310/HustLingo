
export type PracticeStatus = 'new' | 'learning' | 'review' | 'mastered';

export interface PracticeQuestion {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'fill-blank' | 'typing';
  prompt: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
  level?: string;
}

export interface PracticeResult {
  correct: number;
  total: number;
  durationSeconds?: number;
}
