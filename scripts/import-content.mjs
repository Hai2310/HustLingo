import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import ts from 'typescript';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vocabularyPath = resolve(projectRoot, 'src/data/vocabulary-en.json');
const grammarPath = resolve(projectRoot, 'src/features/lessons/data/grammar.ts');
const backendEnvPath = resolve(projectRoot, '.env.backend.local');
const appEnvPath = resolve(projectRoot, '.env');
const batchSize = 500;
const levelOrder = new Map(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, index) => [level, index]));

const topicTitles = {
  daily: 'Daily Life',
  communication: 'Communication',
  family: 'Family & Relationships',
  food: 'Food & Dining',
  travel: 'Travel & Transport',
  education: 'Education',
  business: 'Business & Finance',
  workplace: 'Workplace',
  health: 'Health & Body',
  shopping: 'Shopping & Services',
  technology: 'Technology',
  environment: 'Environment & Nature',
  society: 'Society & Government',
  culture: 'Culture & Media',
  academic: 'Academic English',
};

function loadBackendEnv() {
  const allowedKeys = new Set(['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE_KEY']);
  for (const envPath of [backendEnvPath, appEnvPath]) {
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const separator = trimmed.indexOf('=');
      if (separator < 1) continue;
      const key = trimmed.slice(0, separator).trim();
      if (!allowedKeys.has(key) || process.env[key]) continue;

      let value = trimmed.slice(separator + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  }
}

function loadGrammarPoints() {
  const source = readFileSync(grammarPath, 'utf8');
  const result = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const errors = (result.diagnostics || []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );
  if (errors.length) {
    throw new Error(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'));
  }

  const grammarModule = { exports: {} };
  new Function('exports', 'module', result.outputText)(grammarModule.exports, grammarModule);
  const points = grammarModule.exports.grammarPoints;
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error('Không đọc được grammarPoints từ src/features/lessons/data/grammar.ts.');
  }
  return points;
}

function toVocabularyRow(entry) {
  const isPublished = entry.quality === 'production' && entry.isActive !== false;
  return {
    id: entry.id,
    language_code: entry.languageCode,
    term: entry.term,
    translation: entry.translation,
    part_of_speech: entry.partOfSpeech ?? null,
    pronunciation: entry.pronunciation ?? null,
    ipa: entry.ipa ?? null,
    example_sentence: entry.exampleSentence ?? null,
    example_translation: entry.exampleTranslation ?? null,
    topic_id: entry.topicId ?? null,
    difficulty: entry.difficulty ?? null,
    exam_tags: entry.examTags ?? [],
    frequency_rank: entry.frequencyRank ?? null,
    cefr_level: entry.cefrLevel ?? null,
    cefr_source: entry.cefrSource ?? null,
    cefr_confidence: entry.cefrConfidence ?? null,
    toeic_relevance: entry.toeicRelevance ?? null,
    ielts_relevance: entry.ieltsRelevance ?? null,
    academic_relevance: entry.academicRelevance ?? null,
    business_relevance: entry.businessRelevance ?? null,
    quality: entry.quality,
    is_active: entry.isActive !== false,
    is_published: isPublished,
    source_segment: entry.sourceSegment ?? null,
    translation_source: entry.translationSource ?? null,
    pronunciation_source: entry.pronunciationSource ?? null,
    example_quality: entry.exampleQuality ?? null,
    review_flags: entry.reviewFlags ?? [],
  };
}

function toGrammarRows(points) {
  const grammarPoints = [];
  const grammarExamples = [];
  const grammarLessons = [];
  const grammarItems = [];

  points.forEach((point, index) => {
    if (point.examples.length !== point.exampleTranslations.length) {
      throw new Error(`Số ví dụ và bản dịch không khớp ở grammar point ${point.id}.`);
    }

    grammarPoints.push({
      id: point.id,
      cefr_level: point.level,
      category: point.category,
      title: point.title,
      title_vi: point.titleVi,
      pattern: point.pattern,
      explanation: point.explanation,
      common_mistake: point.commonMistake,
      sort_order: index + 1,
      is_published: true,
    });

    point.examples.forEach((sentence, exampleIndex) => {
      grammarExamples.push({
        grammar_point_id: point.id,
        position: exampleIndex + 1,
        sentence,
        translation: point.exampleTranslations[exampleIndex],
      });
    });

    grammarLessons.push({
      id: point.id,
      topic_id: null,
      cefr_level: point.level,
      lesson_type: 'grammar',
      title: point.title,
      description: point.explanation,
      sort_order: index + 1,
      is_published: true,
    });
    grammarItems.push({
      lesson_id: point.id,
      position: 1,
      vocabulary_id: null,
      grammar_point_id: point.id,
    });
  });

  return { grammarPoints, grammarExamples, grammarLessons, grammarItems };
}

function buildTopics(vocabulary) {
  const topicIds = new Set(vocabulary.map((entry) => entry.topicId).filter(Boolean));
  return [...topicIds].map((id) => ({
    id,
    title: topicTitles[id] || vocabulary.find((entry) => entry.topicId === id)?.topic || id,
    is_published: vocabulary.some(
      (entry) => entry.topicId === id && entry.quality === 'production' && entry.isActive !== false
    ),
  }));
}

function buildVocabularyLessons(vocabulary) {
  const groups = new Map();
  for (const entry of vocabulary) {
    if (entry.quality !== 'production' || entry.isActive === false) continue;
    const level = entry.cefrLevel || entry.difficulty;
    if (!entry.topicId || !levelOrder.has(level)) continue;

    const key = `${level}:${entry.topicId}`;
    if (!groups.has(key)) groups.set(key, { level, topicId: entry.topicId, entries: [] });
    groups.get(key).entries.push(entry);
  }

  const lessons = [];
  const items = [];
  const orderedGroups = [...groups.values()].sort((left, right) =>
    (levelOrder.get(left.level) - levelOrder.get(right.level)) || left.topicId.localeCompare(right.topicId)
  );

  orderedGroups.forEach((group, groupIndex) => {
    const id = `vocab-${group.level.toLowerCase()}-${group.topicId}`;
    const title = topicTitles[group.topicId] || group.topicId;
    lessons.push({
      id,
      topic_id: group.topicId,
      cefr_level: group.level,
      lesson_type: 'vocabulary',
      title: `${title} · ${group.level}`,
      description: `${group.entries.length} từ vựng đã duyệt trong chủ đề ${title}.`,
      sort_order: groupIndex + 1,
      is_published: true,
    });

    group.entries.forEach((entry, index) => {
      items.push({
        lesson_id: id,
        position: index + 1,
        vocabulary_id: entry.id,
        grammar_point_id: null,
      });
    });
  });

  return { lessons, items };
}

async function upsertInBatches(client, table, rows, onConflict) {
  for (let offset = 0; offset < rows.length; offset += batchSize) {
    const batch = rows.slice(offset, offset + batchSize);
    const { error } = await client.from(table).upsert(batch, { onConflict });
    if (error) {
      throw new Error(`Không thể nhập ${table} (bản ghi ${offset + 1}-${offset + batch.length}): ${error.message}`);
    }
  }
}

async function main() {
  loadBackendEnv();
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !secretKey) {
    throw new Error('Cần đặt SUPABASE_URL và SUPABASE_SECRET_KEY trong .env.backend.local hoặc môi trường chạy lệnh.');
  }

  const vocabulary = JSON.parse(readFileSync(vocabularyPath, 'utf8'));
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    throw new Error('Không đọc được dữ liệu từ src/data/vocabulary-en.json.');
  }
  const grammar = toGrammarRows(loadGrammarPoints());
  const topics = buildTopics(vocabulary);
  const vocabularyRows = vocabulary.map(toVocabularyRow);
  const vocabularyLessons = buildVocabularyLessons(vocabulary);
  const lessons = [...grammar.grammarLessons, ...vocabularyLessons.lessons];
  const lessonItems = [...grammar.grammarItems, ...vocabularyLessons.items];

  const client = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await upsertInBatches(client, 'topics', topics, 'id');
  await upsertInBatches(client, 'vocabulary_entries', vocabularyRows, 'id');
  await upsertInBatches(client, 'grammar_points', grammar.grammarPoints, 'id');
  await upsertInBatches(client, 'grammar_examples', grammar.grammarExamples, 'grammar_point_id,position');
  await upsertInBatches(client, 'lessons', lessons, 'id');
  await upsertInBatches(client, 'lesson_items', lessonItems, 'lesson_id,position');

  const publishedVocabularyCount = vocabularyRows.filter((row) => row.is_published).length;
  console.log(
    `Đã nhập ${topics.length} chủ đề, ${vocabularyRows.length} từ vựng ` +
      `(${publishedVocabularyCount} công khai), ${grammar.grammarPoints.length} điểm grammar, ` +
      `${grammar.grammarExamples.length} ví dụ và ${lessons.length} lesson.`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
