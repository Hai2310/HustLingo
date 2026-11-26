import { EXAM_MODES } from '../engine/exam';
import { EXAM_SECTIONS } from './examBank';

export const EXAM_CATALOG = [
  { id: 'toeic', title: 'TOEIC', sections: EXAM_SECTIONS.toeic, modes: EXAM_MODES },
  { id: 'ielts', title: 'IELTS', sections: EXAM_SECTIONS.ielts, modes: EXAM_MODES },
] as const;
