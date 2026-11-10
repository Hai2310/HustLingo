import { useCallback, useEffect, useRef, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';
import { sendTutorRequest } from '../services/tutorApi';
import { loadCloudTutorSession, loadTutorSession, saveTutorSession, saveTutorSummary } from '../services/tutorSessionStore';
import type { TutorChatRequest, TutorCorrection, TutorScenario, TutorSession, TutorSessionSummary } from '../types';

function welcome(scenario: TutorScenario) {
  return { id: `welcome-${scenario.id}`, role: 'tutor' as const, text: scenario.starterPrompt!, createdAt: new Date().toISOString() };
}
function localSummary(session: TutorSession, scenario: TutorScenario): TutorSessionSummary {
  return {
    sessionId: session.id, scenarioId: scenario.id, scenarioTitle: scenario.title, tutorId: session.tutorId,
    messageCount: session.messages.filter(item => item.role === 'learner').length,
    durationMinutes: Math.max(1, Math.round((Date.now() - Date.parse(session.startedAt)) / 60000)),
    highlights: [`You practised ${scenario.title}.`], corrections: session.corrections.slice(-3),
    newVocabulary: session.newVocabulary.slice(-5), nextStep: 'Try another scenario or practise this one again.',
  };
}
export function useTutorChat(scenario: TutorScenario, tutorId: string) {
  const { user, isGuest } = useAuth();
  const owner = user.id;
  const [session, setSession] = useState<TutorSession>(() => ({
    id: Crypto.randomUUID(), tutorId, scenarioId: scenario.id, status: 'active',
    startedAt: new Date().toISOString(), messages: [welcome(scenario)], corrections: [], newVocabulary: [],
  }));
  const current = useRef(session);
  const busy = useRef(false);
  const mounted = useRef(true);
  const [status, setStatus] = useState<'hydrating' | 'ready' | 'loading' | 'error' | 'completed'>('hydrating');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [lastCorrection, setLastCorrection] = useState<TutorCorrection | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [hydrationVersion, setHydrationVersion] = useState(0);
  const hydrated = useRef(false);
  const update = useCallback((next: TutorSession) => {
    current.current = next;
    if (mounted.current) setSession(next);
  }, []);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    hydrated.current = false;
    setStatus('hydrating');
    (async () => {
      const local = await loadTutorSession(owner);
      const saved = local?.scenarioId === scenario.id && local.tutorId === tutorId && local.status === 'active' ? local : null;
      const cloud = !isGuest ? await loadCloudTutorSession(owner, scenario.id, tutorId, saved?.id) : null;
      if (!active) return;
      // Keep the exact request ID after a reload or a lost response.
      const endedElsewhere = cloud && (cloud.status === 'completed' || cloud.status === 'abandoned');
      let next = saved?.pendingRequest ? saved : endedElsewhere
        ? { id: Crypto.randomUUID(), tutorId, scenarioId: scenario.id, status: 'active' as const,
          startedAt: new Date().toISOString(), messages: [welcome(scenario)], corrections: [], newVocabulary: [] }
        : cloud || saved || current.current;
      if (!next.messages.length) next = { ...next, messages: [welcome(scenario)] };
      update(next);
      hydrated.current = true;
      setError(next.pendingRequest ? 'Lượt trước chưa được xác nhận. Bấm Retry để tiếp tục.' : null);
      setStatus(next.pendingRequest ? 'error' : 'ready');
    })().catch(reason => {
      if (active) { setError(reason instanceof Error ? reason.message : 'Không tải được phiên luyện tập.'); setStatus('error'); }
    });
    return () => { active = false; mounted.current = false; };
  }, [owner, isGuest, scenario, tutorId, hydrationVersion, update]);
  const run = useCallback(async (request: TutorChatRequest): Promise<TutorSessionSummary | undefined> => {
    if (busy.current || !hydrated.current || current.current.status === 'completed') return;
    busy.current = true;
    setStatus('loading'); setError(null); setSuggestedReplies([]);
    if (request.action !== 'hint') setHint(null);
    try {
      const pending = { ...current.current, pendingRequest: request };
      update(pending);
      await saveTutorSession(pending, owner);
      const response = await sendTutorRequest(request, { useRemote: !isGuest });
      if (!mounted.current) return;
      let next = { ...current.current, pendingRequest: undefined };
      if (request.action === 'summary') {
        if (!isGuest && !response.summary) throw new Error('Tutor API returned no session summary.');
        const summary = response.summary || localSummary(next, scenario);
        next = { ...next, status: 'completed', endedAt: new Date().toISOString() };
        await saveTutorSummary(summary, owner);
        update(next); setStatus('completed');
        return summary;
      }
      if (request.action === 'hint') setHint(response.message);
      else {
        next = {
          ...next,
          messages: [
            ...next.messages.map(item => item.id === `learner-${request.requestId}` && response.learnerMessageId
              ? { ...item, id: response.learnerMessageId } : item),
            { id: response.tutorMessageId || `tutor-${request.requestId}`, role: 'tutor', text: response.message, createdAt: new Date().toISOString() },
          ],
          corrections: response.correction ? [...next.corrections, response.correction] : next.corrections,
          newVocabulary: [...next.newVocabulary, ...(response.newVocabulary || [])],
        };
      }
      await saveTutorSession(next, owner);
      update(next); setLastCorrection(response.correction || null);
      setSuggestedReplies(response.suggestedReplies || []); setStatus('ready');
    } catch (reason) {
      if (mounted.current) { setStatus('error'); setError(reason instanceof Error ? reason.message : 'Không kết nối được gia sư.'); }
    } finally { busy.current = false; }
  }, [isGuest, owner, scenario, update]);
  const request = useCallback((action: TutorChatRequest['action'], text?: string) => {
    if (busy.current || !hydrated.current || current.current.pendingRequest || current.current.status === 'completed') return Promise.resolve(undefined);
    const value = text?.trim();
    if (action === 'message' && (!value || value.length > 500)) return Promise.resolve(undefined);
    if (action === 'correct' && !current.current.messages.some(item => item.role === 'learner')) {
      setError('Hãy gửi một câu trước khi yêu cầu sửa.'); return Promise.resolve(undefined);
    }
    if (action === 'message' && current.current.messages.filter(item => item.role === 'learner').length >= 30) {
      setError('Đã đủ 30 lượt. Hãy Finish để xem tổng kết.'); return Promise.resolve(undefined);
    }
    const requestId = Crypto.randomUUID();
    let next = current.current;
    if (action === 'message') {
      next = { ...next, messages: [...next.messages, { id: `learner-${requestId}`, role: 'learner', text: value!, createdAt: new Date().toISOString() }] };
      update(next);
    }
    return run({ requestId, sessionId: next.id, scenarioId: scenario.id, tutorId, action, message: value, history: next.messages });
  }, [run, scenario.id, tutorId, update]);
  const retry = useCallback(() => {
    if (!hydrated.current) { setHydrationVersion(value => value + 1); return Promise.resolve(undefined); }
    return current.current.pendingRequest ? run(current.current.pendingRequest) : Promise.resolve(undefined);
  }, [run]);
  return {
    session, status, error, hint, lastCorrection, suggestedReplies, isDemo: isGuest,
    canSend: status === 'ready' && !session.pendingRequest,
    sendMessage: (text: string) => request('message', text),
    requestHint: () => request('hint'), requestCorrection: () => request('correct'),
    finish: () => request('summary'), retry,
  };
}
