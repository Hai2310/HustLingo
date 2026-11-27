import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import type { PronunciationResult } from '../../../../supabase/functions/pronunciation-assessment/core';

export type { PronunciationResult };

const sampleRate = 16_000;
const maxSeconds = 20;
const errors = new Map([
  ['sign_in_required', 'Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại để chấm phát âm.'],
  ['account_inactive', 'Tài khoản này chưa thể dùng tính năng chấm phát âm.'],
  ['daily_limit', 'Bạn đã dùng hết lượt chấm phát âm hôm nay. Hãy thử lại vào ngày mai.'],
  ['audio_too_short', 'Bản ghi quá ngắn. Hãy thử đọc trọn câu mẫu.'],
  ['audio_too_long', 'Bản ghi dài quá 20 giây. Hãy ghi lại một câu ngắn.'],
  ['invalid_audio', 'Chưa đọc được định dạng bản ghi. Hãy thử ghi lại.'],
  ['no_speech', 'Chưa nghe rõ lời nói. Hãy thử lại ở nơi yên tĩnh hơn.'],
  ['exercise_not_found', 'Bài luyện nói này chưa sẵn sàng để chấm.'],
  ['service_unavailable', 'Dịch vụ chấm phát âm chưa sẵn sàng. Bạn vẫn có thể nghe lại bản ghi.'],
  ['provider_timeout', 'Azure phản hồi quá lâu. Bạn có thể thử chấm lại.'],
]);

async function toWav(uri: string, signal: AbortSignal) {
  const response = await fetch(uri, { signal });
  if (!response.ok) throw new Error(errors.get('invalid_audio'));
  const context = new OfflineAudioContext(1, 1, sampleRate);
  const source = await response.arrayBuffer();
  const audio = await context.decodeAudioData(source).catch(() => { throw new Error(errors.get('invalid_audio')); });
  signal.throwIfAborted();
  if (audio.duration < 0.5) throw new Error(errors.get('audio_too_short'));
  if (audio.duration > maxSeconds) throw new Error(errors.get('audio_too_long'));

  const channels = Array.from({ length: audio.numberOfChannels }, (_, index) => audio.getChannelData(index));
  const buffer = new ArrayBuffer(44 + audio.length * 2);
  const wav = new DataView(buffer);
  wav.setUint32(0, 0x52494646); // RIFF
  wav.setUint32(4, buffer.byteLength - 8, true);
  wav.setUint32(8, 0x57415645); // WAVE
  wav.setUint32(12, 0x666d7420); // fmt
  wav.setUint32(16, 16, true);
  wav.setUint16(20, 1, true); // PCM
  wav.setUint16(22, 1, true); // Mono
  wav.setUint32(24, sampleRate, true);
  wav.setUint32(28, sampleRate * 2, true);
  wav.setUint16(32, 2, true);
  wav.setUint16(34, 16, true);
  wav.setUint32(36, 0x64617461); // data
  wav.setUint32(40, buffer.byteLength - 44, true);
  for (let sample = 0; sample < audio.length; sample++) {
    let mono = 0;
    for (const channel of channels) mono += channel[sample];
    const level = Math.max(-1, Math.min(1, mono / channels.length));
    wav.setInt16(44 + sample * 2, level * (level < 0 ? 32768 : 32767), true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

export async function assessPronunciation(exerciseId: string, uri: string, signal: AbortSignal) {
  const body = await toWav(uri, signal);
  const { data, error } = await supabase.functions.invoke<PronunciationResult>('pronunciation-assessment', {
    body, signal, timeout: 25_000,
    headers: { 'Content-Type': 'audio/wav', 'x-exercise-id': exerciseId },
  });
  if (error instanceof FunctionsHttpError) {
    const details = await error.context.json().catch(() => null);
    const known = errors.get(details?.error);
    if (known) throw new Error(known);
    if (error.context.status === 401) throw new Error(errors.get('sign_in_required'));
    if (error.context.status === 404) throw new Error(errors.get('service_unavailable'));
    if (error.context.status === 429) throw new Error(errors.get('daily_limit'));
  }
  if (error || !data || !Number.isFinite(data.score) || !Array.isArray(data.words)) {
    throw new Error('Chưa chấm được phát âm. Bạn có thể thử chấm lại bản ghi.');
  }
  return data;
}
