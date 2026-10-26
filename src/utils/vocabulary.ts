import {
  ENGLISH_VOCABULARY,
  PRODUCTION_VOCABULARY,
  VOCABULARY_REVIEW_QUEUE,
  type LocalVocabularyRecord,
  type VocabularyRelevance,
  type VocabularyTopicId,
} from '@/data/vocabulary-en';
import { VOCABULARY_TOPICS } from '@/data/vocabulary-topics';

/** Production-safe bank used by learner-facing screens. */
export const englishVocabulary = PRODUCTION_VOCABULARY;
/** Full 10,000-record bank for admin/review/migration only. */
export const allEnglishVocabulary = ENGLISH_VOCABULARY;
export const vocabularyReviewQueue = VOCABULARY_REVIEW_QUEUE;

export function normalizeTopic(topic?: string | null): VocabularyTopicId | null {
  if (!topic) return null;
  const value = topic.trim().toLowerCase();
  const match = VOCABULARY_TOPICS.find((item) =>
    item.id === value || item.label.toLowerCase() === value || item.labelVi.toLowerCase() === value
  );
  return match?.id ?? null;
}

export function findWords(query = '', level?: string, topic?: string | null, limit = 100): LocalVocabularyRecord[] {
  const q = query.trim().toLowerCase();
  const normalizedTopic = normalizeTopic(topic);
  const out: LocalVocabularyRecord[] = [];
  for (const word of englishVocabulary) {
    if (level && level !== 'Tất cả' && String(word.cefrLevel ?? word.difficulty).toUpperCase() !== level.toUpperCase()) continue;
    if (normalizedTopic && word.topicId !== normalizedTopic) continue;
    if (q && !word.term.toLowerCase().includes(q) && !word.translation.toLowerCase().includes(q)) continue;
    out.push(word);
    if (out.length >= limit) break;
  }
  return out;
}

export function wordsForTopic(topic: string, limit = 200) {
  const normalized = normalizeTopic(topic);
  if (!normalized) return [];
  return englishVocabulary.filter((word) => word.topicId === normalized).slice(0, limit);
}

export function wordsForLevel(level: string, limit = 200) {
  const normalized = level.toUpperCase();
  return englishVocabulary.filter((word) => String(word.cefrLevel ?? word.difficulty).toUpperCase() === normalized).slice(0, limit);
}

export function wordsForExam(exam: 'toeic' | 'ielts' | 'academic' | 'business', minimum: Exclude<VocabularyRelevance, 'none'> = 'medium', limit = 300) {
  const rank: Record<VocabularyRelevance, number> = { none: 0, low: 1, medium: 2, high: 3 };
  const field = `${exam}Relevance` as const;
  return englishVocabulary
    .filter((word) => rank[(word[field] as VocabularyRelevance | undefined) ?? 'none'] >= rank[minimum])
    .slice(0, limit);
}

export function byId(id: string) {
  return ENGLISH_VOCABULARY.find((word) => word.id === id);
}

export function randomWords(count: number, level?: string, topic?: string | null) {
  const normalizedTopic = normalizeTopic(topic);
  const pool = englishVocabulary.filter((word) => {
    if (level && String(word.cefrLevel ?? word.difficulty).toUpperCase() !== level.toUpperCase()) return false;
    if (normalizedTopic && word.topicId !== normalizedTopic) return false;
    return true;
  });
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
