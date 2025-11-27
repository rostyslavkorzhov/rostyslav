import { NextRequest, NextResponse } from 'next/server';
import { getScreenshotService } from '@/lib/services';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { captureScreenshotSchema } from '@/lib/validations/page.schema';
import { ValidationError } from '@/lib/errors/app-error';
import type { ScreenshotCaptureResponse, APIErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/screenshots
 * Capture screenshot(s) for a brand page (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = captureScreenshotSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Get brand to get slug for storage path
    const brandService = getBrandService();
    const brand = await brandService.getBrandById(validatedData.brand_id);

    // Capture screenshots
    const screenshotService = getScreenshotService();
    const results = await screenshotService.captureBoth(validatedData);

    // Return first result (for now, we'll handle both in the status endpoint)
    const firstResult = results.desktop || results.mobile;
    if (!firstResult) {
      throw new ValidationError('No screenshots to capture');
    }

    const response: ScreenshotCaptureResponse = {
      success: true,
      renderId: firstResult.renderId,
      statusUrl: firstResult.statusUrl,
      metadata: {
        brand_id: validatedData.brand_id,
        page_type: validatedData.page_type,
        page_url: validatedData.page_url,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}

