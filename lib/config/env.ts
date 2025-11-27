import { z } from 'zod';

/**
 * Check if we're running on the server
 */
const isServer = typeof window === 'undefined';

/**
 * Client-accessible environment variable schema
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required')
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
});

/**
 * Server-only environment variable schema
 */
const serverEnvSchema = z.object({
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
    const missingVars = parsed.error.issues
      .filter((err) => err.code === 'too_small' || err.code === 'invalid_type')
      .map((err) => err.path.join('.'))
      .join(', ');
    
    let errorMessage = `Environment variable validation failed: ${errors}`;
    if (missingVars) {
      errorMessage += `\n\nMissing or invalid variables: ${missingVars}`;
      errorMessage += `\n\nTo fix this:\n`;
      errorMessage += `1. Copy .env.local.example to .env.local\n`;
      errorMessage += `2. Fill in your environment variables\n`;
      errorMessage += `3. Or use Vercel CLI: npx vercel env pull .env.local\n`;
    }
    throw new Error(errorMessage);
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
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    } as Env;
  }

  // On server, validate all variables
  const parsed = fullEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    const missingVars = parsed.error.issues
      .filter((err) => err.code === 'too_small' || err.code === 'invalid_type')
      .map((err) => err.path.join('.'))
      .join(', ');
    
    let errorMessage = `Environment variable validation failed: ${errors}`;
    if (missingVars) {
      errorMessage += `\n\nMissing or invalid variables: ${missingVars}`;
      errorMessage += `\n\nTo fix this:\n`;
      errorMessage += `1. Copy .env.local.example to .env.local\n`;
      errorMessage += `2. Fill in your environment variables\n`;
      errorMessage += `3. Or use Vercel CLI: npx vercel env pull .env.local\n`;
    }
    throw new Error(errorMessage);
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

