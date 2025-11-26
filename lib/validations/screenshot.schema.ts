import { z } from 'zod';

/**
 * Page type enum
 */
export const PAGE_TYPES = [
  'Homepage',
  'Product',
  'Category',
  'About',
  'Contact',
  'Other',
] as const;

/**
 * Screenshot capture request schema
 */
export const screenshotCaptureSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Invalid URL format'),
  brandName: z
    .string()
    .min(1, 'Brand Name is required')
    .trim(),
  pageType: z.enum(PAGE_TYPES, {
    message: 'Page Type is required and must be one of the valid options',
  }),
});

/**
 * Screenshot status check query schema
 */
export const screenshotStatusSchema = z.object({
  statusUrl: z
    .string()
    .min(1, 'statusUrl parameter is required')
    .url('Invalid statusUrl format'),
});

/**
 * Type inference from schemas
 */
export type ScreenshotCaptureInput = z.infer<typeof screenshotCaptureSchema>;
export type ScreenshotStatusInput = z.infer<typeof screenshotStatusSchema>;

