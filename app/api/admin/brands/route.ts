import { NextRequest, NextResponse } from 'next/server';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { createBrandSchema } from '@/lib/validations/brand.schema';
import { ValidationError } from '@/lib/errors/app-error';
import type { CreateBrandResponse, APIErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/brands
 * Create a new brand (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createBrandSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Create brand
    const brandService = getBrandService();
    const brand = await brandService.createBrand(validatedData);

    const response: CreateBrandResponse = {
      data: brand,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

