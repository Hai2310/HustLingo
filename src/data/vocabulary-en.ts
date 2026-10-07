/**
 * HustLingo production vocabulary bank.
 *
 * IMPORTANT:
 * - ENGLISH_VOCABULARY preserves all 10,000 legacy records for compatibility/review.
 * - PRODUCTION_VOCABULARY exposes only records that pass the production quality gate.
 * - CEFR values are frequency-based estimates unless a future verified CEFR source replaces them.
 * - toeicRelevance/ieltsRelevance are learning relevance labels, NOT official exam word lists.
 */

export type VocabularyCefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type VocabularyRelevance = 'high' | 'medium' | 'low' | 'none';
export type VocabularyQuality = 'production' | 'review';
export type VocabularyTopicId =
  | 'daily' | 'communication' | 'family' | 'food' | 'travel' | 'education'
  | 'business' | 'workplace' | 'health' | 'shopping' | 'technology'
  | 'environment' | 'society' | 'culture' | 'academic';

export interface LocalVocabularyRecord {
  id: string; languageCode: string; term: string; translation: string;
  partOfSpeech?: string; pronunciation?: string | null; ipa?: string | null;
  exampleSentence?: string; exampleTranslation?: string; topic?: string; difficulty?: string;
  examTags?: string[]; frequencyRank?: number;
  topicId?: VocabularyTopicId;
  cefrLevel?: VocabularyCefr;
  cefrSource?: 'frequency-estimate' | 'verified';
  cefrConfidence?: 'high' | 'medium' | 'low';
  toeicRelevance?: VocabularyRelevance;
  ieltsRelevance?: VocabularyRelevance;
  academicRelevance?: VocabularyRelevance;
  businessRelevance?: VocabularyRelevance;
  quality?: VocabularyQuality;
  isActive?: boolean;
  sourceSegment?: 'frequency-core' | 'legacy-dictionary-fill';
  translationSource?: 'curated-override' | 'legacy-dictionary' | 'verified';
  pronunciationSource?: 'cmudict' | 'legacy-dictionary' | 'missing';
  exampleQuality?: 'verified' | 'legacy' | 'generated' | 'missing';
  reviewFlags?: string[];
}

// Keep the 10,000-record payload in JSON so TypeScript does not infer an enormous literal union.
// Expo/Metro supports static JSON require.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const RAW_VOCABULARY = require('./vocabulary-en.json') as LocalVocabularyRecord[];

export const ENGLISH_VOCABULARY: LocalVocabularyRecord[] = RAW_VOCABULARY;

export const PRODUCTION_VOCABULARY: LocalVocabularyRecord[] = ENGLISH_VOCABULARY.filter(
  (word) => word.languageCode === 'en' && word.isActive !== false && word.quality === 'production'
);

export const VOCABULARY_REVIEW_QUEUE: LocalVocabularyRecord[] = ENGLISH_VOCABULARY.filter(
  (word) => word.quality === 'review' || word.isActive === false
);
