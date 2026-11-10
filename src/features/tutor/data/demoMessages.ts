
import type { TutorMessage } from '../types';

export const DEMO_MESSAGES: Record<string, TutorMessage[]> = {
  coffee: [
    { id: 'coffee-1', role: 'tutor', text: 'Hi! Welcome to the coffee shop. What would you like to order?' },
    { id: 'coffee-2', role: 'learner', text: 'I would like a latte, please.' },
  ],
  university: [
    { id: 'university-1', role: 'tutor', text: 'Hi! You look a little lost. What are you looking for?' },
    { id: 'university-2', role: 'learner', text: 'I am looking for the language lab.' },
  ],
  travel: [
    { id: 'travel-1', role: 'tutor', text: 'Welcome to the hotel. How can I help you today?' },
    { id: 'travel-2', role: 'learner', text: 'Could you tell me where the airport shuttle is?' },
  ],
  interview: [
    { id: 'interview-1', role: 'tutor', text: 'Could you introduce yourself briefly?' },
    { id: 'interview-2', role: 'learner', text: 'I am a university student and I enjoy working with technology.' },
  ],
  presentation: [
    { id: 'presentation-1', role: 'tutor', text: 'You have five minutes to present your project. How would you open?' },
    { id: 'presentation-2', role: 'learner', text: 'Today I would like to present our new study plan.' },
  ],
  meeting: [
    { id: 'meeting-1', role: 'tutor', text: 'We need to decide how to handle the project deadline. What do you think?' },
    { id: 'meeting-2', role: 'learner', text: 'I think we should move the deadline by one week.' },
  ],
} as const;

export function getDemoMessages(scenarioId: string) {
  return DEMO_MESSAGES[scenarioId] || [
    { id: `${scenarioId}-welcome`, role: 'tutor', text: 'Hi! Let us practise together. What would you like to say?' },
  ];
}
