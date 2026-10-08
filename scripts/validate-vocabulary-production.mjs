import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'src', 'data', 'vocabulary-en.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const fail = (message) => errors.push(message);

if (data.length !== 10000) fail(`Expected 10000 records, got ${data.length}`);
if (new Set(data.map(x => x.id)).size !== data.length) fail('Duplicate vocabulary IDs');
if (new Set(data.map(x => x.term.toLowerCase())).size !== data.length) fail('Duplicate terms');
if (data.some(x => !x.term || !x.translation)) fail('Missing term/translation');
const levels = new Set(['A1','A2','B1','B2','C1','C2']);
if (data.some(x => !levels.has(x.cefrLevel))) fail('Invalid CEFR label');
const active = data.filter(x => x.isActive && x.quality === 'production');
if (active.length < 2500) fail(`Production pool unexpectedly small: ${active.length}`);
if (active.some(x => x.sourceSegment !== 'frequency-core')) fail('Legacy dictionary-fill leaked into production pool');
if (active.some(x => x.reviewFlags?.includes('profanity') || x.reviewFlags?.includes('dated-sensitive-term'))) fail('Unsafe term leaked into production pool');
const dailyShare = active.filter(x => x.topicId === 'daily').length / active.length;
if (dailyShare > 0.85) fail(`Topic classification too concentrated in daily: ${(dailyShare*100).toFixed(1)}%`);
const ieltsTagged = active.filter(x => x.examTags?.includes('ielts')).length;
if (ieltsTagged > active.length * 0.6) fail('IELTS tags are too broad');

if (errors.length) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}

console.log('PASS vocabulary production validation');
console.log(`raw=${data.length} production=${active.length} review=${data.length-active.length}`);
console.log(`dailyShare=${(dailyShare*100).toFixed(1)}% toeicHigh=${active.filter(x=>x.toeicRelevance==='high').length} ieltsHigh=${active.filter(x=>x.ieltsRelevance==='high').length}`);
