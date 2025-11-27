/**
 * Page-related types
 */

import type { Page, PageType } from './database';

export type { Page, PageType };

/**
 * Page types
 */
export const PAGE_TYPES = ['home', 'pdp', 'about'] as const;

/**
 * Page creation input
 */
export interface CreatePageInput {
  brand_id: string;
  page_type: PageType;
  page_url: string;
  desktop_screenshot_url?: string;
  mobile_screenshot_url?: string;
  captured_at?: string;
  is_current?: boolean;
}

/**
 * Page update input
 */
export interface UpdatePageInput {
  page_url?: string;
  desktop_screenshot_url?: string;
  mobile_screenshot_url?: string;
  captured_at?: string;
  is_current?: boolean;
}

/**
 * Screenshot capture request for admin
 */
export interface CaptureScreenshotRequest {
  brand_id: string;
  page_type: PageType;
  page_url: string;
  capture_desktop?: boolean;
  capture_mobile?: boolean;
}

