import { z } from 'zod';

/**
 * Page creation schema
 */
export const createPageSchema = z.object({
  brand_id: z.string().uuid('Invalid brand ID'),
  page_type: z.enum(['home', 'pdp', 'about'], {
    message: 'Page type must be home, pdp, or about',
  }),
  page_url: z.string().url('Invalid URL'),
  desktop_screenshot_url: z.string().url('Invalid URL').optional().nullable(),
  mobile_screenshot_url: z.string().url('Invalid URL').optional().nullable(),
  captured_at: z.string().datetime().optional(),
  is_current: z.boolean().optional().default(true),
});

/**
 * Page update schema
 */
export const updatePageSchema = z.object({
  page_url: z.string().url().optional(),
  desktop_screenshot_url: z.string().url().optional().nullable(),
  mobile_screenshot_url: z.string().url().optional().nullable(),
  captured_at: z.string().datetime().optional(),
  is_current: z.boolean().optional(),
});

/**
 * Screenshot capture request schema
 */
export const captureScreenshotSchema = z.object({
  brand_id: z.string().uuid('Invalid brand ID'),
  page_type: z.enum(['home', 'pdp', 'about']),
  page_url: z.string().url('Invalid URL'),
  capture_desktop: z.boolean().optional().default(true),
  capture_mobile: z.boolean().optional().default(true),
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
export type CaptureScreenshotSchema = z.infer<typeof captureScreenshotSchema>;

