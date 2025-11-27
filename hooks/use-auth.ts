'use client';

import { useEffect, useState } from 'react';
import { createClientClient } from '@/lib/clients/supabase.client';
import type { User } from '@supabase/supabase-js';

/**
 * Hook to get current auth state
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const client = createClientClient();

  useEffect(() => {
    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [client]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
}

