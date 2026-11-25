import { useEffect, useState } from 'react';

type Result<T> = { data: T; error?: never } | { data?: never; error: string };

export function usePracticeRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [retryCount, setRetryCount] = useState(0);
  const [snapshot, setSnapshot] = useState<{ load: typeof load; retryCount: number; result: Result<T> }>();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const publish = (result: Result<T>) => {
      clearTimeout(timeout);
      if (active) setSnapshot({ load, retryCount, result });
    };
    void load(controller.signal).then(data => publish({ data }), error =>
      publish({ error: error instanceof Error ? error.message : 'Chưa tải được bài luyện tập.' }),
    );
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [load, retryCount]);

  const result = snapshot?.load === load && snapshot.retryCount === retryCount ? snapshot.result : undefined;
  return { data: result?.data, error: result?.error, loading: !result, retry: () => setRetryCount(count => count + 1) };
}
