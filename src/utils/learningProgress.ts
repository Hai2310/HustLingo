import type { LearningState, LessonStudyProgress } from '../types/index';

const unique = (values: string[]) => [...new Set(values)];
const strings = (value: unknown): string[] => Array.isArray(value) ? unique(value.filter((item): item is string => typeof item === 'string')) : [];
const count = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : 0;

export function emptyProgress(day: string): LearningState {
  return { studiedWordIds: [], reviewWordIds: [], savedWordIds: [], completedLessonIds: [], correctAnswers: 0, totalAnswers: 0, minutesToday: 0, lastStudyDate: day, lessonProgress: {} };
}

export function normaliseProgress(value: unknown, day: string): LearningState {
  const row = value && typeof value === 'object' ? value as Partial<LearningState> : {};
  const lessonProgress: Record<string, LessonStudyProgress> = {};
  if (row.lessonProgress && typeof row.lessonProgress === 'object') {
    for (const [id, entry] of Object.entries(row.lessonProgress)) {
      if (!entry || typeof entry !== 'object') continue;
      lessonProgress[id] = { completedSteps: strings(entry.completedSteps), lastStepId: typeof entry.lastStepId === 'string' ? entry.lastStepId : undefined, updatedAt: typeof entry.updatedAt === 'string' ? entry.updatedAt : undefined };
    }
  }
  const totalAnswers = count(row.totalAnswers);
  return {
    studiedWordIds: strings(row.studiedWordIds), reviewWordIds: strings(row.reviewWordIds), savedWordIds: strings(row.savedWordIds),
    completedLessonIds: strings(row.completedLessonIds), totalAnswers, correctAnswers: Math.min(count(row.correctAnswers), totalAnswers),
    minutesToday: row.lastStudyDate === day ? count(row.minutesToday) : 0, lastStudyDate: day, lessonProgress,
  };
}

export function mergeLearningProgress(localValue: unknown, remoteValue: unknown, day: string): LearningState {
  const local = normaliseProgress(localValue, day), remote = normaliseProgress(remoteValue, day);
  const lessonProgress = { ...remote.lessonProgress, ...local.lessonProgress };
  for (const id of new Set([...Object.keys(local.lessonProgress || {}), ...Object.keys(remote.lessonProgress || {})])) {
    const left = local.lessonProgress?.[id], right = remote.lessonProgress?.[id];
    const latest = (left?.updatedAt || '') >= (right?.updatedAt || '') ? left : right;
    lessonProgress[id] = { completedSteps: unique([...(left?.completedSteps || []), ...(right?.completedSteps || [])]), lastStepId: latest?.lastStepId, updatedAt: latest?.updatedAt };
  }
  return {
    studiedWordIds: unique([...local.studiedWordIds, ...remote.studiedWordIds]),
    reviewWordIds: unique([...local.reviewWordIds, ...remote.reviewWordIds]),
    savedWordIds: unique([...local.savedWordIds, ...remote.savedWordIds]),
    completedLessonIds: unique([...local.completedLessonIds, ...remote.completedLessonIds]),
    correctAnswers: Math.max(local.correctAnswers, remote.correctAnswers), totalAnswers: Math.max(local.totalAnswers, remote.totalAnswers),
    minutesToday: Math.max(local.minutesToday, remote.minutesToday), lastStudyDate: day, lessonProgress,
  };
}

export function recordLessonStep(state: LearningState, lessonId: string, stepId: string, requiredSteps: string[], wordId?: string, timestamp = new Date().toISOString()): LearningState {
  if (!lessonId || !requiredSteps.length || !requiredSteps.includes(stepId)) return state;
  const previous = state.lessonProgress?.[lessonId];
  const completedSteps = unique([...(previous?.completedSteps || []), stepId]);
  const completed = requiredSteps.every(id => completedSteps.includes(id));
  return {
    ...state,
    studiedWordIds: wordId ? unique([...state.studiedWordIds, wordId]) : state.studiedWordIds,
    completedLessonIds: completed ? unique([...state.completedLessonIds, lessonId]) : state.completedLessonIds,
    lessonProgress: { ...state.lessonProgress, [lessonId]: { completedSteps, lastStepId: stepId, updatedAt: timestamp } },
  };
}

interface ProgressStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<unknown>;
  removeItem(key: string): Promise<unknown>;
}
export function parseProgress(raw: string | null, day: string) {
  try { return normaliseProgress(raw ? JSON.parse(raw) : null, day); } catch { return emptyProgress(day); }
}

/** Claim guest data durably before changing its owner. No network calls. */
export async function importGuestProgress(storage: ProgressStorage, prefix: string, userId: string, local: LearningState, day: string) {
  const guestKey = `${prefix}:guest-local`, transferKey = `${prefix}:guest-transfers`;
  let transfers: { pending: Record<string, unknown>; claimedGuest?: string } = { pending: {} };
  try {
    const raw = await storage.getItem(transferKey);
    if (raw) { const parsed = JSON.parse(raw); if (parsed.pending && typeof parsed.pending === 'object') transfers = parsed; }
  } catch { /* An unreadable old transfer record must not prevent local learning. */ }
  const guestRaw = await storage.getItem(guestKey);
  const guest = parseProgress(guestRaw, day);
  const hasGuestProgress = guest.studiedWordIds.length || guest.savedWordIds.length || guest.completedLessonIds.length || Object.keys(guest.lessonProgress || {}).length || guest.totalAnswers || guest.minutesToday;
  if (guestRaw && hasGuestProgress && guestRaw !== transfers.claimedGuest) {
    transfers.pending[userId] = mergeLearningProgress(transfers.pending[userId], guest, day);
    transfers.claimedGuest = guestRaw;
    await storage.setItem(transferKey, JSON.stringify(transfers));
  }
  if (!transfers.pending[userId]) return local;
  const merged = mergeLearningProgress(local, transfers.pending[userId], day);
  await storage.setItem(`${prefix}:${userId}`, JSON.stringify(merged));
  if (guestRaw && guestRaw === transfers.claimedGuest && await storage.getItem(guestKey) === guestRaw) await storage.removeItem(guestKey);
  delete transfers.pending[userId];
  await storage.setItem(transferKey, JSON.stringify(transfers));
  return merged;
}
