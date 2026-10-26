import { PRODUCTION_VOCABULARY, ENGLISH_VOCABULARY, type LocalVocabularyRecord } from '@/data/vocabulary-en';

/** Learner-facing production bank. */
export const vocabulary = PRODUCTION_VOCABULARY;
/** Full raw/review bank; use only for admin/data QA. */
export const allVocabulary = ENGLISH_VOCABULARY;
export type { LocalVocabularyRecord };
export const VOCABULARY_COUNT = PRODUCTION_VOCABULARY.length;
export const RAW_VOCABULARY_COUNT = ENGLISH_VOCABULARY.length;

export function getVocabularyByLevel(level: string) {
  return PRODUCTION_VOCABULARY.filter((word) => (word.cefrLevel ?? word.difficulty) === level);
}

export function getVocabularyByTopic(topic: string) {
  const q = topic.trim().toLowerCase();
  return PRODUCTION_VOCABULARY.filter((word) => word.topicId === q || word.topic?.toLowerCase() === q);
}

export function searchVocabulary(keyword: string, limit = 100) {
  const q = keyword.trim().toLowerCase();
  if (!q) return PRODUCTION_VOCABULARY.slice(0, limit);
  return PRODUCTION_VOCABULARY
    .filter((word) => word.term.toLowerCase().includes(q) || word.translation.toLowerCase().includes(q))
    .slice(0, limit);
}
