
export interface TutorProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  suitableLevels: readonly string[];
  tone?: string;
  initials?: string;
  accent?: string;
  specialties?: readonly string[];
}

export interface TutorMessage {
  id: string;
  role: 'tutor' | 'learner';
  text: string;
  createdAt?: string;
}

export interface TutorScenario {
  id: string;
  tutorId?: string;
  tutor: string;
  title: string;
  subtitle: string;
  level: string;
  objective?: string;
  learnerRole?: string;
  topicIds?: readonly string[];
  suggestedPhrases?: readonly string[];
  starterPrompt?: string;
  icon?: string;
}

export type TutorSessionStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface TutorCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

export interface TutorVocabularyItem {
  term: string;
  meaning: string;
}

export interface TutorSession {
  id: string;
  tutorId: string;
  scenarioId: string;
  status: TutorSessionStatus;
  startedAt: string;
  endedAt?: string;
  messages: TutorMessage[];
  corrections: TutorCorrection[];
  newVocabulary: TutorVocabularyItem[];
  pendingRequest?: TutorChatRequest;
}

export interface TutorSessionSummary {
  sessionId: string;
  scenarioId: string;
  tutorId: string;
  scenarioTitle?: string;
  messageCount: number;
  durationMinutes: number;
  highlights: string[];
  corrections: TutorCorrection[];
  newVocabulary: TutorVocabularyItem[];
  nextStep: string;
}

export interface TutorChatRequest {
  requestId: string;
  sessionId: string;
  scenarioId: string;
  tutorId: string;
  action: 'message' | 'hint' | 'correct' | 'summary';
  message?: string;
  history: TutorMessage[];
}

export interface TutorChatResponse {
  message: string;
  correction?: TutorCorrection | null;
  suggestedReplies?: string[];
  newVocabulary?: TutorVocabularyItem[];
  tutorMessageId?: string;
  learnerMessageId?: string;
  summary?: TutorSessionSummary;
}

export interface TutorCatalog {
  tutors: TutorProfile[];
  scenarios: TutorScenario[];
}
