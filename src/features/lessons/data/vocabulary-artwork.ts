import type { ImageSourcePropType } from 'react-native';

export type VocabularyArtId = 'library' | 'education' | 'family' | 'travel' | 'technology' | 'career' | 'food';
export interface VocabularyArt {
  image: ImageSourcePropType;
  label: string;
  description: string;
  color: string;
  wash: string;
}

// Static asset references let Metro bundle the illustrations for mobile and web.
const artwork: Record<VocabularyArtId, VocabularyArt> = {
  library: { image: require('../../../../assets/illustrations/vocabulary/library.jpg'), label: 'Everyday English', description: 'An illustrated open book, headphones and greenery.', color: '#B14F3A', wash: '#FFF0E7' },
  education: { image: require('../../../../assets/illustrations/vocabulary/education.jpg'), label: 'University', description: 'A university building with books and a leafy tree.', color: '#7660AA', wash: '#F2EDFA' },
  family: { image: require('../../../../assets/illustrations/vocabulary/family.jpg'), label: 'Family', description: 'A family sitting together on a cozy sofa.', color: '#AE5266', wash: '#FFF0F3' },
  travel: { image: require('../../../../assets/illustrations/vocabulary/travel.jpg'), label: 'Travel', description: 'An airplane above an island, with a suitcase and a map.', color: '#277D79', wash: '#E7F4EF' },
  technology: { image: require('../../../../assets/illustrations/vocabulary/technology.jpg'), label: 'Technology', description: 'A laptop, a smartphone and a computer mouse.', color: '#3771A0', wash: '#EAF3FB' },
  career: { image: require('../../../../assets/illustrations/vocabulary/career.jpg'), label: 'Career', description: 'A work bag, notebook, lamp and coffee on a desk.', color: '#9C6B37', wash: '#FFF0DC' },
  food: { image: require('../../../../assets/illustrations/vocabulary/food.jpg'), label: 'Food & dining', description: 'Fruit, an apple, a croissant and a ceramic cup.', color: '#9A642F', wash: '#FFF2DB' },
};
const topicArt: Record<string, VocabularyArtId> = {
  education: 'education', university: 'education', academic: 'education',
  family: 'family', travel: 'travel', technology: 'technology',
  workplace: 'career', career: 'career', business: 'career', food: 'food',
};

export function getVocabularyArtwork(topicId?: string): VocabularyArt {
  return artwork[topicArt[topicId || ''] || 'library'];
}

// These are contextual scenes, not exact picture definitions for every word.
// Abstract words retain a letter tile instead of an unrelated illustration.
const sceneTerms: Partial<Record<VocabularyArtId, string[]>> = {
  education: ['school', 'student', 'university', 'college', 'campus', 'teacher', 'education', 'class', 'classroom'],
  library: ['book', 'books', 'read', 'reading', 'study', 'learn', 'learning', 'headphones'],
  family: ['family', 'child', 'children', 'mother', 'father', 'parent', 'parents', 'kid', 'boy', 'girl', 'son', 'daughter'],
  travel: ['travel', 'trip', 'journey', 'vacation', 'holiday', 'island', 'airplane', 'plane', 'suitcase', 'map'],
  technology: ['technology', 'computer', 'laptop', 'phone', 'smartphone', 'mouse'],
  career: ['work', 'job', 'career', 'office', 'workplace', 'notebook', 'bag', 'lamp'],
  food: ['food', 'breakfast', 'fruit', 'apple', 'croissant', 'cup'],
};
const wordArt = new Map(Object.entries(sceneTerms).flatMap(([id, terms]) => terms!.map(term => [term, id as VocabularyArtId] as const)));
export function getWordScene(term: string): VocabularyArt | null {
  const id = wordArt.get(term.trim().toLowerCase());
  return id ? artwork[id] : null;
}
