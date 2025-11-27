/**
 * Page-related types
 */

import type { Page, PageType, ViewType, PageTypeSlug } from './database';

export type { Page, PageType, ViewType, PageTypeSlug };

/**
 * Page type slugs
 */
export const PAGE_TYPE_SLUGS: PageTypeSlug[] = ['home', 'product', 'about'];

/**
 * View types
 */
export const VIEW_TYPES: ViewType[] = ['mobile', 'desktop'];

/**
 * Page creation input
 */
export interface CreatePageInput {
  brand_id: string;
  page_type_id: string;
  page_url: string;
  screenshot_url?: string | null;
  view: ViewType;
  month?: string | null; // e.g., "Nov", "Dec", "Jan"
}

/**
 * Page update input
 */
export interface UpdatePageInput {
  page_url?: string;
  screenshot_url?: string | null;
  view?: ViewType;
  month?: string | null;
}

/**
 * Page filters for listing
 */
export interface PageFilters {
  page_type_slug?: PageTypeSlug;
  view?: ViewType;
  category_slugs?: string[]; // Array of category slugs
  month?: string;
  brand_id?: string;
  limit?: number;
  offset?: number;
}

/**
 * Screenshot capture request for admin
 */
export interface CaptureScreenshotRequest {
  brand_id: string;
  page_type_slug: PageTypeSlug;
  page_url: string;
  capture_desktop?: boolean;
  capture_mobile?: boolean;
}

