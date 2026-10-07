import { ENGLISH_VOCABULARY, type LocalVocabularyRecord } from '@/data/vocabulary-en';

export const englishVocabulary = ENGLISH_VOCABULARY.filter(w => w.languageCode === 'en');

export function normalizeTopic(topic?: string | null) {
  if (!topic) return null;
  const known = ['Daily Life', 'Technology', 'Travel', 'Education', 'Business', 'Health', 'Society', 'Environment'];
  const match = known.find(x => x.toLowerCase() === topic.toLowerCase());
  return match || topic;
}

export function findWords(query = '', level?: string, topic?: string | null, limit = 100): LocalVocabularyRecord[] {
  const q = query.trim().toLowerCase();
  const normalizedTopic = normalizeTopic(topic);
  const out: LocalVocabularyRecord[] = [];
  for (const word of englishVocabulary) {
    if (level && level !== 'Tất cả' && String(word.difficulty).toUpperCase() !== level.toUpperCase()) continue;
    if (normalizedTopic && word.topic !== normalizedTopic) continue;
    if (q && !word.term.toLowerCase().includes(q) && !word.translation.toLowerCase().includes(q)) continue;
    out.push(word);
    if (out.length >= limit) break;
  }
  return out;
}

export function byId(id: string) { return englishVocabulary.find(x => x.id === id); }

export function randomWords(count: number, level?: string) {
  const pool = level ? englishVocabulary.filter(w => w.difficulty === level) : englishVocabulary;
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
