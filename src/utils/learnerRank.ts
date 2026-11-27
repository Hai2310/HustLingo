export const learnerRanks = [
  { id: 'newbie', title: 'Newbie', lessons: 0, practice: 0 },
  { id: 'active', title: 'Active Learner', lessons: 3, practice: 5 },
  { id: 'star', title: 'Star Learner', lessons: 10, practice: 20 },
  { id: 'solar', title: 'Solar Learner', lessons: 25, practice: 60 },
  { id: 'galactus', title: 'Galactus Learner', lessons: 50, practice: 120 },
] as const;

export type LearnerRank = typeof learnerRanks[number];

export function getLearnerRank(lessons: number, practice: number) {
  const nextIndex = learnerRanks.findIndex(rank => lessons < rank.lessons || practice < rank.practice);
  if (nextIndex === -1) return { rank: learnerRanks[learnerRanks.length - 1], next: null };
  return { rank: learnerRanks[Math.max(0, nextIndex - 1)], next: learnerRanks[nextIndex] };
}
