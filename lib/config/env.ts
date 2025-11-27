import { z } from 'zod';

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined';

/**
 * Client-accessible environment variable schema
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
});

/**
 * Server-only environment variable schema
 */
const serverEnvSchema = z.object({
  URLBOX_API_SECRET: z.string().min(1, 'URLBOX_API_SECRET is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
});

/**
 * Full environment variable schema (for server-side validation)
 */
const fullEnvSchema = clientEnvSchema.merge(serverEnvSchema);

/**
 * Validated environment variables
 */
type ClientEnv = z.infer<typeof clientEnvSchema>;
type ServerEnv = z.infer<typeof serverEnvSchema>;
type Env = z.infer<typeof fullEnvSchema>;

/**
 * Cached parsed environment variables
 */
let cachedEnv: Env | null = null;
let cachedClientEnv: ClientEnv | null = null;

/**
 * Parse and validate client-accessible environment variables
 */
function parseClientEnv(): ClientEnv {
  if (cachedClientEnv) {
    return cachedClientEnv;
  }

  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Environment variable validation failed: ${errors}`);
  }

  cachedClientEnv = parsed.data;
  return cachedClientEnv;
}

/**
 * Parse and validate all environment variables (server-only)
 * Uses lazy evaluation - only parses when first accessed
 */
function parseEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  // On client, only validate public variables
  if (!isServer) {
    const clientEnv = parseClientEnv();
    // Return a partial env object for client (server vars will be undefined but that's ok)
    return {
      ...clientEnv,
      URLBOX_API_SECRET: process.env.URLBOX_API_SECRET || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    } as Env;
  }

  // On server, validate all variables
  const parsed = fullEnvSchema.safeParse({
    URLBOX_API_SECRET: process.env.URLBOX_API_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Environment variable validation failed: ${errors}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

/**
 * Application configuration
 * Centralized access to environment variables and constants
 * Uses lazy getters to only validate when accessed
 */
export const config = {
  urlbox: {
    get apiSecret() {
      if (!isServer) {
        throw new Error('URLBOX_API_SECRET is only available on the server');
      }
      return parseEnv().URLBOX_API_SECRET;
    },
    baseUrl: 'https://api.urlbox.com/v1',
    asyncEndpoint: 'https://api.urlbox.com/v1/render/async',
  },
  supabase: {
    get url() {
      // Use client env parser for public variables (works on both client and server)
      return parseClientEnv().NEXT_PUBLIC_SUPABASE_URL;
    },
    get anonKey() {
      // Use client env parser for public variables (works on both client and server)
      return parseClientEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY;
    },
    get serviceRoleKey() {
      if (!isServer) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is only available on the server');
      }
      return parseEnv().SUPABASE_SERVICE_ROLE_KEY;
    },
  },
} as const;

/**
 * Type-safe configuration access
 */
export type Config = typeof config;

