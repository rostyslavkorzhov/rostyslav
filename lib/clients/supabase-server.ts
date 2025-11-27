import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config/env';

/**
 * Server-side Supabase client
 * Uses service role key to bypass RLS for admin operations
 * 
 * IMPORTANT SECURITY NOTES:
 * - This client uses the service role key which BYPASSES all RLS policies
 * - Only use this AFTER authentication and authorization have been verified
 * - Never use this client to verify user identity or sessions
 * - Use createAuthClient() from '@/lib/clients/supabase-server-auth' for session verification
 * 
 * USE CASES:
 * - Admin operations after verifying user has admin role
 * - Server-side data operations that require bypassing RLS
 * - Background jobs and automated tasks
 * 
 * DO NOT USE FOR:
 * - User authentication/session verification (use createAuthClient instead)
 * - Public API endpoints without auth checks
 * - Any operation without prior auth/authorization verification
 * 
 * Example:
 * ```typescript
 * // ✅ CORRECT: Verify auth first, then use service role client
 * const user = await requireAdmin(request); // Verifies admin
 * const supabase = createServerClient(); // Safe to use after verification
 * 
 * // ❌ WRONG: Using service role without auth check
 * const supabase = createServerClient(); // Insecure!
 * ```
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
 * 
 * @see createServerClient() for important security notes
 */
export function getServerClient() {
  return createServerClient();
}

