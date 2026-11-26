import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { isChoiceCorrect } from '../engine/quiz';
import { makeResultId } from '../engine/analytics';
import type { AnswerRecord, ChoiceQuestion, PracticeModeId } from '../types';
import { usePracticeData } from './usePracticeData';

/**
 * State for a block of multiple-choice questions answered together and submitted once
 * (listening, reading). Saves the result and keeps the id so the UI can link to it.
 */
export function useQuestionSet(questions: readonly ChoiceQuestion[]) {
  const practice = usePracticeData();
  const [selections, setSelections] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  const select = useCallback((id: string, value: number[]) => setSelections(previous => ({ ...previous, [id]: value })), []);
  const answeredCount = questions.filter(question => (selections[question.id]?.length ?? 0) === question.answers.length).length;

  async function submit(meta: { mode: PracticeModeId; title: string; level?: string; durationSeconds: number; section?: string }) {
    if (submitted) return;
    const answers: AnswerRecord[] = questions.map(question => {
      const selected = selections[question.id] ?? [];
      return {
        questionId: question.id, kind: question.kind, section: meta.section, correct: isChoiceCorrect(question.answers, selected), prompt: question.prompt,
        given: selected.map(index => question.options[index]).join(', ') || '(bỏ trống)', expected: question.answers.map(index => question.options[index]).join(', '), explanation: question.explanation,
      };
    });
    setSubmitted(true);
    const now = new Date(), id = makeResultId(meta.mode, now);
    setResultId(id);
    await practice.saveResult({ id, mode: meta.mode, title: meta.title, level: meta.level, correct: answers.filter(a => a.correct).length, total: answers.length, durationSeconds: meta.durationSeconds, finishedAt: now.toISOString(), answers }, { countAnswers: true });
  }

  function reset() { setSelections({}); setSubmitted(false); setResultId(null); }
  const correctCount = submitted ? questions.filter(question => isChoiceCorrect(question.answers, selections[question.id] ?? [])).length : 0;
  const openResult = () => { if (resultId) router.push({ pathname: '/practice/result', params: { id: resultId } }); };

  return { selections, select, submitted, submit, reset, answeredCount, allAnswered: answeredCount === questions.length, correctCount, resultId, openResult };
}
