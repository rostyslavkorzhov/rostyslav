import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config/env';
import { ExternalApiError, NotFoundError } from '@/lib/errors/app-error';
import type {
  Brand,
  BrandWithPages,
  Page,
  BrandFilters,
  CreateBrandInput,
  UpdateBrandInput,
  CreatePageInput,
  UpdatePageInput,
} from '@/types';

/**
 * Client-side Supabase client
 * Uses anon key and respects RLS policies
 * Use this in client components and hooks
 */
export function createClientClient() {
  return createClient(config.supabase.url, config.supabase.anonKey);
}

/**
 * Get client instance (for client-side use)
 */
export function getClient() {
  return createClientClient();
}

/**
 * Brand queries
 */
export class BrandQueries {
  constructor(private client: SupabaseClient) {}

  /**
   * List brands with filters
   */
  async listBrands(filters: BrandFilters = {}) {
    try {
      const {
        category,
        country,
        page_type,
        search,
        limit = 20,
        offset = 0,
      } = filters;

      let query = this.client
        .from('brands')
        .select('*, pages(*)', { count: 'exact' })
        .eq('is_published', true);

      if (category) {
        query = query.eq('category', category);
      }

      if (country) {
        query = query.eq('country', country);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (page_type) {
        query = query.eq('pages.page_type', page_type).eq('pages.is_current', true);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new ExternalApiError(
          'Failed to fetch brands',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      return {
        data: (data || []) as BrandWithPages[],
        count: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while fetching brands',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get brand by slug
   */
  async getBrandBySlug(slug: string) {
    try {
      const { data, error } = await this.client
        .from('brands')
        .select('*, pages(*)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        // Supabase returns PGRST116 when .single() finds no rows
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          throw new NotFoundError('Brand not found');
        }
        throw new ExternalApiError(
          'Failed to fetch brand',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          }
        );
      }

      if (!data) {
        throw new NotFoundError('Brand not found');
      }

      return data as BrandWithPages;
    } catch (error) {
      // Re-throw NotFoundError and ExternalApiError as-is
      if (error instanceof NotFoundError || error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while fetching brand',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get brand by ID (admin only - bypasses RLS)
   */
  async getBrandById(id: string) {
    try {
      const { data, error } = await this.client
        .from('brands')
        .select('*, pages(*)')
        .eq('id', id)
        .single();

      if (error) {
        throw new ExternalApiError(
          'Failed to fetch brand',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      return data as BrandWithPages;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while fetching brand',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Update brand by ID (admin only)
   */
  async updateBrand(id: string, input: UpdateBrandInput) {
    try {
      const { data, error } = await this.client
        .from('brands')
        .update({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.category !== undefined && { category: input.category }),
          ...(input.country !== undefined && { country: input.country }),
          ...(input.website_url !== undefined && { website_url: input.website_url }),
          ...(input.logo_url !== undefined && { logo_url: input.logo_url }),
          ...(input.tier !== undefined && { tier: input.tier }),
          ...(input.is_published !== undefined && { is_published: input.is_published }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, pages(*)')
        .single();

      if (error) {
        // Check if brand doesn't exist
        if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
          throw new NotFoundError('Brand not found');
        }
        throw new ExternalApiError(
          'Failed to update brand',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          }
        );
      }

      if (!data) {
        throw new NotFoundError('Brand not found');
      }

      return data as BrandWithPages;
    } catch (error) {
      // Re-throw NotFoundError and ExternalApiError as-is
      if (error instanceof NotFoundError || error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while updating brand',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

}

/**
 * Page queries
 */
export class PageQueries {
  constructor(private client: SupabaseClient) {}

  /**
   * Get pages by brand ID
   */
  async getPagesByBrand(brandId: string) {
    try {
      const { data, error } = await this.client
        .from('pages')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new ExternalApiError(
          'Failed to fetch pages',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      return (data || []) as Page[];
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while fetching pages',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get page by ID
   */
  async getPageById(id: string) {
    try {
      const { data, error } = await this.client
        .from('pages')
        .select('*, brand:brands(*)')
        .eq('id', id)
        .single();

      if (error) {
        throw new ExternalApiError(
          'Failed to fetch page',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      return data as Page & { brand: Brand };
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while fetching page',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Create page (admin only)
   */
  async createPage(input: CreatePageInput) {
    try {
      // If this is marked as current, unset other current pages of same type
      if (input.is_current) {
        await this.client
          .from('pages')
          .update({ is_current: false })
          .eq('brand_id', input.brand_id)
          .eq('page_type', input.page_type);
      }

      const { data, error } = await this.client
        .from('pages')
        .insert({
          brand_id: input.brand_id,
          page_type: input.page_type,
          page_url: input.page_url,
          desktop_screenshot_url: input.desktop_screenshot_url || null,
          mobile_screenshot_url: input.mobile_screenshot_url || null,
          captured_at: input.captured_at || new Date().toISOString(),
          is_current: input.is_current ?? true,
        })
        .select()
        .single();

      if (error) {
        throw new ExternalApiError(
          'Failed to create page',
          'Supabase',
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );
      }

      return data as Page;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while creating page',
        'Supabase',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

}

