import { NextRequest, NextResponse } from 'next/server';
import { getScreenshotService } from '@/lib/services';
import { getPageService } from '@/lib/services';
import { getBrandService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { screenshotStatusSchema } from '@/lib/validations/screenshot.schema';
import { ValidationError } from '@/lib/errors/app-error';
import type { ScreenshotStatusResponse, APIErrorResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/screenshots/status
 * Check screenshot capture status and upload to storage when complete
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusUrl = searchParams.get('statusUrl');
    const brandId = searchParams.get('brand_id');
    const pageType = searchParams.get('page_type');
    const device = searchParams.get('device') as 'desktop' | 'mobile' | null;

    if (!statusUrl) {
      throw new ValidationError('Missing statusUrl parameter');
    }

    // Validate statusUrl
    const validationResult = screenshotStatusSchema.safeParse({ statusUrl });
    if (!validationResult.success) {
      const errors = validationResult.error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const screenshotService = getScreenshotService();
    const result = await screenshotService.checkStatus(statusUrl);

    // If status is not "succeeded" or "done", return status without image
    if (result.status !== 'succeeded' && result.status !== 'done') {
      return NextResponse.json<ScreenshotStatusResponse>({
        success: true,
        status: result.status,
        renderUrl: null,
        imageData: null,
      });
    }

    // Status is "succeeded" or "done"
    // If we have brand_id, page_type, and device, upload to storage and update page
    if (brandId && pageType && device && result.imageData) {
      try {
        // Get brand to get slug
        const brandService = getBrandService();
        const brand = await brandService.getBrandById(brandId);

        // Upload to Supabase Storage
        const storageUrl = await screenshotService.uploadToStorage(
          result.imageData,
          brand.slug,
          pageType,
          device
        );

        // Update or create page record
        const pageService = getPageService();
        const pages = await pageService.getPagesByBrand(brandId);
        const existingPage = pages.find(
          (p) => p.page_type === pageType && p.is_current
        );

        if (existingPage) {
          // Update existing page
          const updateData: any = {};
          if (device === 'desktop') {
            updateData.desktop_screenshot_url = storageUrl;
          } else {
            updateData.mobile_screenshot_url = storageUrl;
          }
          await pageService.updatePageScreenshots(existingPage.id, updateData);
        } else {
          // Create new page
          await pageService.createPage({
            brand_id: brandId,
            page_type: pageType as any,
            page_url: '', // Will be set by admin
            [device === 'desktop' ? 'desktop_screenshot_url' : 'mobile_screenshot_url']: storageUrl,
            captured_at: new Date().toISOString(),
            is_current: true,
          });
        }
      } catch (uploadError) {
        // Log error but still return the image data
        console.error('Failed to upload to storage:', uploadError);
      }
    }

    // Return with image data
    return NextResponse.json<ScreenshotStatusResponse>({
      success: true,
      status: result.status,
      renderUrl: result.renderUrl || null,
      imageData: result.imageData || null,
    });
  } catch (error) {
    return handleError(error);
  }
}

