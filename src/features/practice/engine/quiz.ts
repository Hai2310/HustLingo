import type { LocalVocabularyRecord } from '@/data/vocabulary-en';
import type { ChoiceQuestion, QuizQuestion } from '../types';

/** Deterministic PRNG so tests (and "retry the same quiz") can reproduce an order. */
export function createRandom(seed = Date.now()) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Shuffle a choice question's options and remap the answer indexes. */
export function shuffleOptions<Q extends ChoiceQuestion>(question: Q, random: () => number = Math.random): Q {
  const order = shuffle(question.options.map((_, index) => index), random);
  return { ...question, options: order.map(index => question.options[index]), answers: question.answers.map(answer => order.indexOf(answer)).sort((a, b) => a - b) };
}

export function isChoiceCorrect(answers: number[], selected: number[]) {
  if (answers.length !== selected.length) return false;
  const expected = new Set(answers);
  return selected.every(index => expected.has(index));
}

export const normaliseAnswer = (value: string) => value.trim().toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '');

export function isTypingCorrect(accepted: string[], given: string) {
  const answer = normaliseAnswer(given);
  return answer.length > 0 && accepted.some(option => normaliseAnswer(option) === answer);
}

export type VocabularyQuizMode = 'mixed' | 'en-vi' | 'vi-en' | 'fill-blank';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const termPattern = (term: string) => new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');

/**
 * The current bank's examples are placeholder templates ("I wrote a sentence with the word “x”.").
 * They give no context, so a blank in them is unanswerable — skip them until real examples exist.
 */
const TEMPLATE_EXAMPLES = [/the word [“"]/i, /meaning of [“"]/i, /how to use [“"]/i, /is important in this .+ situation/i];
export const isTemplateExample = (sentence: string) => TEMPLATE_EXAMPLES.some(pattern => pattern.test(sentence));

export function blankSentence(sentence: string | undefined, term: string) {
  if (!sentence || term.length < 2 || isTemplateExample(sentence)) return null;
  const pattern = termPattern(term);
  if (!pattern.test(sentence)) return null;
  return sentence.replace(termPattern(term), '_____');
}

function pickDistractors(word: LocalVocabularyRecord, pool: readonly LocalVocabularyRecord[], field: 'term' | 'translation', random: () => number) {
  const seen = new Set([word[field].trim().toLowerCase()]);
  const samePos = pool.filter(item => item.partOfSpeech === word.partOfSpeech);
  const picked: string[] = [];
  for (const source of [samePos, pool]) {
    for (const candidate of shuffle(source.length > 400 ? sampleSlice(source, 400, random) : source, random)) {
      const value = candidate[field].trim();
      if (candidate.id === word.id || !value || seen.has(value.toLowerCase())) continue;
      seen.add(value.toLowerCase());
      picked.push(value);
      if (picked.length === 3) return picked;
    }
  }
  return picked;
}

function sampleSlice<T>(items: readonly T[], size: number, random: () => number) {
  const start = Math.floor(random() * Math.max(1, items.length - size));
  return items.slice(start, start + size);
}

/**
 * Build a vocabulary quiz. `words` are the target words (already filtered by level/topic),
 * `pool` supplies distractors. Every question carries the word id so answers feed the SRS.
 */
export function buildVocabularyQuiz(words: readonly LocalVocabularyRecord[], pool: readonly LocalVocabularyRecord[], { count = 10, mode = 'mixed' as VocabularyQuizMode, seed }: { count?: number; mode?: VocabularyQuizMode; seed?: number } = {}): QuizQuestion[] {
  const random = createRandom(seed);
  const targets = shuffle(words, random).slice(0, count);
  return targets.map((word, index) => {
    const kinds: VocabularyQuizMode[] = mode === 'mixed' ? ['en-vi', 'vi-en', 'fill-blank'] : [mode];
    const kind = kinds[index % kinds.length];
    if (kind === 'fill-blank') {
      // Blank the example when it carries real context; otherwise ask for the word from its meaning.
      const blanked = blankSentence(word.exampleSentence, word.term);
      const shape = `bắt đầu bằng “${word.term[0]}”, ${word.term.length} chữ cái`;
      return {
        type: 'typing', id: `${word.id}:fill`, wordId: word.id, kind: 'fill-blank',
        prompt: blanked ?? `Viết từ tiếng Anh có nghĩa: “${word.translation}”`,
        accepted: [word.term],
        hint: blanked ? `${word.translation} · ${shape}` : shape,
        explanation: blanked && word.exampleSentence ? `${word.exampleSentence}${word.exampleTranslation ? ` — ${word.exampleTranslation}` : ''}` : undefined,
      };
    }
    const enToVi = kind === 'en-vi';
    const correct = enToVi ? word.translation : word.term;
    const options = [correct, ...pickDistractors(word, pool, enToVi ? 'translation' : 'term', random)];
    return shuffleOptions({
      type: 'choice' as const, id: `${word.id}:${kind}`, wordId: word.id, kind: enToVi ? 'meaning' as const : 'translation' as const,
      prompt: enToVi ? word.term : word.translation,
      options, answers: [0],
      explanation: [word.ipa || word.pronunciation, word.partOfSpeech, word.exampleSentence].filter(Boolean).join(' · ') || undefined,
    }, random);
  });
}
