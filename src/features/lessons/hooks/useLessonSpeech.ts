import { useEffect, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

export function useLessonSpeech() {
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const request = useRef(0), active = useRef<string | null>(null);
  useEffect(() => () => { request.current++; active.current = null; void Speech.stop().catch(() => {}); }, []);
  async function speak(id: string, text: string) {
    const token = ++request.current, stop = active.current === id;
    active.current = null;
    setAudioError(null);
    try {
      await Speech.stop();
      if (request.current !== token) return;
      if (stop) { setSpeaking(null); return; }
      active.current = id;
      setSpeaking(id);
      const finished = () => { if (request.current === token) { active.current = null; setSpeaking(null); } };
      Speech.speak(text, { language: 'en-US', rate: 0.85, onDone: finished, onStopped: finished, onError: () => { if (request.current === token) { finished(); setAudioError('Audio is unavailable on this device. You can keep studying and try again.'); } } });
    } catch { if (request.current === token) { active.current = null; setSpeaking(null); setAudioError('Audio could not start. Check your device sound and try again.'); } }
  }
  return { speaking, audioError, speak };
}
