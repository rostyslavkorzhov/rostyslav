import { createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { config } from '@/lib/config/env';

/**
 * Create a Supabase client for Server Components
 * Reads user sessions from cookies using @supabase/ssr
 * Uses anon key to respect RLS and session context
 * 
 * IMPORTANT: This client is for verifying user identity and reading user sessions in Server Components.
 * Do NOT use this for admin operations that bypass RLS - use createServerClient() instead.
 */
export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createSSRClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

