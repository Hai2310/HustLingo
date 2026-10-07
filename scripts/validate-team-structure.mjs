import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const vocab = fs.readFileSync(path.join(root, 'src/data/vocabulary-en.ts'), 'utf8');
const ids = vocab.match(/local-en-\d{5}/g) || [];
const unique = new Set(ids);
const required = [
  'src/features/lessons/screens/LessonsScreen.tsx',
  'src/features/practice/screens/PracticeScreen.tsx',
  'src/features/tutor/screens/TutorScreen.tsx',
  'src/features/lessons/data/vocabulary.ts',
  'src/features/practice/data/vocabulary.ts',
  'src/features/tutor/data/vocabulary.ts',
];
const missing = required.filter((p) => !fs.existsSync(path.join(root, p)));
if (unique.size !== 10000) throw new Error(`Expected 10000 unique vocabulary ids, got ${unique.size}`);
if (missing.length) throw new Error(`Missing team files: ${missing.join(', ')}`);
console.log(`TEAM STRUCTURE OK | vocabulary=${unique.size} | required=${required.length}`);
