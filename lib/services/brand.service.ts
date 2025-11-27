import { BrandQueries } from '@/lib/clients/supabase.client';
import type { Brand, BrandWithPages, BrandFilters, CreateBrandInput, UpdateBrandInput } from '@/types';

/**
 * Brand service
 * Handles business logic for brand operations
 */
export class BrandService {
  constructor(private brandQueries: BrandQueries) {}

  /**
   * List brands with filters
   */
  async listBrands(filters: BrandFilters = {}) {
    return this.brandQueries.listBrands(filters);
  }

  /**
   * Get brand by slug
   */
  async getBrandBySlug(slug: string): Promise<BrandWithPages> {
    return this.brandQueries.getBrandBySlug(slug);
  }

  /**
   * Get brand by ID
   */
  async getBrandById(id: string): Promise<BrandWithPages> {
    return this.brandQueries.getBrandById(id);
  }
}

