import React from 'react';
import { Screen } from '@/components/Screen';
import { FeatureBlankState } from '@/components/FeatureBlankState';
import { colors } from '@/theme/colors';

export default function Tutor() {
  return (
    <Screen>
      <FeatureBlankState
        kicker="SPEAKING SPACE"
        title="Gia sư AI"
        description="Khung giao diện tab được giữ lại, nhưng toàn bộ tutor, scenario, chat, call, STT/TTS/LLM đều để trống trong bản H.1."
        icon="chatbubble-ellipses-outline"
        accent={colors.cyan}
        accentSoft={colors.cyanSoft}
        codeHint="app/(tabs)/tutor.tsx"
      />
    </Screen>
  );
}
