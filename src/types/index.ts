export type UserRole = 'learner' | 'admin';

export interface User {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl?: string | null;
  role: UserRole;
  status: 'active' | 'disabled';
  englishLevel?: string | null;
  learningGoal?: string | null;
  dailyMinutes?: number | null;
}

export interface LearningState {
  studiedWordIds: string[];
  reviewWordIds: string[];
  savedWordIds: string[];
  completedLessonIds: string[];
  correctAnswers: number;
  totalAnswers: number;
  minutesToday: number;
  lastStudyDate?: string;
}
