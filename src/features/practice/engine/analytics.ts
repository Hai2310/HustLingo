import type { AnswerRecord, PracticeData, PracticeModeId, PracticeResultRecord, QuestionKind, ReviewGrade } from '../types';
import { reviewWord, statusCounts, dueRecords } from './srs';

export const MAX_STORED_RESULTS = 60;

export function emptyPracticeData(): PracticeData {
  return { version: 1, srs: {}, results: [], drafts: {} };
}

/** Accept anything from storage and return a safe, well-formed object. */
export function parsePracticeData(raw: string | null | undefined): PracticeData {
  if (!raw) return emptyPracticeData();
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object') return emptyPracticeData();
    const srs = value.srs && typeof value.srs === 'object' ? Object.fromEntries(Object.entries(value.srs).filter(([, record]: [string, any]) => record && typeof record.wordId === 'string' && typeof record.nextReviewAt === 'string' && !Number.isNaN(Date.parse(record.nextReviewAt)))) : {};
    const results = Array.isArray(value.results) ? value.results.filter((result: any) => result && typeof result.id === 'string' && Number.isFinite(result.correct) && Number.isFinite(result.total) && Array.isArray(result.answers)).slice(0, MAX_STORED_RESULTS) : [];
    const drafts = value.drafts && typeof value.drafts === 'object' ? Object.fromEntries(Object.entries(value.drafts).filter(([, text]) => typeof text === 'string')) as Record<string, string> : {};
    return { version: 1, srs: srs as PracticeData['srs'], results, drafts };
  } catch {
    return emptyPracticeData();
  }
}

export function applyReview(data: PracticeData, wordId: string, grade: ReviewGrade, now: Date): PracticeData {
  return { ...data, srs: { ...data.srs, [wordId]: reviewWord(data.srs[wordId], wordId, grade, now) } };
}

/** Newest first; a result with the same id replaces the old one (idempotent save). */
export function addResult(data: PracticeData, result: PracticeResultRecord): PracticeData {
  return { ...data, results: [result, ...data.results.filter(item => item.id !== result.id)].slice(0, MAX_STORED_RESULTS) };
}

export function setDraft(data: PracticeData, id: string, text: string): PracticeData {
  const drafts = { ...data.drafts };
  if (text.trim()) drafts[id] = text; else delete drafts[id];
  return { ...data, drafts };
}

export const KIND_LABELS: Record<QuestionKind, string> = {
  'meaning': 'Nghĩa của từ (Anh → Việt)',
  'translation': 'Chọn từ tiếng Anh (Việt → Anh)',
  'fill-blank': 'Điền từ vào chỗ trống',
  'detail': 'Câu hỏi chi tiết',
  'main-idea': 'Ý chính',
  'inference': 'Suy luận',
  'vocabulary-in-context': 'Từ vựng trong ngữ cảnh',
  'purpose': 'Mục đích người nói/viết',
  'response': 'Hỏi – đáp (TOEIC Part 2)',
  'grammar': 'Ngữ pháp',
  'true-false-not-given': 'True / False / Not Given',
  'writing': 'Viết',
  'speaking': 'Nói',
};

export const MODE_LABELS: Record<PracticeModeId, string> = {
  vocabulary: 'Vocabulary Quiz', review: 'Ôn tập', listening: 'Listening', speaking: 'Speaking',
  reading: 'Reading', writing: 'Writing', toeic: 'TOEIC', ielts: 'IELTS',
};

export interface KindStat { kind: QuestionKind; label: string; correct: number; total: number; percent: number }

export function statsByKind(answers: AnswerRecord[]): KindStat[] {
  const map = new Map<QuestionKind, { correct: number; total: number }>();
  for (const answer of answers) {
    const entry = map.get(answer.kind) ?? { correct: 0, total: 0 };
    entry.total += 1; if (answer.correct) entry.correct += 1;
    map.set(answer.kind, entry);
  }
  return [...map.entries()].map(([kind, value]) => ({ kind, label: KIND_LABELS[kind], ...value, percent: Math.round(value.correct / value.total * 100) })).sort((a, b) => a.percent - b.percent || b.total - a.total);
}

const ADVICE: Partial<Record<QuestionKind, string>> = {
  'meaning': 'Ôn lại thẻ từ trong mục Ôn tập để nhớ nghĩa lâu hơn.',
  'translation': 'Luyện chiều Việt → Anh: đọc nghĩa rồi tự nói từ trước khi lật thẻ.',
  'fill-blank': 'Học từ cùng câu ví dụ; chú ý chính tả và dạng từ.',
  'detail': 'Gạch chân từ khóa trong câu hỏi rồi tìm đúng đoạn chứa thông tin.',
  'main-idea': 'Đọc/nghe câu mở đầu và kết luận trước khi chọn ý chính.',
  'inference': 'Tìm bằng chứng trong bài; đáp án suy luận phải được bài gợi ý, không chỉ “nghe hợp lý”.',
  'vocabulary-in-context': 'Đoán nghĩa từ câu xung quanh trước khi xem đáp án.',
  'purpose': 'Hỏi “người nói muốn làm gì?” — mời, nhắc nhở, xin lỗi, thông báo…',
  'response': 'Nghe kỹ từ để hỏi (Who/When/Where/Why) — đáp án đúng trả lời đúng loại thông tin đó.',
  'grammar': 'Xác định từ loại/thì cần điền trước khi đọc các lựa chọn.',
  'true-false-not-given': 'Phân biệt “False” (trái với bài) và “Not Given” (bài không nhắc tới).',
};

/** Up to three concrete suggestions based on the weakest question types (min. 2 attempts). */
export function suggestions(answers: AnswerRecord[]) {
  return statsByKind(answers).filter(stat => stat.total >= 2 && stat.percent < 70 && ADVICE[stat.kind]).slice(0, 3).map(stat => ({ ...stat, advice: ADVICE[stat.kind]! }));
}

export interface PracticeSummary {
  sessions: number;
  questions: number;
  correct: number;
  accuracy: number;
  minutes: number;
  byMode: { mode: PracticeModeId; label: string; sessions: number; accuracy: number; lastAt: string }[];
  weakKinds: KindStat[];
  srs: ReturnType<typeof statusCounts> & { dueNow: number };
}

/** Aggregate for the Practice hub, analytics screen and (later) the shared Progress page. */
export function summarisePractice(data: PracticeData, now: Date): PracticeSummary {
  const scored = data.results.filter(result => result.total > 0);
  const questions = scored.reduce((sum, result) => sum + result.total, 0);
  const correct = scored.reduce((sum, result) => sum + result.correct, 0);
  const modes = new Map<PracticeModeId, { sessions: number; correct: number; total: number; lastAt: string }>();
  for (const result of data.results) {
    const entry = modes.get(result.mode) ?? { sessions: 0, correct: 0, total: 0, lastAt: result.finishedAt };
    entry.sessions += 1; entry.correct += result.correct; entry.total += result.total;
    if (result.finishedAt > entry.lastAt) entry.lastAt = result.finishedAt;
    modes.set(result.mode, entry);
  }
  return {
    sessions: data.results.length,
    questions, correct,
    accuracy: questions ? Math.round(correct / questions * 100) : 0,
    minutes: Math.round(data.results.reduce((sum, result) => sum + result.durationSeconds, 0) / 60),
    byMode: [...modes.entries()].map(([mode, entry]) => ({ mode, label: MODE_LABELS[mode], sessions: entry.sessions, accuracy: entry.total ? Math.round(entry.correct / entry.total * 100) : 0, lastAt: entry.lastAt })).sort((a, b) => b.lastAt.localeCompare(a.lastAt)),
    weakKinds: statsByKind(scored.flatMap(result => result.answers)).filter(stat => stat.total >= 2).slice(0, 4),
    srs: { ...statusCounts(data, now), dueNow: dueRecords(data, now).length },
  };
}

export function countWords(text: string) {
  const words = text.trim().match(/[A-Za-zÀ-ỹ0-9]+(?:['’-][A-Za-zÀ-ỹ0-9]+)*/g);
  return words ? words.length : 0;
}

/** Which of the suggested words/phrases appear in the learner's text. */
export function usedPhrases(text: string, phrases: readonly string[]) {
  const lower = text.toLowerCase();
  return phrases.filter(phrase => lower.includes(phrase.toLowerCase()));
}

export function makeResultId(mode: PracticeModeId, now: Date) {
  return `${mode}-${now.getTime().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
