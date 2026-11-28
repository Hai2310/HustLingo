import React, { forwardRef, useEffect, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { gameButton } from '@/theme/cosmic';

type Props = Omit<PressableProps, 'children' | 'style' | 'onPressIn' | 'onPressOut'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  faceStyle: StyleProp<ViewStyle>;
  reducedMotion: boolean;
  primary?: boolean;
};

// Expo Router supplies the link props to this outer Pressable. Only the face moves.
export const HomePaperPressable = forwardRef<React.ComponentRef<typeof Pressable>, Props>(
  function HomePaperPressable({ children, style, faceStyle, nativeID, reducedMotion, primary, ...props }, ref) {
    const [offset] = useState(() => new Animated.Value(0));
    const nativeMotion = Platform.OS !== 'web' && !reducedMotion;

    useEffect(() => {
      if (!nativeMotion) offset.setValue(0);
      return () => offset.stopAnimation();
    }, [nativeMotion, offset]);

    const move = (pressed: boolean) => {
      if (!nativeMotion) return;
      Animated.spring(offset, {
        toValue: pressed ? 3 : 0,
        stiffness: pressed ? 380 : 290,
        damping: primary ? 15 : 19,
        mass: 0.55,
        useNativeDriver: true,
        isInteraction: false,
      }).start();
    };

    return (
      <Pressable
        {...props}
        ref={ref}
        nativeID={nativeID}
        onPressIn={() => move(true)}
        onPressOut={() => move(false)}
        style={[styles.hitArea, style]}
      >
        <Animated.View
          nativeID={nativeID && nativeID + '-face'}
          style={[styles.face, faceStyle, nativeMotion && { transform: [{ translateY: offset }] }]}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  hitArea: { overflow: 'hidden', borderRadius: gameButton.borderRadius },
  face: { flexGrow: 1, pointerEvents: 'none' },
});
