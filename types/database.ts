/**
 * Database types matching Supabase schema
 */

export type BrandTier = 'A' | 'B' | 'C';
export type PageType = 'home' | 'pdp' | 'about';
export type UserPlan = 'free' | 'pro';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category: string;
  country: string;
  website_url: string;
  logo_url: string | null;
  tier: BrandTier;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  brand_id: string;
  page_type: PageType;
  page_url: string;
  desktop_screenshot_url: string | null;
  mobile_screenshot_url: string | null;
  captured_at: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
}

export interface BrandWithPages extends Brand {
  pages?: Page[];
}

