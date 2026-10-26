
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
