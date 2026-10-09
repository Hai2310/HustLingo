import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { useAuth } from '@/contexts/AuthContext';
import { getDemoMessages } from '../data/demoMessages';
import { sendTutorRequest } from '../services/tutorApi';
import {
  saveTutorSession,
  saveTutorSummary,
} from '../services/tutorSessionStore';
import type {
  TutorCorrection,
  TutorMessage,
  TutorScenario,
  TutorSession,
  TutorSessionSummary,
  TutorVocabularyItem,
} from '../types';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createSessionId() {
  return Crypto.randomUUID();
}

function initialMessages(scenarioId: string) {
  return getDemoMessages(scenarioId)
    .filter(message => message.role === 'tutor')
    .slice(0, 1)
    .map(message => ({ ...message, createdAt: new Date().toISOString() }));
}

function toSummary(session: TutorSession, scenario: TutorScenario): TutorSessionSummary {
  const started = new Date(session.startedAt).getTime();
  const durationMinutes = Math.max(1, Math.round((Date.now() - started) / 60000));
  return {
    sessionId: session.id,
    scenarioId: session.scenarioId,
    tutorId: session.tutorId,
    messageCount: session.messages.filter(message => message.role === 'learner').length,
    durationMinutes,
    highlights: [
      `You practised ${scenario.title}.`,
      session.messages.length > 2 ? 'You kept the conversation moving.' : 'You completed your first practice turn.',
    ],
    corrections: session.corrections.slice(-3),
    newVocabulary: session.newVocabulary.slice(-5),
    nextStep: `Try ${scenario.level === 'Beginner' ? 'one more beginner scenario' : 'the same scenario with fewer hints'}.`,
  };
}

export function useTutorChat(scenario: TutorScenario, tutorId: string) {
  const { isGuest } = useAuth();
  const [session, setSession] = useState<TutorSession>(() => ({
    id: createSessionId(),
    tutorId,
    scenarioId: scenario.id,
    status: 'active',
    startedAt: new Date().toISOString(),
    messages: initialMessages(scenario.id),
    corrections: [],
    newVocabulary: [],
  }));
  const [status, setStatus] = useState<'ready' | 'loading' | 'error' | 'completed'>('ready');
  const [error, setError] = useState<string | null>(null);
  const [lastCorrection, setLastCorrection] = useState<TutorCorrection | null>(null);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);

  useEffect(() => {
    if (session.status === 'completed') return;
    saveTutorSession(session).catch(() => null);
  }, [session]);

  const appendMessage = useCallback((message: TutorMessage) => {
    setSession(previous => ({ ...previous, messages: [...previous.messages, message] }));
  }, []);

  const request = useCallback(async (action: 'message' | 'hint' | 'correct', text?: string) => {
    if (status === 'loading' || status === 'completed') return;

    const learnerMessage = text?.trim();
    if (action === 'message' && !learnerMessage) return;
    if (action === 'message' && session.messages.filter(message => message.role === 'learner').length >= 30) {
      setError('This practice session has reached 30 turns. Finish it to see your summary.');
      return;
    }

    setError(null);
    setStatus('loading');
    const nextHistory = learnerMessage
      ? [...session.messages, { id: createId('learner'), role: 'learner' as const, text: learnerMessage, createdAt: new Date().toISOString() }]
      : session.messages;

    if (learnerMessage) {
      setSession(previous => ({ ...previous, messages: nextHistory }));
    }

    try {
      const response = await sendTutorRequest(
        {
          sessionId: session.id,
          scenarioId: scenario.id,
          tutorId,
          action,
          message: learnerMessage,
          history: nextHistory,
        },
        { useRemote: !isGuest },
      );
      const tutorMessage: TutorMessage = {
        id: createId('tutor'),
        role: 'tutor',
        text: response.message,
        createdAt: new Date().toISOString(),
      };
      setSession(previous => ({
        ...previous,
        messages: [...previous.messages, tutorMessage],
        corrections: response.correction
          ? [...previous.corrections, response.correction]
          : previous.corrections,
        newVocabulary: response.newVocabulary?.length
          ? [...previous.newVocabulary, ...response.newVocabulary]
          : previous.newVocabulary,
      }));
      setLastCorrection(response.correction || null);
      setSuggestedReplies(response.suggestedReplies || []);
      setStatus('ready');
    } catch (requestError) {
      setStatus('error');
      setError(requestError instanceof Error ? requestError.message : 'Không thể kết nối với gia sư.');
    }
  }, [isGuest, scenario.id, session, status, tutorId]);

  const finish = useCallback(async () => {
    const completed = { ...session, status: 'completed' as const, endedAt: new Date().toISOString() };
    const summary = toSummary(completed, scenario);
    setSession(completed);
    setStatus('completed');
    await saveTutorSummary(summary);
    return summary;
  }, [scenario, session]);

  const retry = useCallback(() => {
    setError(null);
    setStatus('ready');
  }, []);

  const summary = useMemo(() => toSummary(session, scenario), [scenario, session]);

  return {
    session,
    status,
    error,
    lastCorrection,
    suggestedReplies,
    summary,
    sendMessage: (text: string) => request('message', text),
    requestHint: () => request('hint'),
    requestCorrection: () => request('correct'),
    finish,
    retry,
  };
}
