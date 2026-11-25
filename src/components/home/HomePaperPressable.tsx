import React, { forwardRef, useEffect, useState } from 'react';
import { Animated, Easing, Platform, Pressable, StyleSheet } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { paperButton } from '@/theme/hum';

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
      Animated.timing(offset, {
        toValue: pressed ? 3 : 0,
        duration: pressed ? 75 : primary ? 160 : 130,
        easing: !pressed && primary ? Easing.out(Easing.back(1.35)) : Easing.out(Easing.quad),
        useNativeDriver: true,
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
  hitArea: { overflow: 'hidden', borderRadius: paperButton.borderRadius },
  face: { flexGrow: 1, pointerEvents: 'none' },
});
