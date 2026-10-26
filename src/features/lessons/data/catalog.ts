import { PRODUCTION_VOCABULARY } from '@/data/vocabulary-en';
import { VOCABULARY_TOPICS } from '@/data/vocabulary-topics';
import { grammarPoints } from './grammar';
import type { LearningState } from '@/types';
import type { CatalogLesson, LessonCatalog, LessonLevel, LessonTopic } from '../types';

export const LESSON_LEVELS: LessonLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const isLessonLevel = (value?: string): value is LessonLevel => LESSON_LEVELS.includes(value as LessonLevel);
const presentations: Record<string, Partial<LessonTopic>> = {
  education: { title: 'University', description: 'Campus life, studying and new ideas.', icon: 'school-outline' },
  family: { title: 'Family', description: 'People, relationships and everyday moments.', icon: 'people-outline' },
  travel: { title: 'Travel', description: 'Make yourself understood wherever you go.', icon: 'airplane-outline' },
  technology: { title: 'Technology', description: 'The language of our connected world.', icon: 'laptop-outline' },
  workplace: { title: 'Career', description: 'Work, meetings and your next opportunity.', icon: 'briefcase-outline' },
  grammar: { title: 'Grammar essentials', description: 'Clear rules for more confident English.', icon: 'book-outline' },
  daily: { title: 'Daily life', description: 'Useful language for your everyday routine.', icon: 'sunny-outline' },
  food: { title: 'Food & dining', icon: 'restaurant-outline' }, environment: { icon: 'leaf-outline' },
  health: { icon: 'heart-outline' }, communication: { icon: 'chatbubble-outline' }, shopping: { icon: 'cart-outline' },
};
const palettes = [['#3478F6', '#EAF2FF'], ['#B35B6D', '#FFF0F3'], ['#AD7528', '#FFF0DD'], ['#348A74', '#E6F8F0'], ['#7163BC', '#EFEEFF']];
export const normaliseLessonTopic = (input: string) => {
  const value = input.trim().toLowerCase();
  const aliases: Record<string, string> = { university: 'education', career: 'workplace', 'daily-life': 'daily', 'daily life': 'daily', 'food & drink': 'food', 'work & career': 'workplace' };
  return aliases[value] || VOCABULARY_TOPICS.find(topic => topic.id === value || topic.label.toLowerCase() === value)?.id || value;
};

export function makeTopic(id: string, title?: string, description?: string): LessonTopic {
  const canonical = normaliseLessonTopic(id), index = Math.max(0, VOCABULARY_TOPICS.findIndex(topic => topic.id === canonical));
  const [color, background] = palettes[index % palettes.length];
  const original = VOCABULARY_TOPICS.find(topic => topic.id === canonical);
  return { id: canonical, title: title || original?.label || canonical, description: description || original?.description || 'Explore vocabulary and useful English.', icon: 'globe-outline', color, background, ...presentations[canonical] };
}

let localCatalog: LessonCatalog | null = null;
export function getLocalCatalog(): LessonCatalog {
  if (localCatalog) return localCatalog;
  const groups = new Map<string, CatalogLesson>();
  for (const word of PRODUCTION_VOCABULARY) {
    const level = word.cefrLevel || word.difficulty;
    if (!isLessonLevel(level) || !word.topicId) continue;
    const id = `vocab-${level.toLowerCase()}-${word.topicId}`;
    if (!groups.has(id)) groups.set(id, { id, title: `${makeTopic(word.topicId).title} vocabulary`, level, topicId: word.topicId, kind: 'vocabulary', vocabularyIds: [], grammarIds: [], order: 0 });
    groups.get(id)!.vocabularyIds.push(word.id);
  }
  const vocabulary = [...groups.values()].sort((a, b) => LESSON_LEVELS.indexOf(a.level) - LESSON_LEVELS.indexOf(b.level) || a.topicId.localeCompare(b.topicId));
  vocabulary.forEach((lesson, index) => { lesson.order = index; });
  const grammar: CatalogLesson[] = grammarPoints.map((point, index) => ({ id: point.id, title: point.title, level: point.level, topicId: 'grammar', kind: 'grammar', vocabularyIds: [], grammarIds: [point.id], order: index }));
  localCatalog = { lessons: [...grammar, ...vocabulary], topics: [...VOCABULARY_TOPICS.map(topic => makeTopic(topic.id)), makeTopic('grammar')], source: 'local' };
  return localCatalog;
}

export function lessonSteps(lesson: CatalogLesson): string[] {
  return [...lesson.vocabularyIds.map(id => `word:${id}`), ...lesson.grammarIds.flatMap(id => ['rule', 'examples', 'mistakes'].map(part => `grammar:${id}:${part}`))];
}

export function lessonStats(lesson: CatalogLesson, state: LearningState) {
  const required = lessonSteps(lesson), stored = new Set(state.lessonProgress?.[lesson.id]?.completedSteps || []);
  const complete = required.length > 0 && (state.completedLessonIds.includes(lesson.id) || required.every(id => stored.has(id)));
  const done = complete ? required.length : required.filter(id => stored.has(id)).length;
  return { done, total: required.length, percent: required.length ? Math.round(done / required.length * 100) : 0, complete };
}

export function topicStats(lessons: CatalogLesson[], state: LearningState) {
  const stats = lessons.map(lesson => lessonStats(lesson, state));
  const total = stats.reduce((sum, item) => sum + item.total, 0), done = stats.reduce((sum, item) => sum + item.done, 0);
  return { count: lessons.length, complete: stats.filter(item => item.complete).length, percent: total ? Math.round(done / total * 100) : 0 };
}
