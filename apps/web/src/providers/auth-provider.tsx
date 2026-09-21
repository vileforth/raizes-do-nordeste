'use client';

import { UserRole } from '@raizes/shared';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { setTokenGetter } from '@/lib/api';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { apiGet } from '@/lib/api';

export type CurrentUser = {
  id: number;
  email: string;
  name: string;
  roles: UserRole[];
};

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    setTokenGetter(async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });
  }, [supabase]);

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiGet<CurrentUser>('/auth/me'),
    retry: false,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const value = useMemo(
    () => ({
      user: meQuery.data ?? null,
      isLoading: meQuery.isLoading,
      signOut,
    }),
    [meQuery.data, meQuery.isLoading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
