import type { AnswerRecord, ExamGroup, ExamId, ExamItem, ExamModeConfig, ExamResponse, ExamSectionId } from '../types';
import { createRandom, isChoiceCorrect, shuffle } from './quiz';

/**
 * One exam engine for TOEIC and IELTS: pick sections, size the test, time it, navigate it,
 * score it. Exams differ only in their question banks and in how a percentage is turned
 * into an estimate (see `estimateScore`).
 */
export const EXAM_MODES: ExamModeConfig[] = [
  { id: 'practice', title: 'Luyện tập', description: 'Không giới hạn thời gian, làm 10 câu.', questionCount: 10, secondsPerQuestion: null },
  { id: 'mini', title: 'Mini Test', description: '20 câu, có đồng hồ đếm ngược.', questionCount: 20, secondsPerQuestion: 60 },
  { id: 'full', title: 'Full Test', description: 'Toàn bộ câu hỏi của phần đã chọn, có đồng hồ.', questionCount: null, secondsPerQuestion: 60 },
];

export interface ExamSessionItem { group: ExamGroup; item: ExamItem; number: number }
export interface ExamSession { exam: ExamId; sections: ExamSectionId[]; groups: ExamGroup[]; items: ExamSessionItem[]; timeLimitSeconds: number | null; modeId: ExamModeConfig['id'] }

/** Productive tasks need more time than one multiple-choice question. */
const ITEM_SECONDS: Record<ExamItem['type'], number> = { choice: 1, writing: 20, speaking: 4 };

export function buildExamSession(bank: readonly ExamGroup[], exam: ExamId, sections: ExamSectionId[], mode: ExamModeConfig, { seed, count }: { seed?: number; count?: number | null } = {}): ExamSession {
  const random = createRandom(seed);
  const target = count === undefined ? mode.questionCount : count;
  const order: ExamSectionId[] = ['listening', 'reading', 'writing', 'speaking'];
  const groups: ExamGroup[] = [];
  let total = 0;
  for (const section of order.filter(id => sections.includes(id))) {
    // Keep a passage/audio together with its questions; shuffle groups within each part.
    const candidates = shuffle(bank.filter(group => group.exam === exam && group.section === section), random).sort((a, b) => a.part.localeCompare(b.part));
    const quota = target === null ? Infinity : Math.ceil((target - total) / (sections.filter(id => order.indexOf(id) >= order.indexOf(section)).length));
    let used = 0;
    for (const group of candidates) {
      if (used >= quota) break;
      const remaining = quota - used;
      const items = group.items.length > remaining && group.items.length > 1 && !group.passage && !group.audioText ? group.items.slice(0, remaining) : group.items;
      groups.push({ ...group, items });
      used += items.length;
    }
    total += used;
  }
  let number = 0;
  const items = groups.flatMap(group => group.items.map(item => ({ group, item, number: ++number })));
  const timeLimitSeconds = mode.secondsPerQuestion === null ? null : items.reduce((sum, entry) => sum + ITEM_SECONDS[entry.item.type] * mode.secondsPerQuestion!, 0);
  return { exam, sections, groups, items, timeLimitSeconds, modeId: mode.id };
}

export interface SectionScore { section: ExamSectionId; correct: number; total: number }
export interface ExamScore {
  correct: number;
  total: number;
  percent: number;
  answered: number;
  bySection: SectionScore[];
  answers: AnswerRecord[];
  /** Average self-assessed band of productive tasks, if any were attempted. */
  selfBand: number | null;
}

export function scoreExam(session: ExamSession, responses: Record<string, ExamResponse>): ExamScore {
  const bySection = new Map<ExamSectionId, SectionScore>();
  const answers: AnswerRecord[] = [];
  const bands: number[] = [];
  let answered = 0;
  for (const { group, item } of session.items) {
    const response = responses[item.id];
    if (item.type === 'choice') {
      const selected = response?.selected ?? [];
      if (selected.length) answered += 1;
      const correct = isChoiceCorrect(item.answers, selected);
      const section = bySection.get(group.section) ?? { section: group.section, correct: 0, total: 0 };
      section.total += 1; if (correct) section.correct += 1;
      bySection.set(group.section, section);
      answers.push({ questionId: item.id, kind: item.kind, section: `${group.section}:${group.part}`, correct, prompt: item.prompt, given: selected.map(index => item.options[index]).join(', ') || '(bỏ trống)', expected: item.answers.map(index => item.options[index]).join(', '), explanation: item.explanation });
    } else {
      if (response?.text?.trim() || response?.selfBand) answered += 1;
      if (response?.selfBand) bands.push(response.selfBand);
    }
  }
  const sections = [...bySection.values()];
  const correct = sections.reduce((sum, section) => sum + section.correct, 0);
  const total = sections.reduce((sum, section) => sum + section.total, 0);
  return { correct, total, percent: total ? Math.round(correct / total * 100) : 0, answered, bySection: sections, answers, selfBand: bands.length ? Math.round(bands.reduce((a, b) => a + b, 0) / bands.length * 2) / 2 : null };
}

const IELTS_BANDS: [number, number][] = [[95, 9], [88, 8.5], [80, 8], [72, 7.5], [64, 7], [56, 6.5], [48, 6], [40, 5.5], [32, 5], [24, 4.5], [16, 4], [0, 3.5]];

/** Rough conversion for motivation only; the UI must label it as an estimate. */
export function estimateScore(exam: ExamId, score: ExamScore) {
  if (exam === 'toeic') {
    const scaled = (section: ExamSectionId) => {
      const part = score.bySection.find(item => item.section === section);
      return part && part.total ? Math.round((5 + part.correct / part.total * 490) / 5) * 5 : null;
    };
    const values = [scaled('listening'), scaled('reading')].filter((value): value is number => value !== null);
    if (!values.length) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    return { label: values.length === 2 ? 'TOEIC ước lượng (10–990)' : 'TOEIC ước lượng cho phần này (5–495)', value: String(sum) };
  }
  if (score.total) {
    const band = IELTS_BANDS.find(([min]) => score.percent >= min)![1];
    return { label: 'IELTS band ước lượng (phần trắc nghiệm)', value: band.toFixed(1) };
  }
  if (score.selfBand !== null) return { label: 'IELTS band tự đánh giá', value: score.selfBand.toFixed(1) };
  return null;
}

/** Navigator state for one question number. */
export function itemState(item: ExamItem, response: ExamResponse | undefined): 'empty' | 'answered' {
  if (!response) return 'empty';
  if (item.type === 'choice') return response.selected?.length ? 'answered' : 'empty';
  return response.text?.trim() || response.selfBand ? 'answered' : 'empty';
}

export function remainingSeconds(startedAt: number, limitSeconds: number, now: number) {
  return Math.max(0, limitSeconds - Math.floor((now - startedAt) / 1000));
}

export function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
  const mm = String(m).padStart(h ? 2 : 1, '0'), ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
