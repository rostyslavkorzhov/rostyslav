/**
 * Brand-related types
 */

import type { Brand, BrandTier, BrandWithPages } from './database';

export type { Brand, BrandTier, BrandWithPages };

/**
 * Brand categories
 */
export const BRAND_CATEGORIES = [
  'Fashion & Apparel',
  'Beauty & Skincare',
  'Food & Beverage',
  'Health & Wellness',
  'Home & Living',
  'Electronics',
  'Sports & Outdoors',
  'Baby & Kids',
  'Pets',
  'Other',
] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

/**
 * Countries
 */
export const COUNTRIES = [
  'Global',
  'US',
  'UK',
  'EU',
  'Canada',
  'Australia',
] as const;

export type Country = (typeof COUNTRIES)[number];

/**
 * Brand creation input
 */
export interface CreateBrandInput {
  name: string;
  slug: string;
  category: string;
  country?: string;
  website_url: string;
  logo_url?: string | null;
  tier?: BrandTier;
  is_published?: boolean;
}

/**
 * Brand update input
 */
export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  category?: string;
  country?: string;
  website_url?: string;
  logo_url?: string | null;
  tier?: BrandTier;
  is_published?: boolean;
}

/**
 * Brand filters for listing
 */
export interface BrandFilters {
  category?: string;
  country?: string;
  page_type?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

