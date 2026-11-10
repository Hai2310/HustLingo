export type TutorAction = 'message' | 'hint' | 'correct' | 'summary';
export interface ChatInput {
  requestId: string; sessionId: string; scenarioId: string; tutorId: string;
  action: TutorAction; message?: string;
}
export class TutorError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function validateInput(value: unknown): ChatInput {
  if (!value || typeof value !== 'object') throw new TutorError('Invalid tutor request.');
  const body = value as Record<string, unknown>;
  for (const field of ['requestId', 'sessionId']) {
    if (typeof body[field] !== 'string' || !uuid.test(body[field] as string)) throw new TutorError(`Invalid ${field}.`);
  }
  for (const field of ['scenarioId', 'tutorId']) {
    if (typeof body[field] !== 'string' || !/^[a-z0-9_-]{1,100}$/i.test(body[field] as string)) throw new TutorError(`Invalid ${field}.`);
  }
  if (typeof body.action !== 'string' || !['message', 'hint', 'correct', 'summary'].includes(body.action)) throw new TutorError('Unknown tutor action.');
  if (body.message !== undefined && typeof body.message !== 'string') throw new TutorError('Message must be text.');
  const message = typeof body.message === 'string' ? body.message.trim() : undefined;
  if (body.action === 'message' && (!message || message.length > 500)) throw new TutorError('Send between 1 and 500 characters.');
  if (body.action !== 'message' && message) throw new TutorError('This action does not accept message content.');
  return { requestId: body.requestId as string, sessionId: body.sessionId as string,
    tutorId: body.tutorId as string, scenarioId: body.scenarioId as string, action: body.action as TutorAction, message };
}
const short = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export function normalizeReply(content: string) {
  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    body = parsed;
  } catch { throw new TutorError('AI provider returned an invalid response. Please retry.', 502); }
  const message = short(body.message, 5000);
  if (!message) throw new TutorError('AI provider returned an empty response.', 502);
  const raw = body.correction as Record<string, unknown> | undefined;
  const correction = raw && short(raw.original, 1000) && short(raw.corrected, 1000) && short(raw.explanation, 2000)
    ? { original: short(raw.original, 1000), corrected: short(raw.corrected, 1000), explanation: short(raw.explanation, 2000) } : null;
  return {
    message, correction,
    suggestedReplies: Array.isArray(body.suggestedReplies) ? [...new Set(body.suggestedReplies.map(value => short(value, 180)).filter(Boolean))].slice(0, 3) : [],
    newVocabulary: Array.isArray(body.newVocabulary) ? body.newVocabulary.flatMap(value => {
      if (!value || typeof value !== 'object') return [];
      const term = short(value.term, 100), meaning = short(value.meaning, 300);
      return term && meaning ? [{ term, meaning }] : [];
    }).slice(0, 5) : [],
  };
}
export interface StoredMessage { role: string; content: string; metadata?: { correction?: unknown; newVocabulary?: unknown[] } | null }
export function serverSummary(input: ChatInput, title: string, startedAt: string, messages: StoredMessage[], now = Date.now()) {
  return {
    sessionId: input.sessionId, scenarioId: input.scenarioId, scenarioTitle: title, tutorId: input.tutorId,
    messageCount: messages.filter(item => item.role === 'learner').length,
    durationMinutes: Math.max(1, Math.round((now - Date.parse(startedAt)) / 60000)),
    highlights: [`You practised ${title}.`, messages.some(item => item.role === 'learner') ? 'You kept the conversation moving.' : 'You explored a new practice scenario.'],
    corrections: messages.flatMap(item => item.metadata?.correction ? [item.metadata.correction] : []).slice(-3),
    newVocabulary: messages.flatMap(item => item.metadata?.newVocabulary || []).slice(-5),
    nextStep: 'Try another scenario or practise this one with fewer hints.',
  };
}
