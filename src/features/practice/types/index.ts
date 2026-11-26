export type PracticeStatus = 'new' | 'learning' | 'review' | 'mastered';
export type PracticeLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type PracticeModeId = 'vocabulary' | 'review' | 'listening' | 'speaking' | 'reading' | 'writing' | 'toeic' | 'ielts';

/** Kept for compatibility with earlier feature contracts. */
export interface PracticeQuestion {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'fill-blank' | 'typing';
  prompt: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
  level?: string;
}

/** Skill tag used by analytics to suggest what to review next. */
export type QuestionKind =
  | 'meaning' | 'translation' | 'fill-blank'
  | 'detail' | 'main-idea' | 'inference' | 'vocabulary-in-context' | 'purpose'
  | 'response' | 'grammar' | 'true-false-not-given'
  | 'writing' | 'speaking';

export interface ChoiceQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  options: string[];
  /** Indexes of every correct option. More than one means the learner must pick them all. */
  answers: number[];
  explanation?: string;
}

export interface TypingQuestion {
  id: string;
  kind: 'fill-blank';
  prompt: string;
  /** Accepted answers, compared case/space-insensitively. */
  accepted: string[];
  hint?: string;
  explanation?: string;
}

export type QuizQuestion = (ChoiceQuestion & { type: 'choice'; wordId?: string }) | (TypingQuestion & { type: 'typing'; wordId?: string });

export interface AnswerRecord {
  questionId: string;
  kind: QuestionKind;
  section?: string;
  correct: boolean;
  /** Human readable answer the learner gave, for the result review. */
  given?: string;
  expected?: string;
  prompt?: string;
  explanation?: string;
  wordId?: string;
}

export interface SelfAssessment {
  id: string;
  label: string;
  /** 1–5 for speaking/writing rubrics, or an estimated band for IELTS tasks. */
  score: number;
  max: number;
}

export interface PracticeResultRecord {
  id: string;
  mode: PracticeModeId;
  title: string;
  level?: string;
  correct: number;
  total: number;
  durationSeconds: number;
  finishedAt: string;
  answers: AnswerRecord[];
  /** Self-rated criteria for speaking/writing; never presented as a verified score. */
  selfAssessment?: SelfAssessment[];
  /** Exam-only estimate such as a TOEIC scaled score or IELTS band. */
  estimate?: { label: string; value: string };
  /** Free text the learner produced (writing) so the result screen can show it. */
  response?: string;
}

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export interface SrsRecord {
  wordId: string;
  /** Days until next review after the last successful recall. */
  intervalDays: number;
  ease: number;
  repetitions: number;
  correctCount: number;
  wrongCount: number;
  lastReviewedAt: string;
  nextReviewAt: string;
}

export interface PracticeData {
  version: 1;
  srs: Record<string, SrsRecord>;
  results: PracticeResultRecord[];
  drafts: Record<string, string>;
}

/** Shared exam engine (TOEIC & IELTS). */
export type ExamId = 'toeic' | 'ielts';
export type ExamSectionId = 'listening' | 'reading' | 'writing' | 'speaking';

export interface ExamGroup {
  id: string;
  exam: ExamId;
  section: ExamSectionId;
  part: string;
  title?: string;
  /** Spoken with text-to-speech for listening items. */
  audioText?: string;
  /** Shown on screen (reading passage, writing chart description, speaking cue card). */
  passage?: string;
  items: ExamItem[];
}

export type ExamItem =
  | (ChoiceQuestion & { type: 'choice' })
  | { type: 'writing'; id: string; kind: 'writing'; prompt: string; minWords: number; sampleAnswer?: string }
  | { type: 'speaking'; id: string; kind: 'speaking'; prompt: string; prepSeconds?: number; sampleAnswer?: string };

export interface ExamResponse {
  /** Selected option indexes for choice items. */
  selected?: number[];
  /** Typed text for writing items. */
  text?: string;
  /** Learner self-rating (IELTS band 1–9) for writing/speaking items. */
  selfBand?: number;
  flagged?: boolean;
}

export interface ExamModeConfig {
  id: 'practice' | 'mini' | 'full';
  title: string;
  description: string;
  /** Number of questions; null = every question in the chosen sections. */
  questionCount: number | null;
  /** Seconds per question used to size the timer; null = untimed. */
  secondsPerQuestion: number | null;
}
