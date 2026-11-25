import { useCallback, useEffect, useState } from 'react';
import { loadTutorCatalog } from '../services/tutorCatalog';
import type { TutorCatalog } from '../types';

export function useTutorCatalog() {
  const [catalog, setCatalog] = useState<TutorCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion(value => value + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loadTutorCatalog().then(result => { if (active) setCatalog(result); }).catch(reason => {
      if (active) setError(reason instanceof Error ? reason.message : 'Không tải được dữ liệu Gia sư.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [version]);
  return { catalog, loading, error, retry };
}
