import { NextRequest, NextResponse } from 'next/server';
import { getPageService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { NotFoundError } from '@/lib/errors/app-error';
import type { GetPageResponse, APIErrorResponse } from '@/types/api';

/**
 * GET /api/pages/[id]
 * Get single page by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    const pageService = getPageService();
    const page = await pageService.getPageById(id);

    const response: GetPageResponse = {
      data: page,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json<APIErrorResponse>(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    return handleError(error);
  }
}

