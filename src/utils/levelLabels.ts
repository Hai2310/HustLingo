export const LEARNING_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;

const labels = new Map([
  ['A1', 'Beginner'],
  ['A2', 'Easy'],
  ['B1', 'Medium'],
  ['B2', 'Hard'],
  ['C1', 'Advanced'],
  ['C2', 'Advanced'],
  ['INTERMEDIATE', 'Medium'],
]);

export function getLevelLabel(level: string): string {
  return labels.get(level.trim().toUpperCase()) ?? level;
}
