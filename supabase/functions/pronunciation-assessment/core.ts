export const sampleRate = 16_000;
export const maxAudioSeconds = 20;
const bytesPerSample = 2;
const wavHeaderSize = 44;
const maxAudioBytes = wavHeaderSize + sampleRate * bytesPerSample * maxAudioSeconds;

export type PronunciationResult = {
  score: number;
  accuracy: number | null;
  fluency: number | null;
  completeness: number | null;
  prosody: number | null;
  words: {
    text: string;
    accuracy: number | null;
    error: string | null;
    phonemes: { text: string; accuracy: number }[];
  }[];
};

export class AssessmentError extends Error {
  constructor(public readonly code: string, public readonly status: number) {
    super(code);
  }
}

export async function readWav(request: Request): Promise<ArrayBuffer> {
  if (request.headers.get('content-type')?.split(';')[0] !== 'audio/wav' || !request.body) {
    throw new AssessmentError('invalid_audio', 415);
  }
  if (Number(request.headers.get('content-length')) > maxAudioBytes) throw new AssessmentError('audio_too_long', 413);
  const reader = request.body.getReader();
  const buffer = new Uint8Array(maxAudioBytes);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (length + value.byteLength > maxAudioBytes) {
        void reader.cancel().catch(() => null);
        throw new AssessmentError('audio_too_long', 413);
      }
      buffer.set(value, length);
      length += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }

  if (length <= wavHeaderSize) throw new AssessmentError('invalid_audio', 422);
  const header = new DataView(buffer.buffer, 0, wavHeaderSize);
  // The browser encoder always writes a canonical 44-byte PCM WAV header.
  if (header.getUint32(0) !== 0x52494646 || header.getUint32(8) !== 0x57415645 ||
      header.getUint32(12) !== 0x666d7420 || header.getUint32(36) !== 0x64617461 ||
      header.getUint32(4, true) !== length - 8 || header.getUint32(16, true) !== 16 ||
      header.getUint16(20, true) !== 1 || header.getUint16(22, true) !== 1 ||
      header.getUint32(24, true) !== sampleRate || header.getUint32(28, true) !== sampleRate * bytesPerSample ||
      header.getUint16(32, true) !== bytesPerSample || header.getUint16(34, true) !== 16 ||
      header.getUint32(40, true) !== length - wavHeaderSize || length % bytesPerSample !== 0) {
    throw new AssessmentError('invalid_audio', 422);
  }
  if (length - wavHeaderSize < sampleRate * bytesPerSample / 2) throw new AssessmentError('audio_too_short', 422);
  return buffer.buffer.slice(0, length);
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function score(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
}

function assessment(value: Record<string, unknown>) {
  return { ...value, ...object(value.PronunciationAssessment) };
}

export function parseAzureResult(payload: unknown): PronunciationResult {
  const body = object(payload);
  if (['NoMatch', 'InitialSilenceTimeout', 'BabbleTimeout', 'EndOfDictation'].includes(String(body.RecognitionStatus))) {
    throw new AssessmentError('no_speech', 422);
  }
  const first = Array.isArray(body.NBest) ? object(body.NBest[0]) : {};
  const overall = assessment(first);
  const total = score(overall.PronScore);
  if (total === null || !Array.isArray(first.Words)) throw new AssessmentError('provider_error', 502);
  const words = first.Words.flatMap((value: unknown) => {
    const word = object(value);
    if (typeof word.Word !== 'string' || !word.Word.trim()) return [];
    const metrics = assessment(word);
    const phonemes = Array.isArray(word.Phonemes) ? word.Phonemes.flatMap((value: unknown) => {
      const phoneme = object(value);
      const accuracy = score(assessment(phoneme).AccuracyScore);
      return typeof phoneme.Phoneme === 'string' && accuracy !== null ? [{ text: phoneme.Phoneme, accuracy }] : [];
    }) : [];
    return [{
      text: word.Word, accuracy: score(metrics.AccuracyScore),
      error: typeof metrics.ErrorType === 'string' && metrics.ErrorType !== 'None' ? metrics.ErrorType : null,
      phonemes,
    }];
  });
  return {
    score: total,
    accuracy: score(overall.AccuracyScore),
    fluency: score(overall.FluencyScore),
    completeness: score(overall.CompletenessScore),
    prosody: score(overall.ProsodyScore),
    words,
  };
}

export function azureAssessmentHeader(reference: string): string {
  const json = JSON.stringify({
    ReferenceText: reference,
    GradingSystem: 'HundredMark',
    Granularity: 'Phoneme',
    Dimension: 'Comprehensive',
    EnableMiscue: 'True',
    EnableProsodyAssessment: 'True',
    PhonemeAlphabet: 'IPA',
  });
  return btoa(Array.from(new TextEncoder().encode(json), byte => String.fromCharCode(byte)).join(''));
}
