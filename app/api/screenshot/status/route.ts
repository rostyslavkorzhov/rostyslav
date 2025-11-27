import { NextRequest, NextResponse } from 'next/server';
import { screenshotStatusSchema } from '@/lib/validations/screenshot.schema';
import { getScreenshotService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/app-error';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusUrl = searchParams.get('statusUrl');

    if (!statusUrl) {
      throw new ValidationError('Missing statusUrl parameter');
    }

    // Validate statusUrl with Zod schema
    const validationResult = screenshotStatusSchema.safeParse({ statusUrl });
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Get service instance
    const screenshotService = getScreenshotService();

    // Check status
    const result = await screenshotService.checkStatus(validatedData.statusUrl);

    // If status is not "succeeded" or "done", return status without image
    if (result.status !== 'succeeded' && result.status !== 'done') {
      return NextResponse.json({
        success: true,
        status: result.status,
        renderUrl: null,
        imageData: null,
      });
    }

    // Status is "succeeded" or "done", return with image data
    return NextResponse.json({
      success: true,
      status: result.status,
      renderUrl: result.renderUrl || null,
      imageData: result.imageData || null,
    });
  } catch (error) {
    return handleError(error);
  }
}
