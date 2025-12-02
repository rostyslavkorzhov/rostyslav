import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/lib/config/env';
import { ExternalApiError, NotFoundError } from '@/lib/errors/app-error';
import type {
  Page,
  PageWithRelations,
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
 * Page queries
 */
export class PageQueries {
  constructor(private client: SupabaseClient) {}

  /**
   * List pages by type with filters (for discover pages)
   * Optimized: Single query with inner joins instead of 4 sequential queries
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

      // Single optimized query with inner joins
      // Use !inner to filter directly on related table columns
      let query = this.client
        .from('pages')
        .select(
          `*,
          brand:brands!inner(*, category:categories!inner(*)),
          page_type:page_types!inner(*)`,
          { count: 'exact' }
        )
        .eq('view', view)
        .eq('brand.is_published', true);

      // Filter by page type slug directly (no need to fetch page_type_id first)
      if (page_type_slug) {
        query = query.eq('page_type.slug', page_type_slug);
      }

      // Filter by category slugs directly (no need to fetch category IDs and brand IDs first)
      if (category_slugs && category_slugs.length > 0) {
        query = query.in('brand.category.slug', category_slugs);
      }

      // Filter by month
      if (month) {
        query = query.eq('month', month);
      }

      // Filter by brand ID
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
   * Also fetches the sibling page (same brand_id, page_type_id, page_url, different view)
   */
  async getPageById(id: string) {
    try {
      const { data, error } = await this.client
        .from('pages')
        .select('*, brand:brands(*, category:categories(*)), page_type:page_types(*)')
        .eq('id', id)
        .single();

      if (error) {
        // Check if this is a "not found" error (PGRST116 is Supabase's code for no rows returned)
        if (error.code === 'PGRST116' || error.message?.includes('No rows returned')) {
          throw new NotFoundError('Page not found');
        }
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

      const page = data as PageWithRelations;

      // Fetch sibling page (same brand_id, page_type_id, page_url, but different view)
      const siblingView = page.view === 'mobile' ? 'desktop' : 'mobile';
      const { data: siblingData, error: siblingError } = await this.client
        .from('pages')
        .select('*, brand:brands(*, category:categories(*)), page_type:page_types(*)')
        .eq('brand_id', page.brand_id)
        .eq('page_type_id', page.page_type_id)
        .eq('page_url', page.page_url)
        .eq('view', siblingView)
        .maybeSingle();

      // Sibling page not found is not an error, just return null
      const siblingPage = siblingError ? null : (siblingData as PageWithRelations | null);

      return {
        page,
        siblingPage,
      };
    } catch (error) {
      // Re-throw NotFoundError and ExternalApiError as-is
      if (error instanceof NotFoundError || error instanceof ExternalApiError) {
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

