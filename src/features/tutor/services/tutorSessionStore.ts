import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TutorSession, TutorSessionSummary } from '../types';

const ACTIVE_KEY = 'hustlingo_tutor_active_session_v1';
const SUMMARY_KEY = 'hustlingo_tutor_last_summary_v1';

export async function saveTutorSession(session: TutorSession) {
  await AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
}

export async function loadTutorSession() {
  const raw = await AsyncStorage.getItem(ACTIVE_KEY).catch(() => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TutorSession;
  } catch {
    return null;
  }
}

export async function saveTutorSummary(summary: TutorSessionSummary) {
  await AsyncStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
  await AsyncStorage.removeItem(ACTIVE_KEY);
}

export async function loadTutorSummary() {
  const raw = await AsyncStorage.getItem(SUMMARY_KEY).catch(() => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TutorSessionSummary;
  } catch {
    return null;
  }
}
