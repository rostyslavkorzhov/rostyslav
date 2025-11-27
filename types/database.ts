/**
 * Database types matching Supabase schema
 */

export type ViewType = 'mobile' | 'desktop';
export type PageTypeSlug = 'home' | 'product' | 'about';
export type UserPlan = 'free' | 'pro';

/**
 * Category table
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

/**
 * Page type table
 */
export interface PageType {
  id: string;
  name: string;
  slug: PageTypeSlug;
  created_at: string;
}

/**
 * Brand table
 */
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  website_url: string;
  logo_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Brand with category relation
 */
export interface BrandWithCategory extends Brand {
  category: Category;
}

/**
 * Page table
 */
export interface Page {
  id: string;
  brand_id: string;
  page_type_id: string;
  page_url: string;
  screenshot_url: string | null;
  view: ViewType;
  month: string | null; // e.g., "Nov", "Dec", "Jan"
  created_at: string;
  updated_at: string;
}

/**
 * Page with relations
 */
export interface PageWithRelations extends Page {
  brand: BrandWithCategory;
  page_type: PageType;
}

/**
 * User table
 */
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
}

/**
 * Brand with pages relation
 */
export interface BrandWithPages extends Brand {
  category?: Category;
  pages?: Page[];
}

