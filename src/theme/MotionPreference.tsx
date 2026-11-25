import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

const MotionPreference = createContext<boolean | null>(null);

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    let pending = true;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      pending = false;
      setReduced(value);
    });
    const resolve = (value: boolean) => { if (pending) setReduced(value); };
    void AccessibilityInfo.isReduceMotionEnabled().then(resolve, () => resolve(true));
    return () => {
      pending = false;
      subscription?.remove();
    };
  }, []);

  return <MotionPreference.Provider value={reduced}>{children}</MotionPreference.Provider>;
}

export function useMotionPreference() {
  return useContext(MotionPreference);
}
