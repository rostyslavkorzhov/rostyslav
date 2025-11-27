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
   * Get brand by ID (admin)
   */
  async getBrandById(id: string): Promise<BrandWithPages> {
    return this.brandQueries.getBrandById(id);
  }

  /**
   * Create brand (admin)
   */
  async createBrand(input: CreateBrandInput): Promise<Brand> {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(input.slug)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    return this.brandQueries.createBrand(input);
  }

  /**
   * Update brand (admin)
   */
  async updateBrand(id: string, input: UpdateBrandInput): Promise<Brand> {
    if (input.slug && !/^[a-z0-9-]+$/.test(input.slug)) {
      throw new Error('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    return this.brandQueries.updateBrand(id, input);
  }

  /**
   * Delete brand (admin)
   */
  async deleteBrand(id: string): Promise<void> {
    return this.brandQueries.deleteBrand(id);
  }
}

