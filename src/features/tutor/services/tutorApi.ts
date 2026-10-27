import { supabase, supabaseConfigured } from '@/services/supabase';
import type {
  TutorChatRequest,
  TutorChatResponse,
  TutorMessage,
  TutorScenario,
} from '../types';

function lastLearnerMessage(history: TutorMessage[]) {
  return [...history].reverse().find(message => message.role === 'learner')?.text || '';
}

function localResponse(request: TutorChatRequest): TutorChatResponse {
  const message = lastLearnerMessage(request.history).toLowerCase();

  if (request.action === 'hint') {
    return {
      message: 'Try a short sentence with one of the useful phrases from this scenario.',
      suggestedReplies: ['Could you help me with that?', 'I would like to know more.'],
    };
  }

  if (request.action === 'correct') {
    return {
      message: 'Here is a more natural way to say it. Keep your meaning, then continue the conversation.',
      correction: {
        original: lastLearnerMessage(request.history) || 'Your sentence',
        corrected: lastLearnerMessage(request.history) || 'Your sentence',
        explanation: 'The demo tutor is ready. Connect the server function to receive AI-powered correction.',
      },
    };
  }

  if (request.action === 'summary') {
    return {
      message: 'Demo session completed.',
    };
  }

  if (message.includes('coffee') || message.includes('latte')) {
    return { message: 'Great choice. What size would you like?', suggestedReplies: ['A medium latte, please.'] };
  }
  if (message.includes('interview') || message.includes('student')) {
    return { message: 'That sounds useful. What is one strength you would bring to the role?' };
  }

  return {
    message: 'That is a good start. Could you add one more detail so we can keep the conversation going?',
    suggestedReplies: ['Could you give me an example?', 'I would like to explain more.'],
  };
}

export async function sendTutorRequest(
  request: TutorChatRequest,
  options?: { useRemote?: boolean },
): Promise<TutorChatResponse> {
  if (options?.useRemote === false) {
    return localResponse(request);
  }

  if (!supabaseConfigured) throw new Error('Supabase chưa được cấu hình.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);
  try {
    const { history: _clientHistory, ...serverRequest } = request;
    const { data, error } = await supabase.functions.invoke('tutor-chat', { body: serverRequest, signal: controller.signal });
    if (error) {
      const context = 'context' in error ? error.context : null;
      if (context instanceof Response) {
        const detail = await context.clone().json().catch(() => null);
        if (typeof detail?.error === 'string') throw new Error(detail.error);
      }
      throw new Error('Không kết nối được Gia sư AI. Bấm Retry để thử lại cùng lượt.');
    }
    if (!data || typeof data.message !== 'string') throw new Error('Tutor API returned an invalid response.');
    return data as TutorChatResponse;
  } finally {
    clearTimeout(timer);
  }
}

export function scenarioContext(scenario: TutorScenario) {
  return {
    scenarioId: scenario.id,
    title: scenario.title,
    level: scenario.level,
    objective: scenario.objective,
    learnerRole: scenario.learnerRole,
    topicIds: scenario.topicIds,
  };
}
