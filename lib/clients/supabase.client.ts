import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config/env';
import { ExternalApiError, NotFoundError } from '@/lib/errors/app-error';
import type {
  Brand,
  BrandWithPages,
  Page,
  PageWithRelations,
  BrandFilters,
  CreateBrandInput,
  UpdateBrandInput,
  CreatePageInput,
  UpdatePageInput,
  PageFilters,
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
        category_id,
        category_slug,
        page_type,
        search,
        limit = 20,
        offset = 0,
      } = filters;

      let query = this.client
        .from('brands')
        .select('*, category:categories(*), pages(*)', { count: 'exact' })
        .eq('is_published', true);

      if (category_id) {
        query = query.eq('category_id', category_id);
      }

      if (category_slug) {
        query = query.eq('categories.slug', category_slug);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (page_type) {
        // Filter by page type through pages relation
        query = query.eq('pages.page_type_id', page_type);
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
        .select('*, category:categories(*), pages(*)')
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
        .select('*, category:categories(*), pages(*)')
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
          ...(input.description !== undefined && { description: input.description }),
          ...(input.category_id !== undefined && { category_id: input.category_id }),
          ...(input.website_url !== undefined && { website_url: input.website_url }),
          ...(input.logo_url !== undefined && { logo_url: input.logo_url }),
          ...(input.is_published !== undefined && { is_published: input.is_published }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, category:categories(*), pages(*)')
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
   * List pages by type with filters (for discover pages)
   */
  async listPagesByType(filters: PageFilters = {}) {
    try {
      const {
        page_type_slug,
        view = 'mobile', // Default to mobile
        category_slugs,
        month,
        brand_id,
        limit = 20,
        offset = 0,
      } = filters;

      // First, get page_type_id if slug is provided
      let page_type_id: string | undefined;
      if (page_type_slug) {
        const { data: pageType } = await this.client
          .from('page_types')
          .select('id')
          .eq('slug', page_type_slug)
          .single();
        if (pageType) {
          page_type_id = pageType.id;
        }
      }

      // Get brand IDs if category filtering is needed
      let brand_ids: string[] | undefined;
      if (category_slugs && category_slugs.length > 0) {
        // Get category IDs from slugs
        const { data: categories } = await this.client
          .from('categories')
          .select('id')
          .in('slug', category_slugs);
        
        if (categories && categories.length > 0) {
          const category_ids = categories.map((c) => c.id);
          // Get brand IDs for these categories
          const { data: brands } = await this.client
            .from('brands')
            .select('id')
            .in('category_id', category_ids)
            .eq('is_published', true);
          
          if (brands) {
            brand_ids = brands.map((b) => b.id);
          }
        }
      }

      // Start with base query including relations
      let query = this.client
        .from('pages')
        .select(
          '*, brand:brands(*, category:categories(*)), page_type:page_types(*)',
          { count: 'exact' }
        );

      // Filter by page type ID
      if (page_type_id) {
        query = query.eq('page_type_id', page_type_id);
      }

      // Filter by view (mobile/desktop)
      if (view) {
        query = query.eq('view', view);
      }

      // Filter by brand IDs (from category filtering)
      if (brand_ids && brand_ids.length > 0) {
        query = query.in('brand_id', brand_ids);
      } else if (brand_ids && brand_ids.length === 0) {
        // No brands match the category filter, return empty
        return {
          data: [] as PageWithRelations[],
          count: 0,
          hasMore: false,
        };
      }

      // Filter by month
      if (month) {
        query = query.eq('month', month);
      }

      // Filter by brand
      if (brand_id) {
        query = query.eq('brand_id', brand_id);
      }

      // Order by created_at (newest first)
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

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

      return {
        data: (data || []) as PageWithRelations[],
        count: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
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
   * Get pages by brand ID
   */
  async getPagesByBrand(brandId: string) {
    try {
      const { data, error } = await this.client
        .from('pages')
        .select('*, page_type:page_types(*)')
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
        .select('*, brand:brands(*, category:categories(*)), page_type:page_types(*)')
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

      return data as PageWithRelations;
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
      const { data, error } = await this.client
        .from('pages')
        .insert({
          brand_id: input.brand_id,
          page_type_id: input.page_type_id,
          page_url: input.page_url,
          screenshot_url: input.screenshot_url || null,
          view: input.view,
          month: input.month || null,
        })
        .select('*, page_type:page_types(*)')
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

