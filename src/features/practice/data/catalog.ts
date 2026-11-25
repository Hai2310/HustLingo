import { supabase, supabaseConfigured } from '@/services/supabase';
import { listeningLessons, readingLessons, speakingPhrases, writingPrompts } from './sourceData';

export const skills = ['listening', 'reading', 'writing', 'speaking', 'grammar'] as const;
export type PracticeSkill = typeof skills[number];
type Skill = Exclude<PracticeSkill, 'grammar'>;

type Entry = { id: string; title: string; level: string };
type Choice = { question: string; options: string[]; answer: number };
export type SkillExercise = Entry & (
  | ({ skill: 'listening'; transcript: string } & Choice)
  | ({ skill: 'reading'; text: string } & Choice)
  | { skill: 'writing'; prompt: string; tip: string }
  | { skill: 'speaking'; text: string; translation: string }
);

export type GrammarExercise = {
  id: string;
  grammar_topic: string;
  gapped_text: string;
  solution: string;
  distractors: string[];
  filled_text: string;
  source_url: string;
  source_license: string;
};

type SkillRow = {
  id: string;
  skill: Skill;
  title: string | null;
  cefr_level: string;
  payload: Record<string, unknown>;
};

// Includes all groups in the pinned grammar seed, for databases without the topics view.
const grammarTopicNames: Record<string, string> = {
  articles: 'Mạo từ',
  comparisons: 'Câu so sánh',
  conditionals: 'Câu điều kiện',
  future_simple: 'Thì tương lai đơn',
  modals: 'Động từ khuyết thiếu',
  non_finites: 'Dạng động từ không chia',
  passive: 'Câu bị động',
  past_continuous: 'Thì quá khứ tiếp diễn',
  past_perfect: 'Thì quá khứ hoàn thành',
  past_simple: 'Thì quá khứ đơn',
  personal_pronouns: 'Đại từ nhân xưng',
  possessives: 'Chỉ sự sở hữu',
  prepositions: 'Giới từ',
  present_continuous: 'Thì hiện tại tiếp diễn',
  present_perfect: 'Thì hiện tại hoàn thành',
  present_simple: 'Thì hiện tại đơn',
  quantifiers: 'Từ chỉ số lượng',
  relatives: 'Mệnh đề quan hệ',
  wh_questions: 'Câu hỏi Wh-',
};

export const grammarPageSize = 24;
export const isPracticeSkill = (value?: string): value is PracticeSkill => skills.some(skill => skill === value);
export const grammarTopicLabel = (topic: string) => topic.replace(/_/g, ' ').replace(/^\w/, letter => letter.toUpperCase());
export const grammarTopicTitle = (topic: string) => Object.hasOwn(grammarTopicNames, topic) ? grammarTopicNames[topic] : grammarTopicLabel(topic);

const localExercises: SkillExercise[] = [
  ...listeningLessons.map(item => ({ ...item, skill: 'listening' as const })),
  ...readingLessons.map(item => ({ ...item, skill: 'reading' as const })),
  ...writingPrompts.map(item => ({ ...item, skill: 'writing' as const })),
  ...speakingPhrases.map(item => ({ ...item, skill: 'speaking' as const, title: item.text, translation: item.vi })),
];

function mapSkillExercise(row: SkillRow): SkillExercise | null {
  const payload = row.payload;
  if (!payload || typeof payload !== 'object') return null;
  const entry = { id: row.id, title: row.title || '', level: row.cefr_level };
  if (row.skill === 'writing' && typeof payload.prompt === 'string') {
    return { ...entry, skill: row.skill, prompt: payload.prompt, tip: typeof payload.tip === 'string' ? payload.tip : '' };
  }
  if (row.skill === 'speaking' && typeof payload.text === 'string') {
    return { ...entry, title: entry.title || payload.text, skill: row.skill, text: payload.text, translation: typeof payload.vi === 'string' ? payload.vi : '' };
  }
  const { question, options, answer } = payload;
  if (typeof question !== 'string' || !Array.isArray(options) || !options.every(value => typeof value === 'string') ||
      typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer >= options.length) return null;
  const choice = { question, options, answer };
  if (row.skill === 'reading' && typeof payload.text === 'string') {
    return { ...entry, ...choice, skill: row.skill, text: payload.text };
  }
  if (row.skill === 'listening' && typeof payload.transcript === 'string') {
    return { ...entry, ...choice, skill: row.skill, transcript: payload.transcript };
  }
  return null;
}

export async function loadPracticeCatalog(signal: AbortSignal) {
  if (supabaseConfigured) {
    try {
      const { data, error } = await supabase.from('practice_content')
        .select('id,skill,cefr_level,title,payload')
        .eq('is_published', true).order('sort_order').order('id').abortSignal(signal);
      if (!error) {
        const exercises = (data as SkillRow[]).map(mapSkillExercise).filter(item => item !== null);
        return { exercises, source: 'cloud' as const };
      }
    } catch {
      // The four skill catalogs have a bundled copy.
    }
  }
  return { exercises: localExercises, source: 'local' as const };
}

export async function loadGrammarTopics(signal: AbortSignal): Promise<string[]> {
  if (!supabaseConfigured) throw new Error('Kho Ngữ pháp cần kết nối với Supabase.');
  const { data, error } = await supabase.from('practice_grammar_topics').select('grammar_topic')
    .order('grammar_topic').abortSignal(signal);
  if (error?.code === 'PGRST205') return Object.keys(grammarTopicNames);
  if (error) throw new Error('Chưa tải được các nhóm Ngữ pháp.');
  return data.map(row => row.grammar_topic);
}

export async function loadGrammarPage(page: number, topic: string, signal: AbortSignal) {
  if (!supabaseConfigured) throw new Error('Kho Ngữ pháp cần kết nối với Supabase.');
  const offset = (page - 1) * grammarPageSize;
  const { data, error, count, status } = await supabase.from('grammar_exercises').select('id', { count: 'exact' })
    .eq('is_published', true).eq('grammar_topic', topic)
    .order('sort_order').order('id').range(offset, offset + grammarPageSize - 1).abortSignal(signal);
  if (status === 416) return { rows: [], total: count ?? 0 };
  if (error) throw new Error('Chưa tải được danh sách câu hỏi.');
  return { rows: data as { id: string }[], total: count ?? data.length };
}

export async function loadGrammarExercise(id: string, signal: AbortSignal): Promise<GrammarExercise | null> {
  if (!supabaseConfigured) throw new Error('Kho Ngữ pháp cần kết nối với Supabase.');
  const { data, error } = await supabase.from('grammar_exercises')
    .select('id,grammar_topic,gapped_text,solution,distractors,filled_text,source_url,source_license')
    .eq('id', id).eq('is_published', true).abortSignal(signal).maybeSingle();
  if (error) throw new Error('Chưa tải được bài tập Ngữ pháp.');
  return data;
}
