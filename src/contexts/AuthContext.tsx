import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from '@/types';
import {
  requireSupabaseConfig,
  supabase,
  supabaseConfigured,
} from '@/services/supabase';
import { supabaseData } from '@/services/supabaseData';

const GUEST_PROFILE_KEY = 'hustlingo_guest_profile_v1';

const DEFAULT_GUEST: User = {
  id: 'guest-local',
  email: null,
  displayName: 'Bạn',
  role: 'learner',
  status: 'active',
  englishLevel: 'A1',
  learningGoal: 'Học tập',
  dailyMinutes: 15,
};

interface SignUpResult {
  requiresEmailVerification: boolean;
}

interface AuthContextValue {
  user: User;
  loading: boolean;
  configured: boolean;
  isGuest: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(displayName: string, email: string, password: string): Promise<SignUpResult>;
  signOut(): Promise<void>;
  refreshUser(): Promise<User>;
  updateProfile(
    payload: Partial<
      Pick<User, 'displayName' | 'englishLevel' | 'learningGoal' | 'dailyMinutes'>
    >
  ): Promise<User>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadGuestProfile(): Promise<User> {
  const raw = await AsyncStorage.getItem(GUEST_PROFILE_KEY).catch(() => null);
  if (!raw) return DEFAULT_GUEST;

  try {
    return { ...DEFAULT_GUEST, ...(JSON.parse(raw) as Partial<User>), id: DEFAULT_GUEST.id };
  } catch {
    return DEFAULT_GUEST;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Guest mode is the default so the UI is usable even when Supabase is not
  // configured yet or the visitor has not created an account.
  const [user, setUser] = useState<User>(DEFAULT_GUEST);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User> => {
    if (!supabaseConfigured) {
      const guest = await loadGuestProfile();
      setUser(guest);
      return guest;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const guest = await loadGuestProfile();
      setUser(guest);
      return guest;
    }

    const profile = await supabaseData.getProfile();
    if (profile.status === 'disabled') {
      await supabase.auth.signOut();
      const guest = await loadGuestProfile();
      setUser(guest);
      throw new Error('Tài khoản này đã bị vô hiệu hóa.');
    }

    setUser(profile);
    return profile;
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        let nextUser = await loadGuestProfile();

        if (supabaseConfigured) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            const profile = await supabaseData.getProfile();
            if (profile.status === 'active') nextUser = profile;
          }
        }

        if (mounted) setUser(nextUser);
      } catch {
        if (mounted) setUser(await loadGuestProfile());
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        loadGuestProfile().then(guest => {
          if (mounted) setUser(guest);
        });
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        setTimeout(() => {
          refreshUser().catch(() => null);
        }, 0);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshUser]);

  const isGuest = user.id === DEFAULT_GUEST.id;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: supabaseConfigured,
      isGuest,

      async signIn(email, password) {
        requireSupabaseConfig();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshUser();
      },

      async signUp(displayName, email, password) {
        requireSupabaseConfig();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              full_name: displayName,
            },
          },
        });
        if (error) throw error;
        if (!data.session) return { requiresEmailVerification: true };
        await refreshUser();
        return { requiresEmailVerification: false };
      },

      async signOut() {
        if (supabaseConfigured && !isGuest) await supabase.auth.signOut();
        const guest = await loadGuestProfile();
        setUser(guest);
      },

      refreshUser,

      async updateProfile(payload) {
        if (isGuest) {
          const updated: User = { ...user, ...payload, id: DEFAULT_GUEST.id };
          await AsyncStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(updated));
          setUser(updated);
          return updated;
        }

        const updated = await supabaseData.updateProfile(payload);
        setUser(updated);
        return updated;
      },
    }),
    [user, loading, isGuest, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
