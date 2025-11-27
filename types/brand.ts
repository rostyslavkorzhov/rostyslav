/**
 * Brand-related types
 */

import type { Brand, BrandWithPages, Category } from './database';

export type { Brand, BrandWithPages, Category };

/**
 * Brand creation input
 */
export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string | null;
  category_id: string;
  website_url: string;
  logo_url?: string | null;
  is_published?: boolean;
}

/**
 * Brand update input
 */
export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  description?: string | null;
  category_id?: string;
  website_url?: string;
  logo_url?: string | null;
  is_published?: boolean;
}

/**
 * Brand filters for listing
 */
export interface BrandFilters {
  category_id?: string;
  category_slug?: string;
  page_type?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

