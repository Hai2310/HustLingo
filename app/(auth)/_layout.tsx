import { Stack } from 'expo-router';
import { useMotionPreference } from '@/theme/MotionPreference';

export default function AuthLayout() {
  const reduced = useMotionPreference() !== false;
  return <Stack screenOptions={{ headerShown: false, animation: reduced ? 'none' : 'fade', contentStyle: { backgroundColor: 'transparent' } }} />;
}
