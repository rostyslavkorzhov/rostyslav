import { NextRequest, NextResponse } from 'next/server';
import { getPageService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import type { PageTypeSlug } from '@/types';

/**
 * GET /api/discover/[type]
 * List pages by type (product, home, about) with filters
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { type } = await params;

    // Validate page type
    const validTypes: PageTypeSlug[] = ['product', 'home', 'about'];
    if (!validTypes.includes(type as PageTypeSlug)) {
      return NextResponse.json(
        { error: 'Invalid page type. Must be product, home, or about' },
        { status: 400 }
      );
    }

    // Parse filters
    const view = (searchParams.get('view') || 'mobile') as 'mobile' | 'desktop';
    const categorySlugs = searchParams.get('categories')
      ? searchParams.get('categories')!.split(',').map((s) => s.trim())
      : undefined;
    const month = searchParams.get('month') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const pageService = getPageService();
    const result = await pageService.listPagesByType({
      page_type_slug: type as PageTypeSlug,
      view,
      category_slugs: categorySlugs,
      month,
      limit,
      offset,
    });

    return NextResponse.json({
      data: result.data,
      count: result.count,
      hasMore: result.hasMore,
    });
  } catch (error) {
    console.error('Error in GET /api/discover/[type]:', error);
    return handleError(error);
  }
}

