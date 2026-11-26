import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Run the Practice engine (pure TypeScript) without Metro, React or storage.
const root = process.cwd(), nativeRequire = createRequire(import.meta.url), cache = new Map();
function load(specifier, parent = path.join(root, 'entry.js')) {
  let file = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(parent), specifier);
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

const srs = load('@/features/practice/engine/srs');
const quiz = load('@/features/practice/engine/quiz');
const exam = load('@/features/practice/engine/exam');
const analytics = load('@/features/practice/engine/analytics');
const banks = load('@/features/practice/data/skillBanks');
const { EXAM_BANK, EXAM_SECTIONS } = load('@/features/practice/data/examBank');
const { PRODUCTION_VOCABULARY } = load('@/data/vocabulary-en');

const t0 = new Date('2026-11-26T08:00:00.000Z');
const DAY = 86_400_000;
const later = (ms) => new Date(t0.getTime() + ms);

test('SRS: forgotten words return in 10 minutes, remembered words space out 1 → 3 → ~8 days', () => {
  let record = srs.reviewWord(undefined, 'w1', 'good', t0);
  assert.equal(record.intervalDays, 1);
  assert.equal(record.nextReviewAt, later(DAY).toISOString());
  assert.equal(record.correctCount, 1);
  record = srs.reviewWord(record, 'w1', 'good', later(DAY));
  assert.equal(record.intervalDays, 3);
  record = srs.reviewWord(record, 'w1', 'good', later(4 * DAY));
  assert.equal(record.intervalDays, 8, '3 days × ease 2.5 rounds to 8');
  const forgotten = srs.reviewWord(record, 'w1', 'again', later(12 * DAY));
  assert.equal(forgotten.intervalDays, 0);
  assert.equal(forgotten.repetitions, 0);
  assert.equal(forgotten.wrongCount, 1);
  assert.equal(forgotten.correctCount, 3, 'correct history is kept');
  assert.equal(new Date(forgotten.nextReviewAt).getTime() - later(12 * DAY).getTime(), 10 * 60_000);
  assert.ok(forgotten.ease < record.ease);
});

test('SRS: ease stays within bounds and "easy" grows faster than "hard"', () => {
  let low = srs.newSrsRecord('w', t0);
  for (let i = 0; i < 20; i++) low = srs.reviewWord(low, 'w', 'again', t0);
  assert.equal(low.ease, srs.SRS_RULES.minEase);
  let high = srs.newSrsRecord('w', t0);
  for (let i = 0; i < 20; i++) high = srs.reviewWord(high, 'w', 'easy', t0);
  assert.equal(high.ease, srs.SRS_RULES.maxEase);
  assert.equal(high.intervalDays, srs.SRS_RULES.maxIntervalDays, 'interval is capped');
  const base = srs.reviewWord(srs.reviewWord(undefined, 'w', 'good', t0), 'w', 'good', t0);
  assert.ok(srs.reviewWord(base, 'w', 'easy', t0).intervalDays > srs.reviewWord(base, 'w', 'hard', t0).intervalDays);
});

test('SRS: review queue puts overdue words first, then new candidates, without duplicates', () => {
  let data = analytics.emptyPracticeData();
  data = analytics.applyReview(data, 'old', 'good', later(-5 * DAY)); // due 4 days ago
  data = analytics.applyReview(data, 'recent', 'again', later(-1 * DAY)); // due ~1 day ago
  data = analytics.applyReview(data, 'future', 'easy', t0); // due in 3 days
  const queue = srs.buildReviewQueue(data, ['future', 'n1', 'n2', 'n1', 'n3'], t0, { newLimit: 2 });
  assert.deepEqual(queue, ['old', 'recent', 'n1', 'n2']);
  assert.equal(srs.wordStatus(data.srs.future, t0), 'learning');
  assert.equal(srs.wordStatus(data.srs.old, t0), 'review');
  assert.equal(srs.wordStatus(undefined, t0), 'new');
  assert.equal(srs.wordStatus({ ...data.srs.future, intervalDays: 30 }, t0), 'mastered');
  assert.deepEqual(srs.statusCounts(data, t0), { new: 0, learning: 1, review: 2, mastered: 0 });
  assert.equal(srs.describeInterval(data.srs.future, t0), '3 ngày');
});

test('Vocabulary quiz: every question has 4 unique options, one correct answer, and carries its word id', () => {
  const words = PRODUCTION_VOCABULARY.filter(word => word.cefrLevel === 'A2');
  const questions = quiz.buildVocabularyQuiz(words, PRODUCTION_VOCABULARY, { count: 30, mode: 'mixed', seed: 7 });
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map(q => q.wordId)).size, 30, 'no word is asked twice');
  for (const question of questions) {
    const word = PRODUCTION_VOCABULARY.find(item => item.id === question.wordId);
    assert.ok(word);
    if (question.type === 'choice') {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options.map(o => o.toLowerCase())).size, 4);
      assert.equal(question.answers.length, 1);
      assert.equal(question.options[question.answers[0]], question.kind === 'meaning' ? word.translation : word.term);
    } else {
      assert.ok(question.prompt.includes('_____') || question.prompt.includes(word.translation), 'blank in a real sentence, or ask from the meaning');
      assert.ok(!new RegExp(`\\b${word.term}\\b`, 'i').test(question.prompt), 'the answer is hidden');
      assert.ok(!quiz.isTemplateExample(question.prompt), 'template examples give no context and are never used');
      assert.ok(quiz.isTypingCorrect(question.accepted, ` ${word.term.toUpperCase()} `));
    }
  }
  assert.ok(questions.some(q => q.kind === 'meaning') && questions.some(q => q.kind === 'translation') && questions.some(q => q.kind === 'fill-blank'));
});

test('Quiz helpers: shuffle is deterministic per seed and option shuffling keeps the right answer', () => {
  const a = quiz.shuffle([1, 2, 3, 4, 5, 6], quiz.createRandom(42)), b = quiz.shuffle([1, 2, 3, 4, 5, 6], quiz.createRandom(42));
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort(), [1, 2, 3, 4, 5, 6]);
  const question = { id: 'q', kind: 'detail', prompt: '?', options: ['w', 'x', 'y', 'z'], answers: [1, 3] };
  for (let seed = 1; seed < 20; seed++) {
    const shuffled = quiz.shuffleOptions(question, quiz.createRandom(seed));
    assert.deepEqual(shuffled.answers.map(i => shuffled.options[i]).sort(), ['x', 'z']);
  }
  assert.equal(quiz.isChoiceCorrect([0, 2], [2, 0]), true);
  assert.equal(quiz.isChoiceCorrect([0, 2], [0]), false, 'multi-answer needs every answer');
  assert.equal(quiz.isChoiceCorrect([0, 2], [0, 1]), false);
  assert.equal(quiz.isChoiceCorrect([1], []), false);
  assert.equal(quiz.isTypingCorrect(['don’t'], "don't."), true);
  assert.equal(quiz.isTypingCorrect(['cat'], '   '), false);
});

test('Content banks: ids are unique and every answer index points at a real option', () => {
  const questions = [
    ...banks.LISTENING_ITEMS.flatMap(item => item.questions),
    ...banks.READING_ITEMS.flatMap(item => item.questions),
    ...EXAM_BANK.flatMap(group => group.items.filter(item => item.type === 'choice')),
  ];
  const ids = [...banks.LISTENING_ITEMS.flatMap(i => [i.id, ...i.questions.map(q => q.id)]), ...banks.READING_ITEMS.flatMap(i => [i.id, ...i.questions.map(q => q.id)]), ...EXAM_BANK.flatMap(group => [group.id, ...group.items.map(i => i.id)]), ...banks.WRITING_ITEMS.map(i => i.id), ...banks.SPEAKING_ITEMS.map(i => i.id)];
  assert.equal(new Set(ids).size, ids.length, 'duplicate id in a bank');
  for (const question of questions) {
    assert.ok(question.answers.length >= 1, question.id);
    assert.equal(new Set(question.answers).size, question.answers.length, question.id);
    for (const answer of question.answers) assert.ok(answer >= 0 && answer < question.options.length, question.id);
    assert.ok(question.explanation, `${question.id} needs an explanation`);
  }
  assert.ok(banks.READING_ITEMS.some(item => item.questions.some(q => q.answers.length > 1)), 'reading has multi-answer questions');
  for (const item of banks.WRITING_ITEMS) assert.ok(analytics.countWords(item.sampleAnswer) >= item.minWords, `${item.id} sample meets its own word count`);
  for (const examId of ['toeic', 'ielts']) for (const section of EXAM_SECTIONS[examId]) assert.ok(EXAM_BANK.some(group => group.exam === examId && group.section === section.id), `${examId} ${section.id} has questions`);
});

test('Exam engine: sizes the test, keeps passages whole, orders sections and sets the timer', () => {
  const [practice, mini, full] = exam.EXAM_MODES;
  const session = exam.buildExamSession(EXAM_BANK, 'toeic', ['reading', 'listening'], mini, { seed: 3 });
  assert.ok(session.items.length >= 20 && session.items.length <= 24, `got ${session.items.length}`);
  assert.deepEqual(session.items.map(entry => entry.number), session.items.map((_, i) => i + 1));
  const firstReading = session.items.findIndex(entry => entry.group.section === 'reading');
  assert.ok(session.items.slice(0, firstReading).every(entry => entry.group.section === 'listening'), 'listening comes first');
  for (const group of session.groups) if (group.passage || group.audioText) assert.equal(group.items.length, EXAM_BANK.find(g => g.id === group.id).items.length, 'passage groups are not split');
  assert.equal(session.timeLimitSeconds, session.items.length * 60);
  assert.equal(exam.buildExamSession(EXAM_BANK, 'toeic', ['reading'], practice, { seed: 1 }).timeLimitSeconds, null);
  const all = exam.buildExamSession(EXAM_BANK, 'ielts', ['listening', 'reading', 'writing', 'speaking'], full, { seed: 1 });
  assert.equal(all.items.length, EXAM_BANK.filter(g => g.exam === 'ielts').reduce((sum, g) => sum + g.items.length, 0));
  assert.ok(all.timeLimitSeconds > all.items.length * 60, 'writing tasks get extra time');
});

test('Exam engine: scores by section, ignores self-rated tasks in accuracy and estimates scores', () => {
  const session = exam.buildExamSession(EXAM_BANK, 'ielts', ['reading', 'writing'], exam.EXAM_MODES[2], { seed: 5 });
  const choices = session.items.filter(entry => entry.item.type === 'choice');
  const responses = {};
  choices.forEach((entry, i) => { responses[entry.item.id] = { selected: i % 2 === 0 ? entry.item.answers : [] }; });
  const writing = session.items.find(entry => entry.item.type === 'writing');
  responses[writing.item.id] = { text: 'Some text', selfBand: 6 };
  const score = exam.scoreExam(session, responses);
  assert.equal(score.total, choices.length);
  assert.equal(score.correct, Math.ceil(choices.length / 2));
  assert.equal(score.answered, Math.ceil(choices.length / 2) + 1);
  assert.equal(score.bySection.length, 1);
  assert.equal(score.selfBand, 6);
  assert.ok(score.answers.every(answer => answer.section.startsWith('reading:')));
  assert.equal(score.answers.find(a => !a.correct).given, '(bỏ trống)');
  assert.match(exam.estimateScore('ielts', score).value, /^\d\.\d$/);
  const toeic = exam.estimateScore('toeic', { ...score, bySection: [{ section: 'listening', correct: 10, total: 10 }, { section: 'reading', correct: 0, total: 10 }] });
  assert.equal(toeic.value, '500');
  assert.equal(exam.estimateScore('toeic', { ...score, bySection: [{ section: 'listening', correct: 10, total: 10 }, { section: 'reading', correct: 10, total: 10 }] }).value, '990');
});

test('Timer: countdown never goes negative and the clock formats minutes and hours', () => {
  assert.equal(exam.remainingSeconds(0, 600, 61_500), 539);
  assert.equal(exam.remainingSeconds(0, 60, 999_999), 0);
  assert.equal(exam.formatClock(0), '0:00');
  assert.equal(exam.formatClock(75), '1:15');
  assert.equal(exam.formatClock(3725), '1:02:05');
  assert.equal(exam.formatClock(-5), '0:00');
  assert.equal(exam.itemState({ type: 'choice' }, { selected: [] }), 'empty');
  assert.equal(exam.itemState({ type: 'choice' }, { selected: [1] }), 'answered');
  assert.equal(exam.itemState({ type: 'writing' }, { text: '   ' }), 'empty');
});

test('Results & analytics: saving is idempotent, history is capped and weak areas produce advice', () => {
  let data = analytics.emptyPracticeData();
  const answers = (kind, correct, wrong) => [...Array(correct)].map((_, i) => ({ questionId: `${kind}${i}`, kind, correct: true })).concat([...Array(wrong)].map((_, i) => ({ questionId: `${kind}x${i}`, kind, correct: false })));
  const result = (id, mode, list, finishedAt) => ({ id, mode, title: id, correct: list.filter(a => a.correct).length, total: list.length, durationSeconds: 120, finishedAt, answers: list });
  data = analytics.addResult(data, result('r1', 'reading', [...answers('inference', 0, 3), ...answers('detail', 3, 0)], '2026-11-25T10:00:00Z'));
  data = analytics.addResult(data, result('r1', 'reading', [...answers('inference', 0, 3), ...answers('detail', 3, 0)], '2026-11-25T10:00:00Z'));
  data = analytics.addResult(data, result('r2', 'listening', answers('main-idea', 1, 1), '2026-11-26T10:00:00Z'));
  assert.equal(data.results.length, 2, 'same id is stored once');
  assert.equal(data.results[0].id, 'r2', 'newest first');
  const summary = analytics.summarisePractice(data, t0);
  assert.equal(summary.questions, 8);
  assert.equal(summary.accuracy, 50);
  assert.equal(summary.minutes, 4);
  assert.equal(summary.weakKinds[0].kind, 'inference');
  assert.deepEqual(analytics.suggestions(data.results.flatMap(r => r.answers)).map(s => s.kind), ['inference', 'main-idea']);
  for (let i = 0; i < 100; i++) data = analytics.addResult(data, result(`bulk${i}`, 'vocabulary', answers('meaning', 1, 0), '2026-11-26T11:00:00Z'));
  assert.equal(data.results.length, analytics.MAX_STORED_RESULTS);
});

test('Storage: corrupt or partial local data is repaired instead of crashing (guest and account)', () => {
  assert.deepEqual(analytics.parsePracticeData(null), analytics.emptyPracticeData());
  assert.deepEqual(analytics.parsePracticeData('{not json'), analytics.emptyPracticeData());
  const repaired = analytics.parsePracticeData(JSON.stringify({ srs: { ok: { wordId: 'ok', nextReviewAt: t0.toISOString() }, bad: { wordId: 'bad', nextReviewAt: 'nope' } }, results: [{ id: 'x' }, { id: 'y', correct: 1, total: 1, answers: [] }], drafts: { a: 'text', b: 5 } }));
  assert.deepEqual(Object.keys(repaired.srs), ['ok']);
  assert.deepEqual(repaired.results.map(r => r.id), ['y']);
  assert.deepEqual(repaired.drafts, { a: 'text' });
  let data = analytics.setDraft(analytics.emptyPracticeData(), 'w1', 'Hello world');
  assert.equal(data.drafts.w1, 'Hello world');
  data = analytics.setDraft(data, 'w1', '   ');
  assert.equal('w1' in data.drafts, false, 'empty draft is removed');
});

test('Writing helpers: word counter handles contractions, hyphens and Vietnamese text', () => {
  assert.equal(analytics.countWords(''), 0);
  assert.equal(analytics.countWords("I don't like well-known  places.\nReally!"), 6);
  assert.equal(analytics.countWords('Tôi học tiếng Anh'), 4);
  assert.deepEqual(analytics.usedPhrases('On the one hand, it is good. To sum up…', ['on the one hand', 'In my view', 'to sum up']), ['on the one hand', 'to sum up']);
});
