import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { colors } from '@/theme/colors';
import { formatClock } from '../engine/exam';

/**
 * Record → stop → play back. Recordings stay on the device (nothing is uploaded) and are
 * replaced by the next take. Calls `onRecorded` when a take is available.
 */
export function Recorder({ onRecorded, maxSeconds = 180 }: { onRecorded?(uri: string): void; maxSeconds?: number }) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const recording = recorderState.isRecording;
  const elapsed = Math.floor((recorderState.durationMillis ?? 0) / 1000);

  useEffect(() => { if (recording && elapsed >= maxSeconds) void stop(); }, [recording, elapsed, maxSeconds]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { if (recorder.isRecording) void recorder.stop().catch(() => {}); }, [recorder]);

  async function start() {
    setError(null); setBusy(true);
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) { setError('Chưa có quyền dùng micro. Hãy cho phép micro trong cài đặt trình duyệt/thiết bị rồi thử lại.'); return; }
      if (status.playing) player.pause();
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setError(Platform.OS === 'web' ? 'Trình duyệt không cho ghi âm. Dùng Chrome/Edge/Safari mới và mở trang qua HTTPS hoặc localhost.' : 'Không bắt đầu ghi âm được. Kiểm tra micro rồi thử lại.');
    } finally { setBusy(false); }
  }

  async function stop() {
    setBusy(true);
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
      const next = recorder.uri;
      if (next) { setUri(next); player.replace({ uri: next }); onRecorded?.(next); }
      else setError('Không lưu được bản ghi. Hãy thử lại.');
    } catch { setError('Không dừng ghi âm được. Hãy thử lại.'); }
    finally { setBusy(false); }
  }

  function togglePlay() {
    if (!uri) return;
    if (status.playing) { player.pause(); return; }
    if (status.didJustFinish || (status.duration && status.currentTime >= status.duration - 0.1)) void player.seekTo(0);
    player.play();
  }

  return <View style={styles.wrap}>
    <View style={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel={recording ? 'Dừng ghi âm' : uri ? 'Ghi âm lại' : 'Bắt đầu ghi âm'} disabled={busy} onPress={recording ? stop : start} style={[styles.record, recording && styles.recording, busy && { opacity: .6 }]}>
        <Ionicons name={recording ? 'stop' : 'mic'} size={28} color={colors.white} />
      </Pressable>
      <View style={{ flex: 1, minWidth: 140 }}>
        <Text style={styles.title}>{recording ? 'Đang ghi âm…' : uri ? 'Đã có bản ghi' : 'Bấm để ghi âm'}</Text>
        <Text style={styles.sub}>{recording ? `${formatClock(elapsed)} / ${formatClock(maxSeconds)}` : uri ? 'Nghe lại và tự so sánh với bản mẫu.' : 'Bản ghi chỉ lưu tạm trên thiết bị của bạn.'}</Text>
      </View>
      {uri && !recording ? <Pressable accessibilityRole="button" accessibilityLabel={status.playing ? 'Tạm dừng bản ghi' : 'Nghe lại bản ghi'} onPress={togglePlay} style={styles.playback}>
        <Ionicons name={status.playing ? 'pause' : 'play'} size={20} color={colors.text} />
        <Text style={styles.playText}>{status.playing ? formatClock(status.currentTime) : 'Nghe lại'}</Text>
      </Pressable> : null}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>;
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  record: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  recording: { backgroundColor: colors.error, borderWidth: 4, borderColor: colors.errorSoft },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 12, color: colors.textSecondary, marginTop: 3, fontVariant: ['tabular-nums'] },
  playback: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white },
  playText: { fontSize: 13, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  error: { fontSize: 12.5, color: colors.error, lineHeight: 18 },
});
