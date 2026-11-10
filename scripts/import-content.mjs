import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import ts from 'typescript';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vocabularyPath = resolve(projectRoot, 'src/data/vocabulary-en.json');
const grammarPath = resolve(projectRoot, 'src/features/lessons/data/grammar.ts');
const contentPath = resolve(projectRoot, 'src/data/content.ts');
const tutorsPath = resolve(projectRoot, 'src/features/tutor/data/tutors.ts');
const tutorMessagesPath = resolve(projectRoot, 'src/features/tutor/data/demoMessages.ts');
const backendEnvPath = resolve(projectRoot, '.env.backend.local');
const appEnvPath = resolve(projectRoot, '.env');
const batchSize = 500;
const grammarExerciseBatchSize = 100;
const maxUpsertAttempts = 4;
const retryBaseDelayMs = 1000;
const grammarDatasetRevision = '374f402068cf15bf0e71c44410ba72f3a8c9c301';
const grammarDatasetSha256 = '4b20c6e8c12c8be8d0e0bd03213d0e79aeb8b1d14f0180ba70dc073b9461462c';
const grammarDatasetUrl = `https://raw.githubusercontent.com/ZanichelliEditore/english-grammar-multiple-choice-generation/${grammarDatasetRevision}/dataset/train_exercise_dataset.json`;
const grammarDatasetSourceUrl = `https://github.com/ZanichelliEditore/english-grammar-multiple-choice-generation/blob/${grammarDatasetRevision}/dataset/train_exercise_dataset.json`;
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

function loadTypeScriptModule(sourcePath) {
  const source = readFileSync(sourcePath, 'utf8');
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

  const loadedModule = { exports: {} };
  new Function('exports', 'module', result.outputText)(loadedModule.exports, loadedModule);
  return loadedModule.exports;
}

function loadGrammarPoints() {
  const points = loadTypeScriptModule(grammarPath).grammarPoints;
  if (!Array.isArray(points) || points.length === 0) {
    throw new Error('Không đọc được grammarPoints từ src/features/lessons/data/grammar.ts.');
  }
  return points;
}

async function loadExternalGrammarExercises() {
  const response = await fetch(grammarDatasetUrl);
  if (!response.ok) {
    throw new Error(`Không tải được bộ grammar từ GitHub (HTTP ${response.status}).`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const checksum = createHash('sha256').update(bytes).digest('hex');
  if (checksum !== grammarDatasetSha256) {
    throw new Error(`Checksum bộ grammar không khớp ở revision ${grammarDatasetRevision}; đã dừng để tránh nhập dữ liệu khác nguồn.`);
  }

  const dataset = JSON.parse(bytes.toString('utf8'));
  const fields = ['gapped_text', 'solution', 'distractors', 'filled_text', 'grammar_topic'];
  const sourceIds = Object.keys(dataset.gapped_text || {}).sort((left, right) => Number(left) - Number(right));
  if (sourceIds.length < 1000 || fields.some((field) => !dataset[field] || Object.keys(dataset[field]).length !== sourceIds.length)) {
    throw new Error('Bộ grammar từ GitHub thiếu cột hoặc có số dòng không đồng nhất.');
  }

  const rows = sourceIds.map((sourceId, index) => {
    const distractors = dataset.distractors[sourceId];
    if (!Array.isArray(distractors) || distractors.length < 1 || distractors.length > 3) {
      throw new Error(`Danh sách lựa chọn không hợp lệ tại bản ghi nguồn ${sourceId}.`);
    }
    for (const field of ['gapped_text', 'solution', 'filled_text', 'grammar_topic']) {
      if (typeof dataset[field][sourceId] !== 'string' || !dataset[field][sourceId].trim()) {
        throw new Error(`Thiếu nội dung '${field}' tại bản ghi nguồn ${sourceId}.`);
      }
    }

    return {
      id: `zanichelli-mcc-${String(sourceId).padStart(5, '0')}`,
      source_dataset: 'zanichelli-english-grammar-mcc',
      source_record_id: Number(sourceId),
      grammar_topic: dataset.grammar_topic[sourceId],
      gapped_text: dataset.gapped_text[sourceId],
      solution: dataset.solution[sourceId],
      distractors,
      filled_text: dataset.filled_text[sourceId],
      source_url: grammarDatasetSourceUrl,
      source_license: 'CC BY-NC-ND 4.0 (non-commercial demo; unchanged source content)',
      sort_order: index + 1,
      is_published: true,
    };
  });
  return rows;
}

function loadLearningCatalogs() {
  const content = loadTypeScriptModule(contentPath);
  const tutorCatalog = loadTypeScriptModule(tutorsPath);
  const tutorExamples = loadTypeScriptModule(tutorMessagesPath);
  const requiredArrays = [
    ['learningTopics', content.learningTopics],
    ['listeningLessons', content.listeningLessons],
    ['readingLessons', content.readingLessons],
    ['writingPrompts', content.writingPrompts],
    ['speakingPhrases', content.speakingPhrases],
    ['tutorScenarios', content.tutorScenarios],
    ['tutors', tutorCatalog.tutors],
  ];
  for (const [name, value] of requiredArrays) {
    if (!Array.isArray(value)) throw new Error(`Không đọc được ${name} từ dữ liệu nguồn TypeScript.`);
  }
  return { ...content, ...tutorCatalog, ...tutorExamples };
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

function buildTopics(vocabulary, learningTopics = []) {
  const topicIds = [...new Set(vocabulary.map((entry) => entry.topicId).filter(Boolean))].sort();
  const topics = new Map(topicIds.map((id, index) => [id, {
    id,
    title: topicTitles[id] || vocabulary.find((entry) => entry.topicId === id)?.topic || id,
    description: null,
    subtitle: null,
    icon: null,
    cefr_level: null,
    accent_color: null,
    sort_order: 101 + index,
    is_published: vocabulary.some(
      (entry) => entry.topicId === id && entry.quality === 'production' && entry.isActive !== false
    ),
  }]));

  learningTopics.forEach((topic, index) => {
    const current = topics.get(topic.id) || {
      id: topic.id,
      title: topic.title,
      description: null,
      subtitle: null,
      icon: null,
      cefr_level: null,
      accent_color: null,
      sort_order: 0,
      is_published: true,
    };
    topics.set(topic.id, {
      ...current,
      title: topic.title,
      description: topic.subtitle || null,
      subtitle: topic.subtitle || null,
      icon: topic.icon || null,
      cefr_level: topic.level || null,
      accent_color: topic.accent || null,
      sort_order: index + 1,
      is_published: true,
    });
  });
  return [...topics.values()];
}

function buildPracticeRows(content) {
  const catalogs = [
    ['listening', content.listeningLessons],
    ['reading', content.readingLessons],
    ['writing', content.writingPrompts],
    ['speaking', content.speakingPhrases],
  ];
  return catalogs.flatMap(([skill, entries]) => entries.map((entry, index) => {
    const { id, level, title, ...payload } = entry;
    return {
      id,
      skill,
      cefr_level: level,
      title: title ?? null,
      payload,
      sort_order: index + 1,
      is_published: true,
    };
  }));
}

function buildTutorRows(content) {
  const tutors = content.tutors.map((tutor, index) => ({
    id: tutor.id,
    name: tutor.name,
    role: tutor.role,
    initials: tutor.initials,
    description: tutor.description,
    tone: tutor.tone ?? null,
    accent_color: tutor.accent ?? null,
    sort_order: index + 1,
    is_published: true,
  }));
  const tutorIdsByName = new Map(tutors.map((tutor) => [tutor.name.toLowerCase(), tutor.id]));
  const scenarios = content.tutorScenarios.map((scenario, index) => {
    const tutorId = tutorIdsByName.get(scenario.tutor.toLowerCase());
    if (!tutorId) throw new Error(`Không tìm thấy tutor '${scenario.tutor}' cho scenario ${scenario.id}.`);
    return {
      id: scenario.id,
      tutor_id: tutorId,
      title: scenario.title,
      subtitle: scenario.subtitle,
      level: scenario.level,
      icon: scenario.icon,
      sort_order: index + 1,
      is_published: true,
    };
  });
  const scenarioIds = new Set(scenarios.map((scenario) => scenario.id));
  const messages = Object.entries(content.DEMO_MESSAGES).flatMap(([scenarioId, entries]) => {
    if (!scenarioIds.has(scenarioId)) {
      throw new Error(`Không tìm thấy scenario '${scenarioId}' cho demo conversation.`);
    }
    return entries.map((entry, index) => ({
      scenario_id: scenarioId,
      position: index + 1,
      role: entry.role,
      text: entry.text,
    }));
  });
  return { tutors, scenarios, messages };
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

function isRetryableUpsertError(error) {
  const status = Number(error?.status);
  if (status === 408 || status === 425 || status === 429 || status >= 500) return true;
  const message = `${error?.name || ''} ${error?.message || error || ''}`;
  return /fetch failed|network|timeout|timed out|socket|ECONNRESET|ECONNREFUSED|EAI_AGAIN|UND_ERR/i.test(message);
}

function describeUpsertError(error) {
  const parts = [];
  if (error?.status) parts.push(`HTTP ${error.status}`);
  if (error?.message) parts.push(error.message);
  const cause = error?.cause;
  if (cause?.code) parts.push(`cause=${cause.code}`);
  else if (cause?.message) parts.push(`cause=${cause.message}`);
  const nestedCause = typeof error?.details === 'string'
    ? error.details.match(/Caused by:\s*([^\n]+)/i)?.[1]?.trim()
    : null;
  if (nestedCause) parts.push(`chi tiết kết nối: ${nestedCause}`);
  if (error?.hint) parts.push(`gợi ý: ${error.hint}`);
  return parts.join('; ') || String(error);
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function upsertInBatches(client, table, rows, onConflict, rowsPerBatch = batchSize) {
  for (let offset = 0; offset < rows.length; offset += rowsPerBatch) {
    const batch = rows.slice(offset, offset + rowsPerBatch);
    const batchLabel = `bản ghi ${offset + 1}-${offset + batch.length}`;

    for (let attempt = 1; attempt <= maxUpsertAttempts; attempt += 1) {
      try {
        const { error } = await client.from(table).upsert(batch, { onConflict });
        if (!error) break;
        if (!isRetryableUpsertError(error) || attempt === maxUpsertAttempts) {
          throw error;
        }
        const delay = retryBaseDelayMs * (2 ** (attempt - 1));
        console.warn(
          `Lỗi tạm thời khi nhập ${table} (${batchLabel}); thử lại lần ${attempt + 1}/${maxUpsertAttempts} sau ${delay / 1000}s.`
        );
        await wait(delay);
      } catch (error) {
        if (attempt === maxUpsertAttempts || !isRetryableUpsertError(error)) {
          throw new Error(`Không thể nhập ${table} (${batchLabel}): ${describeUpsertError(error)}`);
        }
        const delay = retryBaseDelayMs * (2 ** (attempt - 1));
        console.warn(
          `Lỗi kết nối khi nhập ${table} (${batchLabel}); thử lại lần ${attempt + 1}/${maxUpsertAttempts} sau ${delay / 1000}s.`
        );
        await wait(delay);
      }
    }

    if (offset % (rowsPerBatch * 10) === 0 || offset + batch.length === rows.length) {
      console.log(`Đã nhập ${table}: ${offset + 1}-${offset + batch.length}/${rows.length}`);
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
  const externalGrammarExercises = await loadExternalGrammarExercises();
  const content = loadLearningCatalogs();
  const topics = buildTopics(vocabulary, content.learningTopics);
  const vocabularyRows = vocabulary.map(toVocabularyRow);
  const vocabularyLessons = buildVocabularyLessons(vocabulary);
  const practiceRows = buildPracticeRows(content);
  const tutorCatalog = buildTutorRows(content);
  const lessons = [...grammar.grammarLessons, ...vocabularyLessons.lessons];
  const lessonItems = [...grammar.grammarItems, ...vocabularyLessons.items];

  const client = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await upsertInBatches(client, 'topics', topics, 'id');
  await upsertInBatches(client, 'vocabulary_entries', vocabularyRows, 'id');
  await upsertInBatches(client, 'grammar_points', grammar.grammarPoints, 'id');
  await upsertInBatches(client, 'grammar_examples', grammar.grammarExamples, 'grammar_point_id,position');
  await upsertInBatches(client, 'grammar_exercises', externalGrammarExercises, 'id', grammarExerciseBatchSize);
  await upsertInBatches(client, 'lessons', lessons, 'id');
  await upsertInBatches(client, 'lesson_items', lessonItems, 'lesson_id,position');
  await upsertInBatches(client, 'practice_content', practiceRows, 'id');
  await upsertInBatches(client, 'ai_tutors', tutorCatalog.tutors, 'id');
  await upsertInBatches(client, 'tutor_scenarios', tutorCatalog.scenarios, 'id');
  await upsertInBatches(client, 'tutor_scenario_messages', tutorCatalog.messages, 'scenario_id,position');

  const publishedVocabularyCount = vocabularyRows.filter((row) => row.is_published).length;
  console.log(
    `Đã nhập ${topics.length} chủ đề, ${vocabularyRows.length} từ vựng ` +
      `(${publishedVocabularyCount} công khai), ${grammar.grammarPoints.length} điểm grammar, ` +
      `${grammar.grammarExamples.length} ví dụ và ${lessons.length} lesson; ` +
      `${externalGrammarExercises.length} câu grammar trích nguyên bản từ GitHub; ` +
      `${practiceRows.length} nội dung luyện tập, ${tutorCatalog.tutors.length} gia sư, ` +
      `${tutorCatalog.scenarios.length} tình huống và ${tutorCatalog.messages.length} tin nhắn mẫu.`
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
