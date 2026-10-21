import { requireSupabaseConfig, supabase } from './supabase';

export type LearningCefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type LessonType = 'vocabulary' | 'grammar';
export type PracticeSkill = 'listening' | 'reading' | 'writing' | 'speaking';
export type TutorScenarioLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PageQuery {
  limit?: number;
  offset?: number;
}

export interface ContentQuery extends PageQuery {
  level?: LearningCefrLevel;
}

export type TopicQuery = ContentQuery;

export interface TopicContent {
  id: string;
  title: string;
  description: string | null;
  subtitle: string | null;
  icon: string | null;
  level: LearningCefrLevel | null;
  accentColor: string | null;
  sortOrder: number;
}

export interface VocabularyQuery extends ContentQuery {
  topicId?: string;
  search?: string;
  examTag?: string;
  ids?: string[];
}

export interface VocabularyContent {
  id: string;
  languageCode: string;
  term: string;
  translation: string;
  partOfSpeech: string | null;
  pronunciation: string | null;
  ipa: string | null;
  exampleSentence: string | null;
  exampleTranslation: string | null;
  topicId: string | null;
  topic: string | null;
  difficulty: LearningCefrLevel | null;
  examTags: string[];
  frequencyRank: number | null;
  cefrLevel: LearningCefrLevel | null;
  cefrSource: string | null;
  cefrConfidence: 'high' | 'medium' | 'low' | null;
  toeicRelevance: string | null;
  ieltsRelevance: string | null;
  academicRelevance: string | null;
  businessRelevance: string | null;
  quality: 'production' | 'review';
  isActive: boolean;
  sourceSegment: string | null;
  translationSource: string | null;
  pronunciationSource: string | null;
  exampleQuality: string | null;
  reviewFlags: string[];
}

export interface GrammarQuery extends ContentQuery {
  category?: string;
  search?: string;
  ids?: string[];
}

export interface GrammarContent {
  id: string;
  level: Exclude<LearningCefrLevel, 'C2'>;
  category: string;
  title: string;
  titleVi: string;
  pattern: string;
  explanation: string;
  examples: string[];
  exampleTranslations: string[];
  commonMistake: { incorrect: string; correct: string; explanation: string };
}

export interface LessonQuery extends ContentQuery {
  type?: LessonType;
}

export interface LessonItemsQuery {
  limit?: number;
  offset?: number;
}

export interface LessonContent {
  id: string;
  title: string;
  description: string | null;
  level: LearningCefrLevel;
  type: LessonType;
  sortOrder: number;
  topicId: string | null;
  topicTitle: string | null;
}

export interface LessonContentItem {
  position: number;
  vocabulary: VocabularyContent | null;
  grammar: GrammarContent | null;
}

export interface ListeningPracticePayload {
  transcript: string;
  question: string;
  options: string[];
  answer: number;
}

export interface ReadingPracticePayload {
  text: string;
  question: string;
  options: string[];
  answer: number;
}

export interface WritingPracticePayload {
  prompt: string;
  tip: string;
}

export interface SpeakingPracticePayload {
  text: string;
  vi: string;
}

export type PracticeContent =
  | { id: string; skill: 'listening'; level: LearningCefrLevel; title: string; sortOrder: number; payload: ListeningPracticePayload }
  | { id: string; skill: 'reading'; level: LearningCefrLevel; title: string; sortOrder: number; payload: ReadingPracticePayload }
  | { id: string; skill: 'writing'; level: LearningCefrLevel; title: string; sortOrder: number; payload: WritingPracticePayload }
  | { id: string; skill: 'speaking'; level: LearningCefrLevel; title: null; sortOrder: number; payload: SpeakingPracticePayload };

export interface PracticeQuery extends ContentQuery {
  skill?: PracticeSkill;
  ids?: string[];
}

export interface TutorProfile {
  id: string;
  name: string;
  role: string;
  initials: string;
  description: string;
  tone: string | null;
  accentColor: string | null;
  sortOrder: number;
}

export interface TutorScenario {
  id: string;
  tutorId: string;
  title: string;
  subtitle: string;
  level: TutorScenarioLevel;
  icon: string | null;
  sortOrder: number;
  tutor: TutorProfile | null;
}

export interface TutorScenarioMessage {
  position: number;
  role: 'tutor' | 'learner';
  text: string;
}

export interface TutorScenarioBundle {
  scenario: TutorScenario;
  messages: TutorScenarioMessage[];
}

export interface TutorScenarioQuery {
  tutorId?: string;
  level?: TutorScenarioLevel;
  limit?: number;
  offset?: number;
}

type TopicRow = {
  id: string;
  title: string;
  description: string | null;
  subtitle: string | null;
  icon: string | null;
  cefr_level: LearningCefrLevel | null;
  accent_color: string | null;
  sort_order: number;
};

type GrammarExampleRow = { position: number; sentence: string; translation: string };
type GrammarPointRow = {
  id: string;
  cefr_level: GrammarContent['level'];
  category: string;
  title: string;
  title_vi: string;
  pattern: string;
  explanation: string;
  common_mistake: GrammarContent['commonMistake'];
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
  topic_id: string | null;
  difficulty: LearningCefrLevel | null;
  exam_tags: string[];
  frequency_rank: number | null;
  cefr_level: LearningCefrLevel | null;
  cefr_source: string | null;
  cefr_confidence: VocabularyContent['cefrConfidence'];
  toeic_relevance: string | null;
  ielts_relevance: string | null;
  academic_relevance: string | null;
  business_relevance: string | null;
  quality: VocabularyContent['quality'];
  is_active: boolean;
  source_segment: string | null;
  translation_source: string | null;
  pronunciation_source: string | null;
  example_quality: string | null;
  review_flags: string[];
  topics: { title: string } | null;
};

type LessonRow = {
  id: string;
  topic_id: string | null;
  cefr_level: LearningCefrLevel;
  lesson_type: LessonType;
  title: string;
  description: string | null;
  sort_order: number;
  topic: { title: string } | null;
};

type LessonItemRow = {
  position: number;
  vocabulary: VocabularyRow | null;
  grammar: GrammarPointRow | null;
};

type PracticeRow = {
  id: string;
  skill: PracticeSkill;
  cefr_level: LearningCefrLevel;
  title: string | null;
  payload: Record<string, unknown>;
  sort_order: number;
};

type TutorRow = {
  id: string;
  name: string;
  role: string;
  initials: string;
  description: string;
  tone: string | null;
  accent_color: string | null;
  sort_order: number;
};

type ScenarioRow = {
  id: string;
  tutor_id: string;
  title: string;
  subtitle: string;
  level: TutorScenarioLevel;
  icon: string | null;
  sort_order: number;
  tutor?: TutorRow | null;
};

type ScenarioBundleRow = ScenarioRow & {
  tutor: TutorRow | null;
  tutor_scenario_messages: TutorScenarioMessage[];
};

const MAX_PAGE_SIZE = 500;

function page(limit = 100, offset = 0) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), MAX_PAGE_SIZE);
  const safeOffset = Math.max(Math.trunc(offset), 0);
  return { limit: safeLimit, offset: safeOffset };
}

function toTopic(row: TopicRow): TopicContent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subtitle: row.subtitle,
    icon: row.icon,
    level: row.cefr_level,
    accentColor: row.accent_color,
    sortOrder: row.sort_order,
  };
}

function toVocabulary(row: VocabularyRow): VocabularyContent {
  return {
    id: row.id,
    languageCode: row.language_code,
    term: row.term,
    translation: row.translation,
    partOfSpeech: row.part_of_speech,
    pronunciation: row.pronunciation,
    ipa: row.ipa,
    exampleSentence: row.example_sentence,
    exampleTranslation: row.example_translation,
    topicId: row.topic_id,
    topic: row.topics?.title || null,
    difficulty: row.difficulty,
    examTags: row.exam_tags || [],
    frequencyRank: row.frequency_rank,
    cefrLevel: row.cefr_level,
    cefrSource: row.cefr_source,
    cefrConfidence: row.cefr_confidence,
    toeicRelevance: row.toeic_relevance,
    ieltsRelevance: row.ielts_relevance,
    academicRelevance: row.academic_relevance,
    businessRelevance: row.business_relevance,
    quality: row.quality,
    isActive: row.is_active,
    sourceSegment: row.source_segment,
    translationSource: row.translation_source,
    pronunciationSource: row.pronunciation_source,
    exampleQuality: row.example_quality,
    reviewFlags: row.review_flags || [],
  };
}

function toGrammar(row: GrammarPointRow): GrammarContent {
  const examples = [...(row.grammar_examples || [])].sort((a, b) => a.position - b.position);
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
}

function toTutor(row: TutorRow): TutorProfile {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    initials: row.initials,
    description: row.description,
    tone: row.tone,
    accentColor: row.accent_color,
    sortOrder: row.sort_order,
  };
}

function toScenario(row: ScenarioRow): TutorScenario {
  return {
    id: row.id,
    tutorId: row.tutor_id,
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    icon: row.icon,
    sortOrder: row.sort_order,
    tutor: row.tutor ? toTutor(row.tutor) : null,
  };
}

function toPractice(row: PracticeRow): PracticeContent {
  const common = {
    id: row.id,
    level: row.cefr_level,
    sortOrder: row.sort_order,
  };
  if (row.skill === 'listening') {
    return { ...common, skill: row.skill, title: row.title || '', payload: row.payload as unknown as ListeningPracticePayload };
  }
  if (row.skill === 'reading') {
    return { ...common, skill: row.skill, title: row.title || '', payload: row.payload as unknown as ReadingPracticePayload };
  }
  if (row.skill === 'writing') {
    return { ...common, skill: row.skill, title: row.title || '', payload: row.payload as unknown as WritingPracticePayload };
  }
  return { ...common, skill: row.skill, title: null, payload: row.payload as unknown as SpeakingPracticePayload };
}

export const learningContentService = {
  async getTopics(query: TopicQuery = {}): Promise<TopicContent[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('topics')
      .select('id, title, description, subtitle, icon, cefr_level, accent_color, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('title', { ascending: true })
      .range(offset, offset + limit - 1);
    if (query.level) request = request.eq('cefr_level', query.level);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as TopicRow[]).map(toTopic);
  },

  async getVocabulary(query: VocabularyQuery = {}): Promise<VocabularyContent[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('vocabulary_entries')
      .select(`id, language_code, term, translation, part_of_speech, pronunciation, ipa,
        example_sentence, example_translation, topic_id, difficulty, exam_tags, frequency_rank,
        cefr_level, cefr_source, cefr_confidence, toeic_relevance, ielts_relevance,
        academic_relevance, business_relevance, quality, is_active, source_segment,
        translation_source, pronunciation_source, example_quality, review_flags, topics(title)`)
      .eq('is_published', true)
      .order('frequency_rank', { ascending: true, nullsFirst: false })
      .range(offset, offset + limit - 1);
    if (query.level) request = request.eq('cefr_level', query.level);
    if (query.topicId) request = request.eq('topic_id', query.topicId);
    if (query.search?.trim()) request = request.ilike('term', `%${query.search.trim()}%`);
    if (query.examTag) request = request.contains('exam_tags', [query.examTag]);
    if (query.ids?.length) request = request.in('id', query.ids);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as VocabularyRow[]).map(toVocabulary);
  },

  async getGrammarPoints(query: GrammarQuery = {}): Promise<GrammarContent[]> {
    requireSupabaseConfig();
    if (query.level === 'C2') return [];
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('grammar_points')
      .select(`id, cefr_level, category, title, title_vi, pattern, explanation,
        common_mistake, sort_order, grammar_examples(position, sentence, translation)`)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);
    if (query.level) request = request.eq('cefr_level', query.level);
    if (query.category) request = request.eq('category', query.category);
    if (query.search?.trim()) request = request.ilike('title', `%${query.search.trim()}%`);
    if (query.ids?.length) request = request.in('id', query.ids);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as GrammarPointRow[]).map(toGrammar);
  },

  async getLessons(query: LessonQuery = {}): Promise<LessonContent[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('lessons')
      .select('id, topic_id, cefr_level, lesson_type, title, description, sort_order, topic:topics(title)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);
    if (query.level) request = request.eq('cefr_level', query.level);
    if (query.type) request = request.eq('lesson_type', query.type);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as LessonRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      level: row.cefr_level,
      type: row.lesson_type,
      sortOrder: row.sort_order,
      topicId: row.topic_id,
      topicTitle: row.topic?.title || null,
    }));
  },

  async getLessonItems(lessonId: string, query: LessonItemsQuery = {}): Promise<LessonContentItem[]> {
    requireSupabaseConfig();
    if (!lessonId.trim()) return [];
    const { limit, offset } = page(query.limit ?? 50, query.offset);
    const { data, error } = await supabase
      .from('lesson_items')
      .select(`position,
        vocabulary:vocabulary_entries(id, language_code, term, translation, part_of_speech, pronunciation, ipa,
          example_sentence, example_translation, topic_id, difficulty, exam_tags, frequency_rank,
          cefr_level, cefr_source, cefr_confidence, toeic_relevance, ielts_relevance, academic_relevance,
          business_relevance, quality, is_active, source_segment, translation_source,
          pronunciation_source, example_quality, review_flags, topics(title)),
        grammar:grammar_points(id, cefr_level, category, title, title_vi, pattern, explanation,
          common_mistake, sort_order, grammar_examples(position, sentence, translation))`)
      .eq('lesson_id', lessonId)
      .order('position', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return ((data || []) as unknown as LessonItemRow[]).map((item) => ({
      position: item.position,
      vocabulary: item.vocabulary ? toVocabulary(item.vocabulary) : null,
      grammar: item.grammar ? toGrammar(item.grammar) : null,
    }));
  },

  async getPracticeContent(query: PracticeQuery = {}): Promise<PracticeContent[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('practice_content')
      .select('id, skill, cefr_level, title, payload, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);
    if (query.level) request = request.eq('cefr_level', query.level);
    if (query.skill) request = request.eq('skill', query.skill);
    if (query.ids?.length) request = request.in('id', query.ids);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as PracticeRow[]).map(toPractice);
  },

  async getTutors(query: PageQuery = {}): Promise<TutorProfile[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    const { data, error } = await supabase
      .from('ai_tutors')
      .select('id, name, role, initials, description, tone, accent_color, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return ((data || []) as unknown as TutorRow[]).map(toTutor);
  },

  async getTutorScenarios(query: TutorScenarioQuery = {}): Promise<TutorScenario[]> {
    requireSupabaseConfig();
    const { limit, offset } = page(query.limit, query.offset);
    let request = supabase
      .from('tutor_scenarios')
      .select('id, tutor_id, title, subtitle, level, icon, sort_order, tutor:ai_tutors(id, name, role, initials, description, tone, accent_color, sort_order)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .range(offset, offset + limit - 1);
    if (query.tutorId) request = request.eq('tutor_id', query.tutorId);
    if (query.level) request = request.eq('level', query.level);
    const { data, error } = await request;
    if (error) throw error;
    return ((data || []) as unknown as ScenarioRow[]).map(toScenario);
  },

  async getTutorScenarioMessages(scenarioId: string): Promise<TutorScenarioMessage[]> {
    requireSupabaseConfig();
    if (!scenarioId.trim()) return [];
    const { data, error } = await supabase
      .from('tutor_scenario_messages')
      .select('position, role, text')
      .eq('scenario_id', scenarioId)
      .order('position', { ascending: true });
    if (error) throw error;
    return (data || []) as TutorScenarioMessage[];
  },

  async getTutorScenarioBundle(scenarioId: string): Promise<TutorScenarioBundle | null> {
    requireSupabaseConfig();
    if (!scenarioId.trim()) return null;
    const { data, error } = await supabase
      .from('tutor_scenarios')
      .select(`id, tutor_id, title, subtitle, level, icon, sort_order,
        tutor:ai_tutors(id, name, role, initials, description, tone, accent_color, sort_order),
        tutor_scenario_messages(position, role, text)`)
      .eq('id', scenarioId)
      .eq('is_published', true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as unknown as ScenarioBundleRow;
    return {
      scenario: toScenario(row),
      messages: [...(row.tutor_scenario_messages || [])].sort((a, b) => a.position - b.position),
    };
  },
};
