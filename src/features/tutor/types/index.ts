
export interface TutorProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  tone?: string;
}

export interface TutorMessage {
  id: string;
  role: 'tutor' | 'learner';
  text: string;
}

export interface TutorScenario {
  id: string;
  tutor: string;
  title: string;
  subtitle: string;
  level: string;
}
