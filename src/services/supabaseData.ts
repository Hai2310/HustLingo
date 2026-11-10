import type { LearningState, User } from '@/types';
import { requireSupabaseConfig, supabase } from './supabase';

const EMPTY_PROGRESS: LearningState = {
  studiedWordIds: [],
  reviewWordIds: [],
  savedWordIds: [],
  completedLessonIds: [],
  correctAnswers: 0,
  totalAnswers: 0,
  minutesToday: 0,
};

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'learner' | 'admin' | null;
  status: 'active' | 'disabled' | null;
  english_level: string | null;
  learning_goal: string | null;
  daily_minutes: number | null;
};

function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name || row.email?.split('@')[0] || 'HustLingo Learner',
    avatarUrl: row.avatar_url,
    role: row.role || 'learner',
    status: row.status || 'active',
    englishLevel: row.english_level,
    learningGoal: row.learning_goal,
    dailyMinutes: row.daily_minutes,
  };
}

async function currentAuthUser() {
  requireSupabaseConfig();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Bạn chưa đăng nhập.');
  return data.user;
}

export const supabaseData = {
  async getProfile(): Promise<User> {
    const authUser = await currentAuthUser();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      const displayName =
        authUser.user_metadata?.display_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'HustLingo Learner';
      const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          email: authUser.email || null,
          display_name: displayName,
          avatar_url: avatarUrl,
        })
        .select('*')
        .single();
      if (createError) throw createError;
      return toUser(created as ProfileRow);
    }
    return toUser(data as ProfileRow);
  },

  async updateProfile(payload: Partial<Pick<User, 'displayName' | 'englishLevel' | 'learningGoal' | 'dailyMinutes'>>) {
    const authUser = await currentAuthUser();
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (payload.displayName !== undefined) patch.display_name = payload.displayName;
    if (payload.englishLevel !== undefined) patch.english_level = payload.englishLevel;
    if (payload.learningGoal !== undefined) patch.learning_goal = payload.learningGoal;
    if (payload.dailyMinutes !== undefined) patch.daily_minutes = payload.dailyMinutes;

    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', authUser.id)
      .select('*')
      .single();
    if (error) throw error;
    return toUser(data as ProfileRow);
  },

  async getProgress(): Promise<LearningState> {
    const authUser = await currentAuthUser();
    const { data, error } = await supabase
      .from('learning_progress')
      .select('state')
      .eq('user_id', authUser.id)
      .maybeSingle();
    if (error) throw error;
    return (data?.state as LearningState | null) || EMPTY_PROGRESS;
  },

  async putProgress(state: LearningState): Promise<void> {
    const authUser = await currentAuthUser();
    const { error } = await supabase.from('learning_progress').upsert({
      user_id: authUser.id,
      state,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  },

  async sendFeedback(message: string): Promise<void> {
    const authUser = await currentAuthUser();
    const { error } = await supabase.from('feedback').insert({
      user_id: authUser.id,
      message,
    });
    if (error) throw error;
  },
};
