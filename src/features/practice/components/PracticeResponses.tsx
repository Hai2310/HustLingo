import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder } from 'expo-audio';
import { Link, useLocalSearchParams } from 'expo-router';
import { AppButton } from '@/components/common/Buttons';
import { useAuth } from '@/contexts/AuthContext';
import { useLearning } from '@/contexts/LearningContext';
import { useLessonSpeech } from '@/features/lessons/hooks/useLessonSpeech';
import { hum } from '@/theme/hum';
import type { SkillExercise } from '../data/catalog';
import { usePronunciationAssessment } from '../hooks/usePronunciationAssessment';
import { practiceStyles } from './PracticeUI';
import { PronunciationFeedback } from './PronunciationFeedback';

export function WritingResponse({ exercise, storageKey }: {
  exercise: Extract<SkillExercise, { skill: 'writing' }>;
  storageKey: string;
}) {
  const { state, ready, completePractice } = useLearning();
  const practiceId = `writing:${exercise.id}`;
  const completed = state.completedPracticeIds.includes(practiceId);
  const [draft, setDraft] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState<'draft' | 'complete' | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(storageKey).then(text => {
      if (active) setDraft(text ?? '');
    }).catch(() => {
      if (active) setMessage('Chưa đọc được bản nháp cũ trên thiết bị.');
    }).finally(() => {
      if (active) setLoaded(true);
    });
    return () => { active = false; };
  }, [storageKey]);

  async function save(action: 'draft' | 'complete') {
    setSaving(action);
    try {
      await AsyncStorage.setItem(storageKey, draft);
      if (action === 'complete') {
        completePractice(practiceId);
        setMessage('Đã hoàn thành bài viết.');
      } else {
        setMessage('Đã lưu bản nháp trên thiết bị này.');
      }
    } catch {
      setMessage('Chưa lưu được bản nháp. Hãy thử lại.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <View style={practiceStyles.sheet}>
      <Text style={practiceStyles.heading}>{exercise.prompt}</Text>
      {exercise.tip ? <Text style={practiceStyles.detail}>{exercise.tip}</Text> : null}
      <TextInput
        accessibilityLabel="Bài viết của bạn"
        placeholder={loaded ? 'Viết câu trả lời bằng tiếng Anh…' : 'Đang mở bản nháp…'}
        placeholderTextColor={hum.muted}
        value={draft}
        onChangeText={value => { setDraft(value); setMessage(''); }}
        editable={loaded && !saving}
        multiline
        maxLength={10000}
        textAlignVertical="top"
        style={[practiceStyles.input, styles.writing]}
      />
      <Text style={practiceStyles.label}>{draft.trim() ? draft.trim().split(/\s+/).length : 0} từ</Text>
      <View style={styles.actions}>
        <AppButton title="Lưu bản nháp" icon="save-outline" variant="secondary" disabled={!loaded || !!saving} loading={saving === 'draft'} onPress={() => { void save('draft'); }} />
        {!completed && (
          <AppButton title="Hoàn thành bài viết" icon="checkmark-outline" disabled={!loaded || !ready || !draft.trim() || !!saving} loading={saving === 'complete'} onPress={() => { void save('complete'); }} />
        )}
      </View>
      {(message || completed) ? <Text accessibilityLiveRegion="polite" aria-live="polite" style={practiceStyles.detail}>{message || 'Đã hoàn thành bài viết.'}</Text> : null}
    </View>
  );
}

export function SpeakingResponse({ exercise }: { exercise: Extract<SkillExercise, { skill: 'speaking' }> }) {
  const { isGuest, loading: authLoading, user } = useAuth();
  const { state, ready, completePractice } = useLearning();
  const practiceId = `speaking:${exercise.id}`;
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const supportsAssessment = Platform.OS === 'web' && typeof OfflineAudioContext !== 'undefined';
  const canPreview = __DEV__ && supportsAssessment && typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const isDemo = canPreview && demo === 'pronunciation';
  const canAssess = supportsAssessment && (isDemo || (!authLoading && !isGuest));
  const pronunciation = usePronunciationAssessment(exercise.id, canAssess ? user.id : undefined, isDemo ? exercise.text : undefined);
  const scoring = pronunciation.state.status === 'loading';
  const speech = useLessonSpeech();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [clip, setClip] = useState<string | null>(null);
  const player = useAudioPlayer(clip);
  const playback = useAudioPlayerStatus(player);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(true);
  const recordingMode = useRef(false);
  const captureActive = useRef(false);
  const recordLimit = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (Platform.OS === 'web' && clip) URL.revokeObjectURL(clip);
  }, [clip]);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (recordLimit.current !== null) clearTimeout(recordLimit.current);
      if (Platform.OS === 'web' && captureActive.current) {
        captureActive.current = false;
        void recorder.stop().then(() => {
          if (recorder.uri) URL.revokeObjectURL(recorder.uri);
        }).catch(() => {});
      }
      if (recordingMode.current) {
        recordingMode.current = false;
        void setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      }
    };
  }, [recorder]);

  async function finishRecording() {
    if (!captureActive.current) return;
    captureActive.current = false;
    if (recordLimit.current !== null) clearTimeout(recordLimit.current);
    recordLimit.current = null;
    setBusy(true);
    setError('');
    try {
      const duration = recorder.getStatus().durationMillis;
      await recorder.stop();
      const uri = recorder.uri;
      if (!active.current) {
        if (Platform.OS === 'web' && uri) URL.revokeObjectURL(uri);
      } else if (uri) {
        setClip(uri);
        if (!isDemo && duration >= 500) completePractice(practiceId);
        if (canAssess) void pronunciation.assess(uri);
      } else {
        setError('Chưa tạo được bản ghi âm.');
      }
    } catch {
      if (active.current) setError('Chưa lưu được bản ghi. Hãy thử ghi lại.');
    } finally {
      if (recordingMode.current) {
        recordingMode.current = false;
        await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      }
      if (active.current) {
        setRecording(false);
        setBusy(false);
      }
    }
  }

  async function startRecording() {
    setBusy(true);
    setError('');
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!active.current) return;
      if (!permission.granted) {
        setError('Hãy cấp quyền micro trong cài đặt để ghi âm.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      if (!active.current) {
        await setAudioModeAsync({ allowsRecording: false });
        return;
      }
      recordingMode.current = true;
      await recorder.prepareToRecordAsync();
      if (active.current) {
        recorder.record();
        captureActive.current = true;
        pronunciation.reset();
        setRecording(true);
        if (canAssess) recordLimit.current = setTimeout(() => { void finishRecording(); }, 15_000);
      } else if (Platform.OS === 'web') {
        // Expo releases browser microphone tracks when MediaRecorder stops.
        recorder.record();
        await recorder.stop();
        if (recorder.uri) URL.revokeObjectURL(recorder.uri);
      }
    } catch {
      if (recordingMode.current) {
        recordingMode.current = false;
        await setAudioModeAsync({ allowsRecording: false }).catch(() => {});
      }
      if (active.current) {
        setRecording(false);
        setError('Không dùng được micro hoặc chưa lưu được bản ghi. Bạn có thể thử lại.');
      }
    } finally {
      if (active.current) setBusy(false);
    }
  }

  async function replay() {
    setError('');
    try {
      if (playback.playing) player.pause();
      else {
        await player.seekTo(0);
        player.play();
      }
    } catch {
      setError('Chưa phát được bản ghi âm. Hãy thử ghi lại.');
    }
  }

  return (
    <View style={practiceStyles.sheet}>
      <Text style={practiceStyles.heading}>{exercise.text}</Text>
      {exercise.translation ? <Text style={practiceStyles.detail}>{exercise.translation}</Text> : null}
      <Text style={practiceStyles.detail}>
        {isDemo ? 'Bản thử trên localhost hiển thị điểm mẫu. Bản ghi được giữ trên thiết bị.' : canAssess ? 'Đọc câu mẫu trong 15 giây. Khi dừng, bản ghi được gửi tới Azure để chấm phát âm.' : 'Nghe mẫu, đọc lại rồi nghe bản ghi để tự so sánh.'}
      </Text>
      {Platform.OS === 'web' && !isDemo && !authLoading && isGuest && (
        <Text style={practiceStyles.detail}><Link style={styles.signIn} href="/(auth)/signin">Đăng nhập</Link> để chấm phát âm.</Text>
      )}
      <View style={styles.actions}>
        <AppButton title={speech.speaking ? 'Dừng nghe mẫu' : 'Nghe mẫu'} icon="volume-high-outline" variant="secondary" disabled={recording || busy || playback.playing} onPress={() => { void speech.speak(exercise.id, exercise.text); }} />
        <AppButton title={recording ? 'Dừng ghi âm' : 'Ghi âm'} icon={recording ? 'stop-outline' : 'mic-outline'} disabled={(!ready && !recording) || !!speech.speaking || playback.playing || scoring} loading={busy} onPress={() => { void (recording ? finishRecording() : startRecording()); }} />
        {clip && <AppButton title={playback.playing ? 'Dừng phát bản ghi' : 'Nghe lại bản ghi'} icon="play-outline" variant="secondary" disabled={recording || busy || !!speech.speaking} onPress={() => { void replay(); }} />}
      </View>
      <Text accessibilityLiveRegion="polite" aria-live="polite" style={practiceStyles.detail}>
        {error || speech.audioError || (recording ? 'Đang ghi âm…' : 'Bản ghi dùng để nghe lại trong bài này.')}
      </Text>
      {canAssess && scoring && <Text style={practiceStyles.label} accessibilityLiveRegion="polite" aria-live="polite">{isDemo ? 'Đang chuẩn bị điểm mẫu…' : 'Đang chấm phát âm…'}</Text>}
      {canAssess && pronunciation.state.status === 'error' && <>
        <Text style={practiceStyles.detail} accessibilityLiveRegion="polite" aria-live="polite">{pronunciation.state.message}</Text>
        {clip && pronunciation.state.retryable && <AppButton title="Chấm lại bản ghi" icon="refresh-outline" variant="secondary" style={styles.retry} onPress={() => { void pronunciation.assess(clip); }} />}
        {!pronunciation.state.retryable && canPreview && !isDemo && (
          <Link style={styles.signIn} href={{ pathname: '/practice/[exerciseId]', params: { exerciseId: exercise.id, skill: 'speaking', demo: 'pronunciation' } }}>
            Thử với điểm mẫu
          </Link>
        )}
      </>}
      {canAssess && pronunciation.state.status === 'ready' && <PronunciationFeedback demo={isDemo} result={pronunciation.state.result} />}
      {!isDemo && state.completedPracticeIds.includes(practiceId) && <Text style={practiceStyles.label}>Đã hoàn thành bài luyện nói.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  writing: { minHeight: 170 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  retry: { alignSelf: 'flex-start' },
  signIn: { color: hum.blue, fontWeight: '700', textDecorationLine: 'underline' },
});
