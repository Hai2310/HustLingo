import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/supabase';
import type { TutorSession, TutorSessionSummary } from '../types';

const key = (kind: string, owner: string) => `hustlingo_tutor_${kind}_v2:${owner}`;
export async function saveTutorSession(session: TutorSession, owner: string) {
  await AsyncStorage.setItem(key('active', owner), JSON.stringify(session));
}
export async function loadTutorSession(owner: string): Promise<TutorSession | null> {
  const raw = await AsyncStorage.getItem(key('active', owner));
  if (!raw) return null;
  try { return JSON.parse(raw) as TutorSession; } catch { return null; }
}
export async function saveTutorSummary(summary: TutorSessionSummary, owner: string) {
  await AsyncStorage.setItem(key('summary', owner), JSON.stringify(summary));
  await AsyncStorage.removeItem(key('active', owner));
}
export async function loadTutorSummary(owner: string): Promise<TutorSessionSummary | null> {
  const raw = await AsyncStorage.getItem(key('summary', owner));
  if (!raw) return null;
  try { return JSON.parse(raw) as TutorSessionSummary; } catch { return null; }
}
export async function loadCloudTutorSession(owner: string, scenarioId: string, tutorId: string, sessionId?: string): Promise<TutorSession | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
  let query = supabase.from('tutor_sessions').select('id,tutor_id,scenario_id,status,started_at,ended_at')
    .eq('user_id', owner).eq('scenario_id', scenarioId).eq('tutor_id', tutorId);
  query = sessionId ? query.eq('id', sessionId) : query.in('status', ['active', 'paused']);
  const { data, error } = await query.order('updated_at', { ascending: false }).limit(1).abortSignal(controller.signal).maybeSingle();
  if (error) throw new Error('Không tải được phiên luyện tập từ database.');
  if (!data) return null;
  const messages = await supabase.from('tutor_messages').select('id,role,content,metadata,created_at')
    .eq('session_id', data.id).eq('user_id', owner).order('created_at').order('role').order('id').abortSignal(controller.signal);
  if (messages.error) throw new Error('Không tải được hội thoại đã lưu.');
  const rows = messages.data || [];
  return {
    id: data.id, tutorId: data.tutor_id, scenarioId: data.scenario_id, status: data.status,
    startedAt: data.started_at, endedAt: data.ended_at || undefined,
    messages: rows.map(row => ({ id: row.id, role: row.role, text: row.content, createdAt: row.created_at })),
    corrections: rows.flatMap(row => row.metadata?.correction ? [row.metadata.correction] : []),
    newVocabulary: rows.flatMap(row => row.metadata?.newVocabulary || []),
  };
  } finally { clearTimeout(timer); }
}
