import { NextRequest, NextResponse } from 'next/server';
import { screenshotCaptureSchema } from '@/lib/validations/screenshot.schema';
import { getScreenshotService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/app-error';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = screenshotCaptureSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Get service instance
    const screenshotService = getScreenshotService();

    // Capture screenshot (desktop by default)
    const result = await screenshotService.capture(validatedData.url, 'desktop');

    // Return success response (maintain backward compatibility with client)
    return NextResponse.json({
      success: true,
      renderId: result.renderId,
      statusUrl: result.statusUrl,
      metadata: {
        url: validatedData.url,
        brandName: validatedData.brandName,
        pageType: validatedData.pageType,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
