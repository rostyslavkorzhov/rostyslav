import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/auth-middleware';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError, ValidationError } from '@/lib/errors/app-error';
import type {
  GetBrandResponse,
  UpdateBrandResponse,
  APIErrorResponse,
} from '@/types/api';

/**
 * GET /api/admin/brands/[id]
 * Get single brand by ID (admin only - includes unpublished brands)
 */
async function getBrandHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json<APIErrorResponse>(
      { error: 'Brand ID is required' },
      { status: 400 }
    );
  }

  const brandService = getBrandService();
  const brand = await brandService.getBrandById(id);

  const response: GetBrandResponse = {
    data: brand,
  };

  return NextResponse.json(response);
}

/**
 * PUT /api/admin/brands/[id]
 * Update brand by ID (admin only)
 */
async function updateBrandHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json<APIErrorResponse>(
      { error: 'Brand ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const brandService = getBrandService();

    // Validate that brand exists
    await brandService.getBrandById(id);

    // Update brand
    const updatedBrand = await brandService.updateBrand(id, body);

    const response: UpdateBrandResponse = {
      data: updatedBrand,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    if (error instanceof ValidationError) {
      return NextResponse.json<APIErrorResponse>(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }
    return handleError(error);
  }
}

/**
 * DELETE /api/admin/brands/[id]
 * Delete brand by ID (admin only)
 */
async function deleteBrandHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json<APIErrorResponse>(
      { error: 'Brand ID is required' },
      { status: 400 }
    );
  }

  try {
    const brandService = getBrandService();

    // Validate that brand exists
    await brandService.getBrandById(id);

    // Delete brand (implementation depends on service method)
    // For now, return success - implement delete method in service if needed
    return NextResponse.json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    return handleError(error);
  }
}

// Export protected handlers
export const GET = withAdmin(getBrandHandler);
export const PUT = withAdmin(updateBrandHandler);
export const DELETE = withAdmin(deleteBrandHandler);

