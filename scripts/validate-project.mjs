import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const forbiddenRuntime = [
  '@blinkdotnew', 'llama.rn', 'react-native-sherpa-onnx', 'expo-apple-authentication',
  'app/games', 'rewardStore', 'JLPT', 'TOPIK', 'hskLevel', 'pinyin?:',
  'EXPO_PUBLIC_API_URL', '@/services/api', '@/services/sessionStorage'
];
const runtimeRoots = ['app', 'src', 'package.json', 'app.config.js'];

function walk(entry) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) return [entry];
  const out = [];
  for (const name of fs.readdirSync(full)) {
    const rel = path.join(entry, name);
    const st = fs.statSync(path.join(root, rel));
    if (st.isDirectory()) out.push(...walk(rel));
    else if (/\.(tsx?|jsx?|json|js)$/.test(name)) out.push(rel);
  }
  return out;
}

const files = runtimeRoots.flatMap(walk);
for (const rel of files) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  for (const bad of forbiddenRuntime) {
    if (text.includes(bad)) failures.push(`${rel}: contains forbidden runtime marker ${bad}`);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const dep of ['@blinkdotnew/sdk', '@blinkdotnew/mobile-ui', 'llama.rn', 'react-native-sherpa-onnx', 'expo-apple-authentication']) {
  if (pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]) failures.push(`package.json: forbidden dependency ${dep}`);
}
for (const requiredDep of ['@supabase/supabase-js', 'expo-font', 'expo-auth-session']) {
  if (!pkg.dependencies?.[requiredDep]) failures.push(`package.json: missing dependency ${requiredDep}`);
}
if (pkg.dependencies?.['expo-font'] !== '~14.0.12') failures.push('package.json: expo-font must be ~14.0.12 for Expo SDK 54 web compatibility');

const vocabJsonPath = path.join(root, 'src/data/vocabulary-en.json');
const vocabTsPath = path.join(root, 'src/data/vocabulary-en.ts');
let count = 0;
let nonEnglishCodes = [];
if (fs.existsSync(vocabJsonPath)) {
  const vocabData = JSON.parse(fs.readFileSync(vocabJsonPath, 'utf8'));
  count = vocabData.length;
  nonEnglishCodes = vocabData.map((item) => item.languageCode).filter((code) => code !== 'en');
} else {
  const vocab = fs.readFileSync(vocabTsPath, 'utf8');
  nonEnglishCodes = [...vocab.matchAll(/"languageCode":"([^"]+)"/g)].map(m => m[1]).filter(x => x !== 'en');
  count = (vocab.match(/"id":"local-en-/g) || []).length;
}
if (nonEnglishCodes.length) failures.push(`Vocabulary contains non-English languageCode values: ${[...new Set(nonEnglishCodes)].join(', ')}`);
if (count < 9000) failures.push(`Vocabulary bank unexpectedly small: ${count}`);

for (const required of [
  'app/(tabs)/home.tsx',
  'app/(tabs)/lessons.tsx',
  'app/(tabs)/practice.tsx',
  'app/(tabs)/tutor.tsx',
  'app/(tabs)/profile.tsx',
  'src/services/supabase.ts',
  'src/services/supabaseData.ts',
  'supabase/migrations/202610050001_init_hustlingo.sql',
  'eas.json'
]) {
  if (!fs.existsSync(path.join(root, required))) failures.push(`Missing required file: ${required}`);
}

for (const forbiddenPath of ['backend', 'docker-compose.yml', 'render.yaml']) {
  if (fs.existsSync(path.join(root, forbiddenPath))) failures.push(`Forbidden old backend path still exists: ${forbiddenPath}`);
}

const appConfig = fs.readFileSync(path.join(root, 'app.config.js'), 'utf8');
if (!appConfig.includes("output: 'single'")) failures.push("app.config.js: web.output must be 'single'");

for (const [route, target] of [
  ['app/vocabulary.tsx', '/(tabs)/lessons'],
  ['app/grammar.tsx', '/(tabs)/lessons'],
  ['app/listening.tsx', '/(tabs)/lessons'],
  ['app/reading.tsx', '/(tabs)/lessons'],
  ['app/speaking.tsx', '/(tabs)/lessons'],
  ['app/writing.tsx', '/(tabs)/lessons'],
  ['app/flashcards.tsx', '/(tabs)/practice'],
  ['app/quiz.tsx', '/(tabs)/practice'],
  ['app/exam.tsx', '/(tabs)/practice'],
]) {
  const text = fs.readFileSync(path.join(root, route), 'utf8');
  if (!text.includes(target)) failures.push(`${route}: H.1 blank route must redirect to ${target}`);
}

for (const tab of [
  'app/(tabs)/lessons.tsx',
  'app/(tabs)/practice.tsx',
]) {
  const text = fs.readFileSync(path.join(root, tab), 'utf8');
  for (const marker of ['router.push', 'useLearning', '@/data/']) {
    if (text.includes(marker)) failures.push(`${tab}: H.1 blank tab still contains functional marker ${marker}`);
  }
}

if (failures.length) {
  console.error('VALIDATION FAILED');
  for (const f of failures) console.error(`- ${f}`);
  process.exit(1);
}

console.log(`VALIDATION PASSED: HustLingo baseline, ${count} English vocabulary records, Supabase backend preserved.`);
