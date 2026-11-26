import type { PracticeData, PracticeStatus, ReviewGrade, SrsRecord } from '../types';

/**
 * One spaced-repetition rule for every vocabulary surface (quiz, flashcards, review queue).
 * A simplified SM-2: a forgotten word returns in 10 minutes, a remembered word's interval
 * grows by its ease factor, and the ease adapts to how hard the learner found it.
 */
export const SRS_RULES = {
  startEase: 2.5,
  minEase: 1.3,
  maxEase: 3.0,
  relearnMinutes: 10,
  firstIntervalDays: 1,
  secondIntervalDays: 3,
  masteredAfterDays: 21,
  /** Upper bound so repeated "easy" grades never push a review out of reach (or past valid dates). */
  maxIntervalDays: 365,
} as const;

const DAY_MS = 86_400_000;
const round = (value: number) => Math.round(value * 100) / 100;
const clampEase = (ease: number) => Math.min(SRS_RULES.maxEase, Math.max(SRS_RULES.minEase, round(ease)));

export function newSrsRecord(wordId: string, now: Date): SrsRecord {
  const iso = now.toISOString();
  return { wordId, intervalDays: 0, ease: SRS_RULES.startEase, repetitions: 0, correctCount: 0, wrongCount: 0, lastReviewedAt: iso, nextReviewAt: iso };
}

/** Compute the next state of a word after one review. `now` is injected so the rule is testable. */
export function reviewWord(previous: SrsRecord | undefined, wordId: string, grade: ReviewGrade, now: Date): SrsRecord {
  const base = previous ?? newSrsRecord(wordId, now);
  const lastReviewedAt = now.toISOString();
  if (grade === 'again') {
    return {
      ...base,
      intervalDays: 0,
      repetitions: 0,
      ease: clampEase(base.ease - 0.2),
      wrongCount: base.wrongCount + 1,
      lastReviewedAt,
      nextReviewAt: new Date(now.getTime() + SRS_RULES.relearnMinutes * 60_000).toISOString(),
    };
  }
  const ease = clampEase(base.ease + (grade === 'hard' ? -0.15 : grade === 'easy' ? 0.15 : 0));
  let intervalDays: number;
  if (base.repetitions === 0) intervalDays = grade === 'easy' ? SRS_RULES.secondIntervalDays : SRS_RULES.firstIntervalDays;
  else if (base.repetitions === 1) intervalDays = grade === 'hard' ? SRS_RULES.firstIntervalDays * 2 : SRS_RULES.secondIntervalDays;
  else intervalDays = Math.max(1, Math.round(base.intervalDays * (grade === 'hard' ? 1.2 : grade === 'easy' ? ease * 1.3 : ease)));
  intervalDays = Math.min(SRS_RULES.maxIntervalDays, intervalDays);
  return {
    ...base,
    intervalDays,
    ease,
    repetitions: base.repetitions + 1,
    correctCount: base.correctCount + 1,
    lastReviewedAt,
    nextReviewAt: new Date(now.getTime() + intervalDays * DAY_MS).toISOString(),
  };
}

/** Quiz answers map onto the same rule: wrong = again, right = good. */
export const gradeFromAnswer = (correct: boolean): ReviewGrade => (correct ? 'good' : 'again');

export function isDue(record: SrsRecord, now: Date) {
  return new Date(record.nextReviewAt).getTime() <= now.getTime();
}

export function wordStatus(record: SrsRecord | undefined, now: Date): PracticeStatus {
  if (!record) return 'new';
  if (record.intervalDays >= SRS_RULES.masteredAfterDays) return 'mastered';
  if (isDue(record, now) && record.correctCount + record.wrongCount > 0) return 'review';
  return 'learning';
}

/** Words due now, most overdue first. */
export function dueRecords(data: Pick<PracticeData, 'srs'>, now: Date) {
  return Object.values(data.srs).filter(record => isDue(record, now)).sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt));
}

/**
 * Today's review queue: due words first, then up to `newLimit` unseen words from `candidates`
 * (saved / marked-for-review words should be passed first so they are introduced first).
 */
export function buildReviewQueue(data: Pick<PracticeData, 'srs'>, candidates: string[], now: Date, { limit = 20, newLimit = 8 } = {}) {
  const due = dueRecords(data, now).map(record => record.wordId);
  const fresh: string[] = [];
  for (const id of candidates) {
    if (fresh.length >= newLimit) break;
    if (!data.srs[id] && !fresh.includes(id)) fresh.push(id);
  }
  return [...due, ...fresh].slice(0, limit);
}

export function statusCounts(data: Pick<PracticeData, 'srs'>, now: Date) {
  const counts: Record<PracticeStatus, number> = { new: 0, learning: 0, review: 0, mastered: 0 };
  for (const record of Object.values(data.srs)) counts[wordStatus(record, now)] += 1;
  return counts;
}

/** Human label for when a word comes back, e.g. "10 phút", "3 ngày". */
export function describeInterval(record: SrsRecord, now: Date) {
  const minutes = Math.max(0, Math.round((new Date(record.nextReviewAt).getTime() - now.getTime()) / 60_000));
  if (minutes < 60) return `${Math.max(1, minutes)} phút`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} giờ`;
  return `${Math.round(minutes / 1440)} ngày`;
}
