import { NextRequest, NextResponse } from 'next/server';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import type { GetBrandsResponse, APIErrorResponse } from '@/types/api';

/**
 * GET /api/brands
 * List brands with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      category: searchParams.get('category') || undefined,
      country: searchParams.get('country') || undefined,
      page_type: searchParams.get('page_type') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '20', 10),
      offset: parseInt(searchParams.get('offset') || '0', 10),
    };

    const brandService = getBrandService();
    const result = await brandService.listBrands(filters);

    const response: GetBrandsResponse = {
      data: result.data,
      count: result.count,
      hasMore: result.hasMore,
    };

    return NextResponse.json(response);
  } catch (error) {
    // Log the error for debugging
    console.error('Error in GET /api/brands:', error);
    return handleError(error);
  }
}

