import { tutorScenarios } from '@/data/content';
import type { TutorScenario } from '../types';

export { tutorScenarios };
export const scenarios: TutorScenario[] = tutorScenarios.map(scenario => ({ ...scenario }));
