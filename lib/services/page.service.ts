import { PageQueries } from '@/lib/clients/supabase.client';
import type { Page, PageWithRelations, CreatePageInput, UpdatePageInput, PageFilters } from '@/types';

/**
 * Page service
 * Handles business logic for page operations
 */
export class PageService {
  constructor(private pageQueries: PageQueries) {}

  /**
   * List pages by type with filters (for discover pages)
   */
  async listPagesByType(filters: PageFilters = {}) {
    return this.pageQueries.listPagesByType(filters);
  }

  /**
   * Get pages by brand ID
   */
  async getPagesByBrand(brandId: string): Promise<Page[]> {
    return this.pageQueries.getPagesByBrand(brandId);
  }

  /**
   * Get page by ID
   * Returns the requested page and its sibling (mobile/desktop) if available
   */
  async getPageById(id: string): Promise<{ page: PageWithRelations; siblingPage: PageWithRelations | null }> {
    return this.pageQueries.getPageById(id);
  }

  /**
   * Create page (admin)
   */
  async createPage(input: CreatePageInput): Promise<Page> {
    return this.pageQueries.createPage(input);
  }
}

