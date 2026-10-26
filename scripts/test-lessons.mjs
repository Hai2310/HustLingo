import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Run the actual domain modules without Metro or a database connection.
const root = process.cwd(), nativeRequire = createRequire(import.meta.url);
function loader(supabaseModule) {
  const cache = new Map();
  function load(specifier, parent = path.join(root, 'entry.js')) {
    let file = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(parent), specifier);
    if (/[/\\]services[/\\]supabase$/.test(file) && supabaseModule) return supabaseModule;
    if (!specifier.startsWith('.') && !specifier.startsWith('@/') && !path.isAbsolute(specifier)) return nativeRequire(specifier);
    file = [file, `${file}.ts`, `${file}.json`, path.join(file, 'index.ts')].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!file) throw new Error(`Cannot resolve ${specifier}`);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    if (file.endsWith('.json')) module.exports = JSON.parse(fs.readFileSync(file, 'utf8'));
    else {
      const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
      new Function('require', 'module', 'exports', outputText)(dependency => load(dependency, file), module, module.exports);
    }
    return module.exports;
  }
  return load;
}
const load = loader(), progress = load('@/utils/learningProgress'), catalog = load('@/features/lessons/data/catalog');
const day = '2026-10-26', empty = () => progress.emptyProgress(day);
function storage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return { values, async getItem(key) { return values.get(key) ?? null; }, async setItem(key, value) { values.set(key, value); }, async removeItem(key) { values.delete(key); } };
}

test('published local library has stable IDs, English A1–C1 content and the five requested topics', () => {
  const library = catalog.getLocalCatalog();
  assert.ok(library.lessons.length > 100);
  assert.equal(new Set(library.lessons.map(item => item.id)).size, library.lessons.length);
  for (const level of catalog.LESSON_LEVELS) for (const kind of ['grammar', 'vocabulary']) assert.ok(library.lessons.some(item => item.level === level && item.kind === kind));
  for (const topic of ['education', 'family', 'travel', 'technology', 'workplace']) assert.ok(library.lessons.some(item => item.topicId === topic));
  const bank = load('@/data/vocabulary-en').PRODUCTION_VOCABULARY;
  const included = library.lessons.flatMap(item => item.vocabularyIds);
  assert.equal(included.length, bank.filter(word => catalog.isLessonLevel(word.cefrLevel || word.difficulty)).length);
  assert.ok(bank.every(word => word.languageCode === 'en' && word.quality === 'production' && word.isActive !== false));
  assert.ok(library.lessons.every(item => catalog.isLessonLevel(item.level) && catalog.lessonSteps(item).length > 0));
  assert.equal(catalog.normaliseLessonTopic('University'), 'education');
  assert.equal(catalog.normaliseLessonTopic('Career'), 'workplace');
});

test('vocabulary progress is idempotent, separate by lesson, and completes only after all words', () => {
  const lesson = { id: 'words', vocabularyIds: ['one', 'two'], grammarIds: [] }, steps = catalog.lessonSteps(lesson);
  let state = progress.recordLessonStep(empty(), lesson.id, steps[0], steps, 'one');
  state = progress.recordLessonStep(state, lesson.id, steps[0], steps, 'one');
  assert.deepEqual(state.studiedWordIds, ['one']);
  assert.equal(catalog.lessonStats(lesson, state).percent, 50);
  assert.equal(catalog.lessonStats({ ...lesson, id: 'another' }, state).percent, 0);
  assert.equal(progress.recordLessonStep(state, lesson.id, 'invalid', steps), state);
  state = progress.recordLessonStep(state, lesson.id, steps[1], steps, 'two');
  assert.equal(catalog.lessonStats(lesson, state).complete, true);
  assert.deepEqual(state.completedLessonIds, ['words']);
});

test('grammar needs all three sections; topic progress uses actual study steps', () => {
  const lesson = { id: 'grammar', vocabularyIds: [], grammarIds: ['rule-one'] }, steps = catalog.lessonSteps(lesson);
  let state = empty();
  for (const [index, step] of steps.entries()) {
    state = progress.recordLessonStep(state, lesson.id, step, steps);
    assert.equal(catalog.lessonStats(lesson, state).percent, [33, 67, 100][index]);
    assert.equal(catalog.lessonStats(lesson, state).complete, index === 2);
  }
  const words = { id: 'words', vocabularyIds: ['one'], grammarIds: [] };
  assert.deepEqual(catalog.topicStats([lesson, words], state), { count: 2, complete: 1, percent: 75 });
  assert.equal(catalog.lessonStats({ id: 'empty', vocabularyIds: [], grammarIds: [] }, { ...state, completedLessonIds: ['empty'] }).complete, false);
});

test('old completed lessons remain completed without inventing studied word IDs', () => {
  const lesson = catalog.getLocalCatalog().lessons[0], state = { ...empty(), completedLessonIds: [lesson.id] };
  assert.equal(catalog.lessonStats(lesson, state).percent, 100);
  assert.deepEqual(state.studiedWordIds, []);
});

test('invalid local data is safe and daily minutes reset without losing lesson history', () => {
  const state = progress.normaliseProgress({ studiedWordIds: ['one', 'one', 42], totalAnswers: 2, correctAnswers: 99, minutesToday: 20, lastStudyDate: '2026-10-25', lessonProgress: { good: { completedSteps: ['x', 'x', null] }, bad: null } }, day);
  assert.deepEqual(state.studiedWordIds, ['one']);
  assert.equal(state.correctAnswers, 2); assert.equal(state.minutesToday, 0);
  assert.deepEqual(state.lessonProgress.good.completedSteps, ['x']);
  assert.deepEqual(progress.parseProgress('{broken', day), empty());
});

test('local and cloud progress merge without losing either device’s steps', () => {
  const steps = ['a', 'b', 'c'];
  const local = progress.recordLessonStep(empty(), 'lesson', 'a', steps, 'word-a', '2026-10-26T08:00:00Z');
  const remote = progress.recordLessonStep(empty(), 'lesson', 'b', steps, 'word-b', '2026-10-26T09:00:00Z');
  const merged = progress.mergeLearningProgress(local, remote, day);
  assert.deepEqual(new Set(merged.lessonProgress.lesson.completedSteps), new Set(['a', 'b']));
  assert.equal(merged.lessonProgress.lesson.lastStepId, 'b');
  assert.deepEqual(new Set(merged.studiedWordIds), new Set(['word-a', 'word-b']));
});

test('guest progress is claimed once and cannot leak into another account', async () => {
  const guest = { ...empty(), studiedWordIds: ['guest-word'] };
  const store = storage({ 'learning:guest-local': JSON.stringify(guest) });
  const first = await progress.importGuestProgress(store, 'learning', 'account-a', empty(), day);
  assert.deepEqual(first.studiedWordIds, ['guest-word']);
  assert.equal(await store.getItem('learning:guest-local'), null);
  // A stale guest snapshot surviving an interrupted cleanup is already claimed.
  await store.setItem('learning:guest-local', JSON.stringify(guest));
  const second = await progress.importGuestProgress(store, 'learning', 'account-b', empty(), day);
  assert.deepEqual(second.studiedWordIds, []);
});

test('interrupted guest transfer recovers for its original account only', async () => {
  const raw = JSON.stringify({ ...empty(), studiedWordIds: ['guest-word'] });
  const store = storage({ 'learning:guest-local': raw }), set = store.setItem;
  store.setItem = async (key, value) => { if (key === 'learning:account-a') throw new Error('Storage interrupted'); return set(key, value); };
  await assert.rejects(progress.importGuestProgress(store, 'learning', 'account-a', empty(), day));
  store.setItem = set;
  assert.deepEqual((await progress.importGuestProgress(store, 'learning', 'account-b', empty(), day)).studiedWordIds, []);
  assert.deepEqual((await progress.importGuestProgress(store, 'learning', 'account-a', empty(), day)).studiedWordIds, ['guest-word']);
});

function backend(rows = {}, userId = 'account-a') {
  const calls = [];
  const supabase = {
    auth: { async getUser() { return { data: { user: { id: userId } }, error: null }; } },
    from(table) {
      const call = { table, filters: [], ids: [], mutation: null }; calls.push(call);
      const query = {
        select() { return query; }, order() { return query; }, range() { return query; }, abortSignal() { return query; }, maybeSingle() { return query; },
        eq(key, value) { call.filters.push([key, value]); return query; },
        in(key, ids) { call.ids = ids; return query; },
        upsert(value) { call.mutation = value; return query; },
        then(resolve, reject) { const value = rows[table]; return (value instanceof Error ? Promise.reject(value) : Promise.resolve({ data: typeof value === 'function' ? value(call) : value ?? [], error: null })).then(resolve, reject); },
      };
      return query;
    },
  };
  return { supabase, supabaseConfigured: true, requireSupabaseConfig() {}, calls };
}

test('cloud catalog uses published content, orders items, and supplies a grammar topic', async () => {
  const mock = backend({ topics: [], lessons: [{ id: 'new-lesson', title: 'New grammar', cefr_level: 'B1', lesson_type: 'grammar', topic_id: null, sort_order: 0, lesson_items: [{ position: 2, grammar_point_id: 'second' }, { position: 1, grammar_point_id: 'first' }] }] });
  const service = loader(mock)('@/services/learningContent'), library = await service.loadLessonCatalog();
  assert.equal(library.source, 'cloud'); assert.equal(library.lessons[0].topicId, 'grammar');
  assert.deepEqual(library.lessons[0].grammarIds, ['first', 'second']);
  assert.ok(library.topics.some(topic => topic.id === 'grammar'));
  assert.ok(mock.calls.every(call => call.filters.some(([key, value]) => key === 'is_published' && value === true) && call.mutation === null));
});

test('network failures offer a labelled offline library and retry can recover', async () => {
  const rows = { topics: new Error('offline'), lessons: new Error('offline') }, mock = backend(rows);
  const service = loader(mock)('@/services/learningContent');
  assert.equal((await service.loadLessonCatalog()).source, 'local');
  assert.ok((await service.loadLessonCatalog()).notice);
  rows.topics = []; rows.lessons = [{ id: 'live', title: 'Live', cefr_level: 'A1', lesson_type: 'vocabulary', topic_id: 'family', sort_order: 0, lesson_items: [] }];
  assert.equal((await service.loadLessonCatalog(true)).source, 'cloud');
});

test('missing cloud content never silently becomes a shorter completed lesson', async () => {
  const service = loader(backend())('@/services/learningContent');
  await assert.rejects(service.loadLessonContent({ id: 'new', vocabularyIds: ['not-on-device'], grammarIds: [] }, 'cloud'));
  const old = catalog.getLocalCatalog().lessons.find(lesson => lesson.kind === 'vocabulary');
  const copy = await service.loadLessonContent(old, 'cloud');
  assert.equal(copy.source, 'local'); assert.ok(copy.notice);
  assert.equal(copy.vocabulary.length, old.vocabularyIds.length);
});

test('account-scoped sync rejects a changed session before reading or writing progress', async () => {
  const mock = backend(), service = loader(mock)('@/services/supabaseData').supabaseData;
  await assert.rejects(service.getProgress('account-b'), /active account changed/);
  await assert.rejects(service.putProgress(empty(), 'account-b'), /active account changed/);
  assert.equal(mock.calls.length, 0);
  const state = { ...empty(), lessonProgress: { lesson: { completedSteps: ['rule'] } } };
  await service.putProgress(state, 'account-a');
  assert.equal(mock.calls[0].mutation.user_id, 'account-a');
  assert.deepEqual(mock.calls[0].mutation.state, state);
});
