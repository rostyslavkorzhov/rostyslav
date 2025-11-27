import { z } from 'zod';
import { BRAND_CATEGORIES, COUNTRIES } from '@/types/brand';

/**
 * Brand creation schema
 */
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  category: z.enum([...BRAND_CATEGORIES] as [string, ...string[]], {
    message: 'Invalid category',
  }),
  country: z.enum([...COUNTRIES] as [string, ...string[]]).optional().default('Global'),
  website_url: z.string().url('Invalid URL'),
  logo_url: z.string().url('Invalid URL').optional().nullable(),
  tier: z.enum(['A', 'B', 'C']).optional().default('A'),
  is_published: z.boolean().optional().default(false),
});

/**
 * Brand update schema (all fields optional)
 */
export const updateBrandSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  category: z.enum([...BRAND_CATEGORIES] as [string, ...string[]]).optional(),
  country: z.enum([...COUNTRIES] as [string, ...string[]]).optional(),
  website_url: z.string().url().optional(),
  logo_url: z.string().url().optional().nullable(),
  tier: z.enum(['A', 'B', 'C']).optional(),
  is_published: z.boolean().optional(),
});

export type CreateBrandSchema = z.infer<typeof createBrandSchema>;
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;

