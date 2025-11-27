import { NextRequest, NextResponse } from 'next/server';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/app-error';
import type { GetBrandResponse, APIErrorResponse } from '@/types/api';

/**
 * GET /api/brands/[slug]
 * Get single brand by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const brandService = getBrandService();
    const brand = await brandService.getBrandBySlug(slug);

    const response: GetBrandResponse = {
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

