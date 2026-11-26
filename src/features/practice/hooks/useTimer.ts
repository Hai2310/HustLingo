import { useEffect, useRef, useState } from 'react';

/** Elapsed seconds since mount (or since `reset`). Ticks once per second while `running`. */
export function useElapsed(running = true) {
  const started = useRef(Date.now());
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);
  return {
    seconds: Math.max(0, Math.floor((now - started.current) / 1000)),
    startedAt: started.current,
    reset() { started.current = Date.now(); setNow(Date.now()); },
    /** Read the exact elapsed time at submit, independent of the last tick. */
    read() { return Math.max(0, Math.round((Date.now() - started.current) / 1000)); },
  };
}
