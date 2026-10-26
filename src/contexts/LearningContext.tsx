import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabaseData } from '@/services/supabaseData';
import type { LearningState } from '@/types';
import { emptyProgress, importGuestProgress, mergeLearningProgress, normaliseProgress, parseProgress, recordLessonStep as applyLessonStep } from '@/utils/learningProgress';
import { useAuth } from './AuthContext';

const KEY_PREFIX = 'hustlingo_learning_state_v1';
const today = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; };
type SyncStatus = 'loading' | 'local' | 'syncing' | 'synced' | 'error';
interface LearningContextValue {
  state: LearningState;
  ready: boolean;
  syncStatus: SyncStatus;
  markWord(wordId: string, remembered: boolean): void;
  toggleSaved(wordId: string): void;
  recordAnswer(correct: boolean): void;
  addMinutes(minutes: number): void;
  completeLesson(id: string): void;
  markLessonStep(lessonId: string, stepId: string, requiredSteps: string[], wordId?: string): void;
  syncNow(): Promise<void>;
  accuracy: number;
}
const LearningContext = createContext<LearningContextValue | null>(null);
type Snapshot = { key: string; state: LearningState };

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user, isGuest, loading: authLoading } = useAuth();
  const activeKey = `${KEY_PREFIX}:${user.id || 'guest-local'}`;
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const active = useRef(activeKey);
  const current = useRef(snapshot);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saves = useRef<Promise<void>>(Promise.resolve());
  active.current = activeKey;
  current.current = snapshot;
  const ready = !authLoading && snapshot?.key === activeKey;
  const state = ready && snapshot ? snapshot.state : emptyProgress(today());

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setSyncStatus('loading');
    const stillActive = () => !cancelled && active.current === activeKey;
    (async () => {
      let local = parseProgress(await AsyncStorage.getItem(activeKey), today());
      let status: SyncStatus = isGuest ? 'local' : 'synced';
      if (!isGuest) {
        try { local = await importGuestProgress(AsyncStorage, KEY_PREFIX, user.id, local, today()); }
        catch { status = 'error'; }
        if (!stillActive()) return;
        try { local = mergeLearningProgress(local, await supabaseData.getProgress(user.id), today()); }
        catch { status = 'error'; }
      }
      if (stillActive()) { setSnapshot({ key: activeKey, state: local }); setSyncStatus(status); }
    })().catch(() => {
      if (stillActive()) { setSnapshot({ key: activeKey, state: emptyProgress(today()) }); setSyncStatus('error'); }
    });
    return () => { cancelled = true; };
  }, [activeKey, authLoading, isGuest, user.id]);

  const persist = useCallback((scope: string, value: LearningState) => {
    const save = async () => {
    if (active.current !== scope) return;
    try {
      const initial = current.current?.key === scope ? current.current.state : value;
      await AsyncStorage.setItem(scope, JSON.stringify(initial));
      if (active.current !== scope) return;
      if (isGuest) { setSyncStatus('local'); return; }
      setSyncStatus('syncing');
      const remote = await supabaseData.getProgress(user.id);
      if (active.current !== scope) return;
      const latest = current.current?.key === scope ? current.current.state : value;
      const merged = { ...mergeLearningProgress(latest, remote, today()), savedWordIds: latest.savedWordIds, reviewWordIds: latest.reviewWordIds };
      await supabaseData.putProgress(merged, user.id);
      if (active.current !== scope) return;
      const afterUpload = current.current?.key === scope ? current.current.state : merged;
      const local = { ...mergeLearningProgress(afterUpload, merged, today()), savedWordIds: afterUpload.savedWordIds, reviewWordIds: afterUpload.reviewWordIds };
      await AsyncStorage.setItem(scope, JSON.stringify(local));
      setSnapshot(previous => {
        if (!previous || previous.key !== scope) return previous;
        const preserved = { ...mergeLearningProgress(previous.state, merged, today()), savedWordIds: previous.state.savedWordIds, reviewWordIds: previous.state.reviewWordIds };
        return JSON.stringify(normaliseProgress(preserved, today())) === JSON.stringify(normaliseProgress(previous.state, today())) ? previous : { key: scope, state: preserved };
      });
      setSyncStatus('synced');
    } catch (error) {
      if (active.current === scope) setSyncStatus('error');
      throw error;
    }
    };
    const request = saves.current.catch(() => {}).then(save);
    saves.current = request;
    return request;
  }, [isGuest, user.id]);

  useEffect(() => {
    if (!ready || !snapshot || snapshot.key !== activeKey) return;
    let cancelled = false;
    AsyncStorage.setItem(activeKey, JSON.stringify(snapshot.state)).then(() => {
      if (!cancelled && isGuest) setSyncStatus('local');
    }).catch(() => { if (!cancelled) setSyncStatus('error'); });
    if (!isGuest) {
      setSyncStatus('syncing');
      timer.current = setTimeout(() => { void persist(activeKey, snapshot.state).catch(() => {}); }, 1200);
    }
    return () => { cancelled = true; if (timer.current) clearTimeout(timer.current); };
  }, [snapshot, ready, activeKey, isGuest, persist]);

  const update = useCallback((fn: (previous: LearningState) => LearningState) => {
    setSnapshot(previous => previous?.key === activeKey ? { key: activeKey, state: { ...fn(normaliseProgress(previous.state, today())), lastStudyDate: today() } } : previous);
  }, [activeKey]);

  const value = useMemo<LearningContextValue>(() => ({
    state, ready, syncStatus,
    markWord(wordId, remembered) { update(previous => ({ ...previous, studiedWordIds: [...new Set([...previous.studiedWordIds, wordId])], reviewWordIds: remembered ? previous.reviewWordIds.filter(id => id !== wordId) : [...new Set([...previous.reviewWordIds, wordId])] })); },
    toggleSaved(wordId) { update(previous => ({ ...previous, savedWordIds: previous.savedWordIds.includes(wordId) ? previous.savedWordIds.filter(id => id !== wordId) : [...previous.savedWordIds, wordId] })); },
    recordAnswer(correct) { update(previous => ({ ...previous, totalAnswers: previous.totalAnswers + 1, correctAnswers: previous.correctAnswers + (correct ? 1 : 0) })); },
    addMinutes(minutes) { if (Number.isFinite(minutes) && minutes > 0) update(previous => ({ ...previous, minutesToday: previous.minutesToday + minutes })); },
    completeLesson(id) { update(previous => ({ ...previous, completedLessonIds: [...new Set([...previous.completedLessonIds, id])] })); },
    markLessonStep(lessonId, stepId, requiredSteps, wordId) { update(previous => applyLessonStep(previous, lessonId, stepId, requiredSteps, wordId)); },
    async syncNow() {
      if (!ready || !current.current || current.current.key !== activeKey) return;
      if (timer.current) clearTimeout(timer.current);
      await persist(activeKey, current.current.state);
    },
    accuracy: state.totalAnswers ? Math.round(state.correctAnswers / state.totalAnswers * 100) : 0,
  }), [state, ready, syncStatus, update, activeKey, persist]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error('useLearning must be used inside LearningProvider');
  return value;
}
