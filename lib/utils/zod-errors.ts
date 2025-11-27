import { ZodError } from 'zod';

/**
 * Extract field-level errors from a ZodError into a key-value object
 * 
 * @example
 * ```ts
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const errors = extractFieldErrors(result.error);
 *   // errors = { email: "Invalid email", password: "Required" }
 * }
 * ```
 */
export function extractFieldErrors<T extends Record<string, string>>(
  error: ZodError
): Partial<T> {
  const errors: Partial<T> = {};
  
  error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof T;
    if (field && typeof field === 'string') {
      errors[field] = issue.message as T[keyof T];
    }
  });
  
  return errors;
}

/**
 * Type-safe helper to check if a Zod safeParse result succeeded
 * This provides better type narrowing than checking `!result.success`
 */
export function isZodSuccess<T>(
  result: { success: true; data: T } | { success: false; error: ZodError }
): result is { success: true; data: T } {
  return result.success;
}

