import { supabase, supabaseConfigured } from './supabase';
import { PRODUCTION_VOCABULARY, type LocalVocabularyRecord } from '@/data/vocabulary-en';
import { grammarPoints, type GrammarPoint } from '@/features/lessons/data/grammar';
import { getLocalCatalog, isLessonLevel, makeTopic, normaliseLessonTopic } from '@/features/lessons/data/catalog';
import type { CatalogLesson, LessonCatalog, LessonContent } from '@/features/lessons/types';

interface CatalogRow {
  id: string; topic_id: string | null; cefr_level: string; lesson_type: 'vocabulary' | 'grammar'; title: string; sort_order: number;
  lesson_items: { position: number; vocabulary_id: string | null; grammar_point_id: string | null }[];
}
interface WordRow {
  id: string; term: string; translation: string; language_code: string; part_of_speech: string | null; ipa: string | null;
  pronunciation: string | null; example_sentence: string | null; example_translation: string | null;
  cefr_level: LocalVocabularyRecord['cefrLevel']; topic_id: LocalVocabularyRecord['topicId']; example_quality: LocalVocabularyRecord['exampleQuality'];
}
interface GrammarRow {
  id: string; cefr_level: GrammarPoint['level']; category: string; title: string; title_vi: string; pattern: string;
  explanation: string; common_mistake: GrammarPoint['commonMistake'];
  grammar_examples: { position: number; sentence: string; translation: string }[];
}

let cachedCatalog: LessonCatalog | null = null;
let catalogRequest: Promise<LessonCatalog> | null = null;
const contentCache = new Map<string, LessonContent>();
const localWords = new Map(PRODUCTION_VOCABULARY.map(word => [word.id, word]));
const localGrammar = new Map(grammarPoints.map(point => [point.id, point]));
export const peekLessonCatalog = () => cachedCatalog;

function deadline() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  return { signal: controller.signal, dispose: () => clearTimeout(timer) };
}

async function fetchCatalog(): Promise<LessonCatalog> {
  if (!supabaseConfigured) return { ...getLocalCatalog(), notice: 'Offline library. Your progress is saved on this device.' };
  const timeout = deadline();
  try {
    const [topicResult, lessonResult] = await Promise.all([
      supabase.from('topics').select('id,title,description').eq('is_published', true).order('id').abortSignal(timeout.signal),
      supabase.from('lessons').select('id,topic_id,cefr_level,lesson_type,title,sort_order,lesson_items(position,vocabulary_id,grammar_point_id)').eq('is_published', true).order('sort_order').range(0, 999).abortSignal(timeout.signal),
    ]);
    if (topicResult.error || lessonResult.error) throw new Error('Catalog could not be loaded.');
    const lessons: CatalogLesson[] = [];
    for (const row of (lessonResult.data || []) as unknown as CatalogRow[]) {
      if (!isLessonLevel(row.cefr_level)) continue;
      const items = [...(row.lesson_items || [])].sort((a, b) => a.position - b.position);
      lessons.push({ id: row.id, title: row.title, level: row.cefr_level, topicId: row.lesson_type === 'grammar' && !row.topic_id ? 'grammar' : normaliseLessonTopic(row.topic_id || 'daily'), kind: row.lesson_type, vocabularyIds: items.flatMap(item => item.vocabulary_id ? [item.vocabulary_id] : []), grammarIds: items.flatMap(item => item.grammar_point_id ? [item.grammar_point_id] : []), order: row.sort_order });
    }
    if (!lessons.length) return { ...getLocalCatalog(), notice: 'The online library is empty. Showing the offline library instead.' };
    const topics = new Map<string, ReturnType<typeof makeTopic>>();
    for (const row of (topicResult.data || []) as { id: string; title: string; description?: string }[]) {
      const topic = makeTopic(row.id, row.title, row.description);
      topics.set(topic.id, topic);
    }
    for (const lesson of lessons) if (!topics.has(lesson.topicId)) topics.set(lesson.topicId, makeTopic(lesson.topicId));
    return { lessons, topics: [...topics.values()], source: 'cloud' };
  } catch {
    return { ...getLocalCatalog(), notice: 'Could not reach the online library. You can keep learning offline, or retry.' };
  } finally { timeout.dispose(); }
}

export async function loadLessonCatalog(force = false): Promise<LessonCatalog> {
  if (force) { cachedCatalog = null; catalogRequest = null; contentCache.clear(); }
  if (cachedCatalog) return cachedCatalog;
  if (!catalogRequest) catalogRequest = fetchCatalog().then(catalog => { cachedCatalog = catalog; return catalog; }).finally(() => { catalogRequest = null; });
  return catalogRequest;
}

function localContent(lesson: CatalogLesson): LessonContent {
  const vocabulary = lesson.vocabularyIds.flatMap(id => localWords.has(id) ? [localWords.get(id)!] : []);
  const grammar = lesson.grammarIds.flatMap(id => localGrammar.has(id) ? [localGrammar.get(id)!] : []);
  if (vocabulary.length !== lesson.vocabularyIds.length || grammar.length !== lesson.grammarIds.length) throw new Error('This lesson is not available offline. Connect to the internet and retry.');
  return { vocabulary, grammar, source: 'local' };
}

export async function loadLessonContent(lesson: CatalogLesson, source: LessonCatalog['source'], force = false): Promise<LessonContent> {
  const key = `${source}:${lesson.id}`;
  if (!force && contentCache.has(key)) return contentCache.get(key)!;
  if (source === 'local') { const result = localContent(lesson); contentCache.set(key, result); return result; }
  const timeout = deadline();
  try {
    const wordRows: WordRow[] = [];
    for (let offset = 0; offset < lesson.vocabularyIds.length; offset += 100) {
      const { data, error } = await supabase.from('vocabulary_entries')
        .select('id,term,translation,language_code,part_of_speech,ipa,pronunciation,example_sentence,example_translation,cefr_level,topic_id,example_quality')
        .eq('is_published', true).eq('quality', 'production').eq('is_active', true)
        .in('id', lesson.vocabularyIds.slice(offset, offset + 100)).abortSignal(timeout.signal);
      if (error) throw new Error('Vocabulary could not be loaded.');
      wordRows.push(...(data || []) as WordRow[]);
    }
    const words = new Map(wordRows.map(row => [row.id, {
      id: row.id, languageCode: row.language_code, term: row.term, translation: row.translation, partOfSpeech: row.part_of_speech || undefined,
      ipa: row.ipa, pronunciation: row.pronunciation, exampleSentence: row.example_sentence || undefined, exampleTranslation: row.example_translation || undefined,
      cefrLevel: row.cefr_level, topicId: row.topic_id, exampleQuality: row.example_quality,
    } satisfies LocalVocabularyRecord]));
    let grammar: GrammarPoint[] = [];
    if (lesson.grammarIds.length) {
      const { data, error } = await supabase.from('grammar_points')
        .select('id,cefr_level,category,title,title_vi,pattern,explanation,common_mistake,grammar_examples(position,sentence,translation)')
        .eq('is_published', true).in('id', lesson.grammarIds).abortSignal(timeout.signal);
      if (error) throw new Error('Grammar could not be loaded.');
      const points = new Map(((data || []) as unknown as GrammarRow[]).map(row => {
        const examples = [...(row.grammar_examples || [])].sort((a, b) => a.position - b.position);
        return [row.id, { id: row.id, level: row.cefr_level, category: row.category, title: row.title, titleVi: row.title_vi, pattern: row.pattern, explanation: row.explanation, commonMistake: row.common_mistake, examples: examples.map(item => item.sentence), exampleTranslations: examples.map(item => item.translation) } satisfies GrammarPoint];
      }));
      grammar = lesson.grammarIds.flatMap(id => points.has(id) ? [points.get(id)!] : []);
    }
    const vocabulary = lesson.vocabularyIds.flatMap(id => words.has(id) ? [words.get(id)!] : []);
    if (vocabulary.length !== lesson.vocabularyIds.length || grammar.length !== lesson.grammarIds.length) throw new Error('Some lesson content is missing.');
    const result: LessonContent = { vocabulary, grammar, source: 'cloud' };
    contentCache.set(key, result); return result;
  } catch {
    const fallback = localContent(lesson);
    return { ...fallback, notice: 'Showing the offline copy of this lesson. Your progress will still be saved.' };
  } finally { timeout.dispose(); }
}
