import type { ImageSourcePropType } from 'react-native';

export const orbitalLibrary: ImageSourcePropType = require('../../assets/illustrations/cosmic/orbital-library.webp');
export const signalStudio: ImageSourcePropType = require('../../assets/illustrations/cosmic/signal-studio.webp');
export const explorerBom = require('../../assets/illustrations/cosmic/bom-explorer.webp');
export const explorerBomBlink = require('../../assets/illustrations/cosmic/bom-blink.webp');
export const heroCrystal = require('../../assets/illustrations/cosmic/hero-crystal.webp');
export const tutorPortraits: Readonly<Record<string, ImageSourcePropType>> = {
  emma: require('../../assets/illustrations/cosmic/emma-explorer.webp'),
  david: require('../../assets/illustrations/cosmic/david-explorer.webp'),
};
export const cosmicTopicArt: Readonly<Partial<Record<string, ImageSourcePropType>>> = {
  education: require('../../assets/illustrations/cosmic/cosmic-campus.webp'),
  family: require('../../assets/illustrations/cosmic/cosmic-family.webp'),
  travel: require('../../assets/illustrations/cosmic/cosmic-travel.webp'),
  technology: require('../../assets/illustrations/cosmic/cosmic-tech.webp'),
  food: require('../../assets/illustrations/cosmic/cosmic-food.webp'),
  workplace: require('../../assets/illustrations/cosmic/cosmic-work.webp'),
};
