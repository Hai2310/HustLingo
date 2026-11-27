import { useEffect, useRef, useState } from 'react';
import { assessPronunciation } from '../data/pronunciation';
import type { PronunciationResult } from '../data/pronunciation';

type State =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; result: PronunciationResult }
  | { status: 'error'; message: string };

export function usePronunciationAssessment(exerciseId: string, accountId?: string) {
  const request = useRef<AbortController | null>(null);
  const [state, setState] = useState<State>({ status: 'idle' });
  const account = useRef(accountId);
  account.current = accountId;

  useEffect(() => {
    setState({ status: 'idle' });
    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [exerciseId, accountId]);

  function reset() {
    request.current?.abort();
    request.current = null;
    setState({ status: 'idle' });
  }

  async function assess(uri: string) {
    if (!accountId || account.current !== accountId || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setState({ status: 'loading' });
    try {
      const result = await assessPronunciation(exerciseId, uri, controller.signal);
      if (!controller.signal.aborted) setState({ status: 'ready', result });
    } catch (cause) {
      if (!controller.signal.aborted) {
        setState({ status: 'error', message: cause instanceof Error ? cause.message : 'Chưa chấm được bản ghi.' });
      }
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return { state, assess, reset };
}
