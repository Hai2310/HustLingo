import React from 'react';
import { Screen } from '@/components/Screen';
import { FeatureBlankState } from '@/components/FeatureBlankState';
import { colors } from '@/theme/colors';

export default function Lessons() {
  return (
    <Screen>
      <FeatureBlankState
        kicker="ENGLISH ROADMAP"
        title="Bài học"
        description="Khung giao diện đã sẵn sàng. Toàn bộ logic và nội dung Bài học được để trống trong bản H.1 để bạn tự phát triển."
        icon="book-outline"
        accent={colors.blue}
        accentSoft={colors.blueSoft}
        codeHint="app/(tabs)/lessons.tsx"
      />
    </Screen>
  );
}
