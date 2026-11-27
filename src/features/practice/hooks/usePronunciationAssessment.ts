import { useEffect, useRef, useState } from 'react';
import { assessPronunciation, previewPronunciation, PronunciationUnavailableError } from '../data/pronunciation';
import type { PronunciationResult } from '../data/pronunciation';

type State =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; result: PronunciationResult }
  | { status: 'error'; message: string; retryable: boolean };

export function usePronunciationAssessment(exerciseId: string, accountId?: string, demoReference?: string) {
  const request = useRef<AbortController | null>(null);
  const [state, setState] = useState<State>({ status: 'idle' });
  const scope = demoReference ? 'localhost-demo' : accountId;
  const currentScope = useRef(scope);
  currentScope.current = scope;

  useEffect(() => {
    setState({ status: 'idle' });
    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [exerciseId, scope, demoReference]);

  function reset() {
    request.current?.abort();
    request.current = null;
    setState({ status: 'idle' });
  }

  async function assess(uri: string) {
    if (!scope || currentScope.current !== scope || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setState({ status: 'loading' });
    try {
      const result = demoReference
        ? await previewPronunciation(demoReference, uri, controller.signal)
        : await assessPronunciation(exerciseId, uri, controller.signal);
      if (!controller.signal.aborted) setState({ status: 'ready', result });
    } catch (cause) {
      if (!controller.signal.aborted) {
        setState({
          status: 'error',
          message: cause instanceof Error ? cause.message : 'Chưa chấm được bản ghi.',
          retryable: !(cause instanceof PronunciationUnavailableError),
        });
      }
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return { state, assess, reset };
}
