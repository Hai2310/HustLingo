import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { supabaseData } from '@/services/supabaseData';
import type { LearningState } from '@/types';
import { useAuth } from './AuthContext';

const KEY_PREFIX = 'hustlingo_learning_state_v1';
const EMPTY: LearningState = {
  studiedWordIds: [],
  reviewWordIds: [],
  savedWordIds: [],
  completedLessonIds: [],
  correctAnswers: 0,
  totalAnswers: 0,
  minutesToday: 0,
};

interface LearningContextValue {
  state: LearningState;
  ready: boolean;
  markWord(wordId: string, remembered: boolean): void;
  toggleSaved(wordId: string): void;
  recordAnswer(correct: boolean): void;
  addMinutes(minutes: number): void;
  completeLesson(id: string): void;
  syncNow(): Promise<void>;
  accuracy: number;
}

const LearningContext = createContext<LearningContextValue | null>(null);

function unique(list: string[]) {
  return Array.from(new Set(list));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function storageKey(userId?: string | null) {
  return `${KEY_PREFIX}:${userId || 'guest-local'}`;
}

function normalizeDaily(state: LearningState): LearningState {
  if (state.lastStudyDate === today()) return state;
  return { ...state, minutesToday: 0, lastStudyDate: today() };
}

function mergeProgress(local: LearningState, remote?: LearningState | null): LearningState {
  if (!remote) return normalizeDaily(local);
  const sameToday = remote.lastStudyDate === today();
  return normalizeDaily({
    ...local,
    ...remote,
    studiedWordIds: unique([
      ...(local.studiedWordIds || []),
      ...(remote.studiedWordIds || []),
    ]),
    reviewWordIds: unique([
      ...(local.reviewWordIds || []),
      ...(remote.reviewWordIds || []),
    ]),
    savedWordIds: unique([
      ...(local.savedWordIds || []),
      ...(remote.savedWordIds || []),
    ]),
    completedLessonIds: unique([
      ...(local.completedLessonIds || []),
      ...(remote.completedLessonIds || []),
    ]),
    correctAnswers: Math.max(local.correctAnswers || 0, remote.correctAnswers || 0),
    totalAnswers: Math.max(local.totalAnswers || 0, remote.totalAnswers || 0),
    minutesToday: sameToday
      ? Math.max(local.minutesToday || 0, remote.minutesToday || 0)
      : local.minutesToday || 0,
    lastStudyDate: today(),
  });
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest } = useAuth();
  const [state, setState] = useState<LearningState>({ ...EMPTY, lastStudyDate: today() });
  const [ready, setReady] = useState(false);
  const activeKey = storageKey(user.id);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    (async () => {
      let local: LearningState = { ...EMPTY, lastStudyDate: today() };
      const raw = await AsyncStorage.getItem(activeKey).catch(() => null);
      if (raw) {
        try {
          local = normalizeDaily(JSON.parse(raw) as LearningState);
        } catch {
          local = { ...EMPTY, lastStudyDate: today() };
        }
      }

      let next = local;
      if (!isGuest) {
        try {
          const remote = await supabaseData.getProgress();
          next = mergeProgress(local, remote);
        } catch {
          next = local;
        }
      }

      if (!cancelled) {
        setState(next);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [activeKey, isGuest]);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(activeKey, JSON.stringify(state)).catch(() => null);

    // Guest progress stays local. Supabase is only used after a real login.
    if (isGuest) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabaseData.putProgress(state).catch(() => null);
    }, 1200);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, ready, isGuest, activeKey]);

  const update = useCallback(
    (fn: (prev: LearningState) => LearningState) =>
      setState(prev => ({ ...fn(prev), lastStudyDate: today() })),
    []
  );

  const value = useMemo<LearningContextValue>(
    () => ({
      state,
      ready,
      markWord(wordId, remembered) {
        update(prev => ({
          ...prev,
          studiedWordIds: unique([...prev.studiedWordIds, wordId]),
          reviewWordIds: remembered
            ? prev.reviewWordIds.filter(x => x !== wordId)
            : unique([...prev.reviewWordIds, wordId]),
        }));
      },
      toggleSaved(wordId) {
        update(prev => ({
          ...prev,
          savedWordIds: prev.savedWordIds.includes(wordId)
            ? prev.savedWordIds.filter(x => x !== wordId)
            : unique([...prev.savedWordIds, wordId]),
        }));
      },
      recordAnswer(correct) {
        update(prev => ({
          ...prev,
          totalAnswers: prev.totalAnswers + 1,
          correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        }));
      },
      addMinutes(minutes) {
        update(prev => ({
          ...prev,
          minutesToday: Math.max(0, prev.minutesToday + minutes),
        }));
      },
      completeLesson(id) {
        update(prev => ({
          ...prev,
          completedLessonIds: unique([...prev.completedLessonIds, id]),
        }));
      },
      async syncNow() {
        await AsyncStorage.setItem(activeKey, JSON.stringify(state));
        if (!isGuest) await supabaseData.putProgress(state);
      },
      accuracy: state.totalAnswers
        ? Math.round((state.correctAnswers / state.totalAnswers) * 100)
        : 0,
    }),
    [state, ready, update, isGuest, activeKey]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error('useLearning must be used inside LearningProvider');
  return value;
}
