import React from 'react';
import { Screen } from '@/components/Screen';
import { FeatureBlankState } from '@/components/FeatureBlankState';
import { colors } from '@/theme/colors';

export default function Practice() {
  return (
    <Screen>
      <FeatureBlankState
        kicker="FOCUS MODE"
        title="Luyện tập"
        description="Khung giao diện đã sẵn sàng. Flashcard, quiz, luyện kỹ năng và luyện thi được để trống trong bản H.1 để bạn tự code."
        icon="radio-button-on-outline"
        accent={colors.violet}
        accentSoft={colors.violetSoft}
        codeHint="app/(tabs)/practice.tsx"
      />
    </Screen>
  );
}
