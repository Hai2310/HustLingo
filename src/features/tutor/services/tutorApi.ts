import { supabase, supabaseConfigured } from '@/services/supabase';
import type {
  TutorChatRequest,
  TutorChatResponse,
  TutorMessage,
  TutorScenario,
} from '../types';
import { tutors } from '../data/tutors';

function lastLearnerMessage(history: TutorMessage[]) {
  return [...history].reverse().find(message => message.role === 'learner')?.text || '';
}

function localResponse(request: TutorChatRequest): TutorChatResponse {
  const message = lastLearnerMessage(request.history).toLowerCase();
  const tutor = tutors.find(item => item.id === request.tutorId);

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
      message: `Nice work with ${tutor?.name || 'your tutor'}. You completed a practice turn.`,
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
  if (!supabaseConfigured || options?.useRemote === false) {
    return localResponse(request);
  }

  const { data, error } = await supabase.functions.invoke('tutor-chat', { body: request });
  if (error) throw error;
  if (!data || typeof data.message !== 'string') {
    throw new Error('Tutor API returned an invalid response.');
  }
  return data as TutorChatResponse;
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
