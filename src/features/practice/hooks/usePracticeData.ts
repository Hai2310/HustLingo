import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { addResult, applyReview, emptyPracticeData, parsePracticeData, setDraft } from '../engine/analytics';
import { gradeFromAnswer } from '../engine/srs';
import type { PracticeData, PracticeResultRecord, ReviewGrade } from '../types';

/**
 * Practice-only data (SRS schedule, result history, writing drafts) lives on the device,
 * one key per account so a shared phone never mixes learners. Aggregate answers/words are
 * also reported to LearningContext, which already syncs to Supabase.
 */
const KEY_PREFIX = 'hustlingo_practice_v1';
type Entry = { data: PracticeData; loaded: boolean; error: boolean };
const entries = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
const loading = new Map<string, Promise<void>>();
const writes = new Map<string, Promise<void>>();
const EMPTY: Entry = { data: emptyPracticeData(), loaded: false, error: false };

function emit(key: string) { listeners.get(key)?.forEach(listener => listener()); }

function ensureLoaded(key: string) {
  if (entries.get(key)?.loaded || loading.has(key)) return;
  const request = AsyncStorage.getItem(key)
    .then(raw => { entries.set(key, { data: parsePracticeData(raw), loaded: true, error: false }); })
    .catch(() => { entries.set(key, { data: emptyPracticeData(), loaded: true, error: true }); })
    .finally(() => { loading.delete(key); emit(key); });
  loading.set(key, request);
}

function update(key: string, change: (data: PracticeData) => PracticeData) {
  const current = entries.get(key) ?? { ...EMPTY, data: emptyPracticeData() };
  const next = { ...current, data: change(current.data) };
  entries.set(key, next);
  emit(key);
  // Serialise writes so an older snapshot never overwrites a newer one.
  const write = (writes.get(key) ?? Promise.resolve()).catch(() => {}).then(() => AsyncStorage.setItem(key, JSON.stringify(entries.get(key)!.data)))
    .then(() => { const entry = entries.get(key); if (entry?.error) { entries.set(key, { ...entry, error: false }); emit(key); } })
    .catch(() => { const entry = entries.get(key); if (entry) { entries.set(key, { ...entry, error: true }); emit(key); } });
  writes.set(key, write);
  return write;
}

export function usePracticeData() {
  const { user } = useAuth();
  const learning = useLearning();
  const key = `${KEY_PREFIX}:${user.id || 'guest-local'}`;

  const subscribe = useCallback((listener: () => void) => {
    const set = listeners.get(key) ?? new Set();
    set.add(listener); listeners.set(key, set);
    return () => { set.delete(listener); };
  }, [key]);
  const entry = useSyncExternalStore(subscribe, () => entries.get(key) ?? EMPTY, () => EMPTY);
  useEffect(() => { ensureLoaded(key); }, [key]);

  const { markWord, recordAnswer, addMinutes } = learning;
  return useMemo(() => ({
    data: entry.data,
    ready: entry.loaded,
    saveError: entry.error,
    /** Flashcard grading → SRS schedule + shared studied/review word lists. */
    reviewWord(wordId: string, grade: ReviewGrade) {
      void update(key, data => applyReview(data, wordId, grade, new Date()));
      markWord(wordId, grade !== 'again');
    },
    /** A graded quiz answer: SRS (if it is about a word) + shared accuracy counters. */
    recordQuizAnswer(correct: boolean, wordId?: string) {
      if (wordId) {
        void update(key, data => applyReview(data, wordId, gradeFromAnswer(correct), new Date()));
        markWord(wordId, correct);
      }
      recordAnswer(correct);
    },
    /** Counters for non-vocabulary answers are recorded at submit time, all at once. */
    saveResult(result: PracticeResultRecord, { countAnswers = false }: { countAnswers?: boolean } = {}) {
      if (countAnswers) result.answers.forEach(answer => recordAnswer(answer.correct));
      addMinutes(Math.max(1, Math.round(result.durationSeconds / 60)));
      return update(key, data => addResult(data, result));
    },
    saveDraft(id: string, text: string) { return update(key, data => setDraft(data, id, text)); },
  }), [entry, key, markWord, recordAnswer, addMinutes]);
}

/** Exposed for tests/debugging only. */
export const __practiceStoreKeyPrefix = KEY_PREFIX;
