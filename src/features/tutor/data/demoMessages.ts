
export const DEMO_MESSAGES = {
  coffee: [
    { id: 'coffee-1', role: 'tutor', text: 'Hi! Welcome to the coffee shop. What would you like to order?' },
    { id: 'coffee-2', role: 'learner', text: 'I would like a latte, please.' },
  ],
  interview: [
    { id: 'interview-1', role: 'tutor', text: 'Could you introduce yourself briefly?' },
    { id: 'interview-2', role: 'learner', text: 'I am a university student and I enjoy working with technology.' },
  ],
} as const;
