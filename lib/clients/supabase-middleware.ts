import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config/env';

/**
 * Create a Supabase client for Next.js proxy
 * This client can read and write cookies, which is required for session refresh
 * 
 * IMPORTANT: Use this only in proxy.ts. For other contexts, use:
 * - createAuthClient() for API routes
 * - createServerClient() for Server Components
 * - createClientClient() for Client Components
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  return createServerClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Update request cookies (for reading in proxy)
            request.cookies.set(name, value);
            // Update response cookies (for sending to browser)
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

