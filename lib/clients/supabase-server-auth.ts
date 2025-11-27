import { createServerClient as createSSRClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { config } from '@/lib/config/env';
import type { User } from '@supabase/supabase-js';

/**
 * Server-side Supabase client for authentication
 * Reads user sessions from request cookies using @supabase/ssr
 * Uses anon key to respect RLS and session context
 * 
 * IMPORTANT: This client is for verifying user identity and reading user sessions.
 * Do NOT use this for admin operations that bypass RLS - use createServerClient() instead.
 */
export function createAuthClient(request: NextRequest) {
  // Create a cookie store from request headers for API routes
  const cookieStore = createCookieStoreFromRequest(request);

  // Create client with anon key (respects user sessions)
  const supabase = createSSRClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // No-op in API routes - cookies are managed client-side
        },
        remove(name: string, options: any) {
          // No-op in API routes - cookies are managed client-side
        },
      },
    }
  );

  return supabase;
}

/**
 * Get authenticated user from request
 * Returns null if not authenticated
 */
export async function getAuthenticatedUserFromRequest(
  request: NextRequest
): Promise<User | null> {
  const supabase = createAuthClient(request);
  
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

/**
 * Create a cookie store adapter from NextRequest for API routes
 * This allows @supabase/ssr to read cookies from the request
 */
function createCookieStoreFromRequest(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookiesMap = parseCookies(cookieHeader);

  return {
    get: (name: string) => {
      const value = cookiesMap[name];
      return value ? { name, value } : undefined;
    },
  };
}

/**
 * Parse cookie string into object
 * Handles URL-encoded values and multiple cookie formats
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach((cookie) => {
    const trimmedCookie = cookie.trim();
    if (!trimmedCookie) return;
    
    const equalIndex = trimmedCookie.indexOf('=');
    if (equalIndex === -1) return;
    
    const key = trimmedCookie.substring(0, equalIndex).trim();
    const value = trimmedCookie.substring(equalIndex + 1).trim();
    
    if (key && value) {
      try {
        cookies[key] = decodeURIComponent(value);
      } catch {
        // If decoding fails, use raw value
        cookies[key] = value;
      }
    }
  });

  return cookies;
}

