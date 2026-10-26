import type { VocabularyRelevance } from './vocabulary-en';

export type VocabularyExamId = 'toeic' | 'ielts' | 'academic' | 'business';

export interface VocabularyExamDefinition {
  id: VocabularyExamId;
  label: string;
  description: string;
  officialWordList: boolean;
}

export const VOCABULARY_EXAMS: VocabularyExamDefinition[] = [
  { id: 'toeic', label: 'TOEIC', description: 'Relevance for workplace, business, travel and service contexts. This is not an official ETS vocabulary list.', officialWordList: false },
  { id: 'ielts', label: 'IELTS', description: 'Relevance for general and academic IELTS-style learning contexts. This is not an official IELTS vocabulary list.', officialWordList: false },
  { id: 'academic', label: 'Academic English', description: 'Academic study, research, analysis and formal writing relevance.', officialWordList: false },
  { id: 'business', label: 'Business English', description: 'Business, finance, workplace and professional English relevance.', officialWordList: false },
];

export const EXAM_RELEVANCE_ORDER: VocabularyRelevance[] = ['high', 'medium', 'low', 'none'];
