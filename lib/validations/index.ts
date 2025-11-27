/**
 * Validation schemas module exports
 */
export * from './page.schema';
export * from './auth.schema';

/**
 * Re-export Zod error utilities for convenience
 */
export { extractFieldErrors, isZodSuccess } from '@/lib/utils/zod-errors';

