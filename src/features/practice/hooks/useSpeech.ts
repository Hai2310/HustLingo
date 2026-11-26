import { useCallback, useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

export const SPEECH_RATES = [{ label: '0.75×', value: 0.7 }, { label: '1×', value: 0.92 }, { label: '1.25×', value: 1.15 }] as const;

/** Text-to-speech with replay, speed and a play counter. Stops when the screen unmounts. */
export function useSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [plays, setPlays] = useState<Record<string, number>>({});
  const token = useRef(0);
  useEffect(() => () => { token.current += 1; void Speech.stop().catch(() => {}); }, []);

  const stop = useCallback(async () => {
    token.current += 1;
    setSpeakingId(null);
    try { await Speech.stop(); } catch { /* nothing to stop */ }
  }, []);

  const speak = useCallback(async (id: string, text: string, rate = 0.92) => {
    const mine = ++token.current;
    setError(null);
    try { await Speech.stop(); } catch { /* ignore */ }
    if (token.current !== mine) return;
    setSpeakingId(id);
    setPlays(previous => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }));
    const done = () => { if (token.current === mine) setSpeakingId(null); };
    try {
      Speech.speak(text, { language: 'en-US', rate, onDone: done, onStopped: done, onError: () => { done(); setError('Thiết bị không phát được âm thanh. Kiểm tra loa/âm lượng rồi thử lại.'); } });
    } catch {
      done();
      setError('Không bắt đầu được âm thanh trên thiết bị này.');
    }
  }, []);

  return { speakingId, error, plays, speak, stop };
}
