import { ENGLISH_VOCABULARY, type LocalVocabularyRecord } from '@/data/vocabulary-en';

/** Toàn bộ 10.000 từ vựng gốc của HustLingo. Không tạo bản copy thứ hai để tránh tăng kích thước bundle. */
export { ENGLISH_VOCABULARY };
export type { LocalVocabularyRecord };
export const VOCABULARY_COUNT = ENGLISH_VOCABULARY.length;

export function getVocabularyByLevel(level: string) {
  return ENGLISH_VOCABULARY.filter((word) => word.difficulty === level);
}

export function getVocabularyByTopic(topic: string) {
  return ENGLISH_VOCABULARY.filter((word) => word.topic === topic);
}

export function searchVocabulary(keyword: string, limit = 100) {
  const q = keyword.trim().toLowerCase();
  if (!q) return ENGLISH_VOCABULARY.slice(0, limit);
  return ENGLISH_VOCABULARY
    .filter((word) =>
      word.term.toLowerCase().includes(q) ||
      word.translation.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
