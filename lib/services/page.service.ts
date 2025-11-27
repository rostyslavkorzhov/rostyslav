import { PageQueries } from '@/lib/clients/supabase.client';
import type { Page, CreatePageInput, UpdatePageInput } from '@/types';

/**
 * Page service
 * Handles business logic for page operations
 */
export class PageService {
  constructor(private pageQueries: PageQueries) {}

  /**
   * Get pages by brand ID
   */
  async getPagesByBrand(brandId: string): Promise<Page[]> {
    return this.pageQueries.getPagesByBrand(brandId);
  }

  /**
   * Get page by ID
   */
  async getPageById(id: string): Promise<Page & { brand: import('@/types').Brand }> {
    return this.pageQueries.getPageById(id);
  }

  /**
   * Create page (admin)
   */
  async createPage(input: CreatePageInput): Promise<Page> {
    return this.pageQueries.createPage(input);
  }
}

