
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface LessonDefinition {
  id: string;
  title: string;
  level: CefrLevel;
  topicId: string;
  description?: string;
  vocabularyIds?: string[];
  grammarIds?: string[];
  listeningIds?: string[];
  speakingIds?: string[];
  readingIds?: string[];
  writingIds?: string[];
}

export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type LessonKind = 'vocabulary' | 'grammar';
export interface CatalogLesson {
  id: string;
  title: string;
  level: LessonLevel;
  topicId: string;
  kind: LessonKind;
  vocabularyIds: string[];
  grammarIds: string[];
  order: number;
}
export interface LessonTopic {
  id: string;
  title: string;
  description: string;
  icon: 'school-outline' | 'people-outline' | 'airplane-outline' | 'laptop-outline' | 'briefcase-outline' | 'book-outline' | 'sunny-outline' | 'restaurant-outline' | 'leaf-outline' | 'globe-outline' | 'heart-outline' | 'chatbubble-outline' | 'cart-outline';
  color: string;
  background: string;
}
export interface LessonCatalog {
  lessons: CatalogLesson[];
  topics: LessonTopic[];
  source: 'cloud' | 'local';
  notice?: string;
}
export interface LessonContent {
  vocabulary: import('@/data/vocabulary-en').LocalVocabularyRecord[];
  grammar: import('../data/grammar').GrammarPoint[];
  source: 'cloud' | 'local';
  notice?: string;
}
