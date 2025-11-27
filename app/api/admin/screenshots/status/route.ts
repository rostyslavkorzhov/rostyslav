import { NextRequest, NextResponse } from 'next/server';
import { withAdmin } from '@/lib/middleware/auth-middleware';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/app-error';
import type {
  ScreenshotStatusResponse,
  APIErrorResponse,
} from '@/types/api';

/**
 * GET /api/admin/screenshots/status
 * Check screenshot status by statusUrl (admin only)
 */
async function getScreenshotStatusHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusUrl = searchParams.get('statusUrl');

  if (!statusUrl) {
    return NextResponse.json<APIErrorResponse>(
      { error: 'statusUrl query parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch status from the status URL
    // This would typically be a URLBox or similar service status endpoint
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to fetch screenshot status: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();

    // Parse the response and format according to ScreenshotStatusResponse
    // The exact format depends on the screenshot service being used
    const response: ScreenshotStatusResponse = {
      success: true,
      status: statusData.status || 'unknown',
      renderUrl: statusData.render_url || statusData.result?.render_url || null,
      imageData: statusData.image_data || null,
    };

    return NextResponse.json(response);
  } catch (error) {
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
 * POST /api/admin/screenshots/status
 * Check screenshot status by providing statusUrl in body (admin only)
 */
async function postScreenshotStatusHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { statusUrl } = body;

    if (!statusUrl || typeof statusUrl !== 'string') {
      return NextResponse.json<APIErrorResponse>(
        { error: 'statusUrl is required in request body' },
        { status: 400 }
      );
    }

    // Fetch status from the status URL
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to fetch screenshot status: ${statusResponse.statusText}`);
    }

    const statusData = await statusResponse.json();

    const response: ScreenshotStatusResponse = {
      success: true,
      status: statusData.status || 'unknown',
      renderUrl: statusData.render_url || statusData.result?.render_url || null,
      imageData: statusData.image_data || null,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json<APIErrorResponse>(
        { error: error.message, details: error.details },
        { status: 400 }
      );
    }
    return handleError(error);
  }
}

// Export protected handlers
export const GET = withAdmin(getScreenshotStatusHandler);
export const POST = withAdmin(postScreenshotStatusHandler);

