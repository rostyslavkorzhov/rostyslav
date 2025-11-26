import { z } from 'zod';

/**
 * Environment variable schema for validation
 * Note: AI API keys are optional - validation happens at runtime when needed
 */
const envSchema = z.object({
  // URLBox configuration
  URLBOX_API_SECRET: z.string().min(1, 'URLBOX_API_SECRET is required'),
  
  // AI API keys (optional - at least one should be provided for AI features)
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
});

/**
 * Validated environment variables
 */
type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 */
function parseEnv(): Env {
  const parsed = envSchema.safeParse({
    URLBOX_API_SECRET: process.env.URLBOX_API_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Environment variable validation failed: ${errors}`);
  }

  return parsed.data;
}

/**
 * Application configuration
 * Centralized access to environment variables and constants
 */
export const config = {
  urlbox: {
    apiSecret: parseEnv().URLBOX_API_SECRET,
    baseUrl: 'https://api.urlbox.com/v1',
    asyncEndpoint: 'https://api.urlbox.com/v1/render/async',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o',
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseUrl: 'https://api.anthropic.com/v1',
    model: 'claude-3-5-sonnet-20241022',
    version: '2023-06-01',
  },
} as const;

/**
 * Type-safe configuration access
 */
export type Config = typeof config;

