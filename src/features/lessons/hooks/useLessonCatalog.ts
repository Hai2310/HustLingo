import { useCallback, useEffect, useState } from 'react';
import { loadLessonCatalog, peekLessonCatalog } from '@/services/learningContent';
import type { LessonCatalog } from '../types';

export function useLessonCatalog() {
  const [catalog, setCatalog] = useState<LessonCatalog | null>(peekLessonCatalog);
  const [loading, setLoading] = useState(!catalog);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(null);
    loadLessonCatalog(version > 0).then(data => { if (active) setCatalog(data); }).catch(() => {
      if (active) setError('Your lesson library could not be loaded. Please try again.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [version]);
  const retry = useCallback(() => setVersion(value => value + 1), []);
  return { catalog, loading, error, retry };
}
