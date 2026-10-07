import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = (
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

const fallbackUrl = 'https://example.supabase.co';
const fallbackKey = 'missing-supabase-publishable-key';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseKey || fallbackKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'implicit',
    },
  }
);

let appStateHooked = false;
if (!appStateHooked && typeof globalThis !== 'undefined') {
  appStateHooked = true;
  AppState.addEventListener('change', state => {
    if (!supabaseConfigured) return;
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

export function requireSupabaseConfig() {
  if (!supabaseConfigured) {
    throw new Error(
      'Supabase chưa được cấu hình. Hãy tạo file .env và điền EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
    );
  }
}
