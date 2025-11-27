import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config/env';

/**
 * Server-side Supabase client
 * Uses service role key to bypass RLS for admin operations
 * Only use this in API routes and server components
 */
export function createServerClient() {
  return createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Get server client instance
 */
export function getServerClient() {
  return createServerClient();
}

