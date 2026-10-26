import type { LearningState, User } from '@/types';
import type { LocalVocabularyRecord } from '@/data/vocabulary-en';
import type { GrammarPoint } from '@/features/lessons/data/grammar';
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

type GrammarExampleRow = {
  position: number;
  sentence: string;
  translation: string;
};

type GrammarPointRow = {
  id: string;
  cefr_level: GrammarPoint['level'];
  category: string;
  title: string;
  title_vi: string;
  pattern: string;
  explanation: string;
  common_mistake: GrammarPoint['commonMistake'];
  sort_order: number;
  grammar_examples: GrammarExampleRow[];
};

type VocabularyRow = {
  id: string;
  language_code: string;
  term: string;
  translation: string;
  part_of_speech: string | null;
  pronunciation: string | null;
  ipa: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  topic_id: LocalVocabularyRecord['topicId'] | null;
  difficulty: LocalVocabularyRecord['difficulty'] | null;
  exam_tags: string[];
  frequency_rank: number | null;
  cefr_level: LocalVocabularyRecord['cefrLevel'] | null;
  cefr_source: LocalVocabularyRecord['cefrSource'] | null;
  cefr_confidence: LocalVocabularyRecord['cefrConfidence'] | null;
  toeic_relevance: LocalVocabularyRecord['toeicRelevance'] | null;
  ielts_relevance: LocalVocabularyRecord['ieltsRelevance'] | null;
  academic_relevance: LocalVocabularyRecord['academicRelevance'] | null;
  business_relevance: LocalVocabularyRecord['businessRelevance'] | null;
  quality: LocalVocabularyRecord['quality'];
  is_active: boolean;
  source_segment: LocalVocabularyRecord['sourceSegment'] | null;
  translation_source: LocalVocabularyRecord['translationSource'] | null;
  pronunciation_source: LocalVocabularyRecord['pronunciationSource'] | null;
  example_quality: LocalVocabularyRecord['exampleQuality'] | null;
  review_flags: string[];
  topics: { title: string } | null;
};

export interface VocabularyQuery {
  level?: LocalVocabularyRecord['cefrLevel'];
  topicId?: LocalVocabularyRecord['topicId'];
  search?: string;
  limit?: number;
  offset?: number;
}

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

async function currentAuthUser(expectedUserId?: string) {
  requireSupabaseConfig();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Bạn chưa đăng nhập.');
  if (expectedUserId && data.user.id !== expectedUserId) throw new Error('The active account changed. Please retry.');
  return data.user;
}

export const supabaseData = {
  async getGrammarPoints(): Promise<GrammarPoint[]> {
    requireSupabaseConfig();
    const { data, error } = await supabase
      .from('grammar_points')
      .select('id, cefr_level, category, title, title_vi, pattern, explanation, common_mistake, sort_order, grammar_examples(position, sentence, translation)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;

    return ((data || []) as unknown as GrammarPointRow[]).map((row) => {
      const examples = [...(row.grammar_examples || [])].sort((left, right) => left.position - right.position);
      return {
        id: row.id,
        level: row.cefr_level,
        category: row.category,
        title: row.title,
        titleVi: row.title_vi,
        pattern: row.pattern,
        explanation: row.explanation,
        examples: examples.map((example) => example.sentence),
        exampleTranslations: examples.map((example) => example.translation),
        commonMistake: row.common_mistake,
      };
    });
  },

  async getVocabulary(query: VocabularyQuery = {}): Promise<LocalVocabularyRecord[]> {
    requireSupabaseConfig();
    const limit = Math.min(Math.max(Math.trunc(query.limit ?? 50), 1), 100);
    const offset = Math.max(Math.trunc(query.offset ?? 0), 0);
    let request = supabase
      .from('vocabulary_entries')
      .select('id, language_code, term, translation, part_of_speech, pronunciation, ipa, example_sentence, example_translation, topic_id, difficulty, exam_tags, frequency_rank, cefr_level, cefr_source, cefr_confidence, toeic_relevance, ielts_relevance, academic_relevance, business_relevance, quality, is_active, source_segment, translation_source, pronunciation_source, example_quality, review_flags, topics(title)')
      .eq('is_published', true)
      .order('frequency_rank', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1);

    if (query.level) request = request.eq('cefr_level', query.level);
    if (query.topicId) request = request.eq('topic_id', query.topicId);
    if (query.search?.trim()) request = request.ilike('term', `%${query.search.trim()}%`);

    const { data, error } = await request;
    if (error) throw error;

    return ((data || []) as unknown as VocabularyRow[]).map((row) => ({
      id: row.id,
      languageCode: row.language_code,
      term: row.term,
      translation: row.translation,
      partOfSpeech: row.part_of_speech || undefined,
      pronunciation: row.pronunciation,
      ipa: row.ipa,
      exampleSentence: row.example_sentence || undefined,
      exampleTranslation: row.example_translation || undefined,
      topic: row.topics?.title || undefined,
      difficulty: row.difficulty || undefined,
      examTags: row.exam_tags,
      frequencyRank: row.frequency_rank || undefined,
      topicId: row.topic_id || undefined,
      cefrLevel: row.cefr_level || undefined,
      cefrSource: row.cefr_source || undefined,
      cefrConfidence: row.cefr_confidence || undefined,
      toeicRelevance: row.toeic_relevance || undefined,
      ieltsRelevance: row.ielts_relevance || undefined,
      academicRelevance: row.academic_relevance || undefined,
      businessRelevance: row.business_relevance || undefined,
      quality: row.quality || undefined,
      isActive: row.is_active,
      sourceSegment: row.source_segment || undefined,
      translationSource: row.translation_source || undefined,
      pronunciationSource: row.pronunciation_source || undefined,
      exampleQuality: row.example_quality || undefined,
      reviewFlags: row.review_flags,
    }));
  },

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

  async getProgress(expectedUserId?: string): Promise<LearningState> {
    const authUser = await currentAuthUser(expectedUserId);
    const { data, error } = await supabase
      .from('learning_progress')
      .select('state')
      .eq('user_id', authUser.id)
      .maybeSingle();
    if (error) throw error;
    return (data?.state as LearningState | null) || EMPTY_PROGRESS;
  },

  async putProgress(state: LearningState, expectedUserId?: string): Promise<void> {
    const authUser = await currentAuthUser(expectedUserId);
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
