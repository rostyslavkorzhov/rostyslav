import { NextRequest, NextResponse } from 'next/server';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { updateBrandSchema } from '@/lib/validations/brand.schema';
import { ValidationError, NotFoundError } from '@/lib/errors/app-error';
import type { UpdateBrandResponse, APIErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/admin/brands/[id]
 * Update a brand (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateBrandSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Update brand
    const brandService = getBrandService();
    const brand = await brandService.updateBrand(id, validatedData);

    const response: UpdateBrandResponse = {
      data: brand,
    };

    return NextResponse.json(response);
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

/**
 * DELETE /api/admin/brands/[id]
 * Delete a brand (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    const brandService = getBrandService();
    await brandService.deleteBrand(id);

    return NextResponse.json({ success: true }, { status: 200 });
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

