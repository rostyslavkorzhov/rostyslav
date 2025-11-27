import { URLBoxClient } from '@/lib/clients/urlbox.client';
import { getServerClient } from '@/lib/clients/supabase-server';
import { ValidationError, ExternalApiError } from '@/lib/errors/app-error';
import type { CaptureScreenshotRequest } from '@/types/page';
import type { URLBoxRenderResponse, URLBoxStatusResponse } from '@/types/services';

/**
 * Screenshot service
 * Handles business logic for screenshot capture and status checking
 */
export class ScreenshotService {
  constructor(private urlboxClient: URLBoxClient) {}

  /**
   * Capture a screenshot (desktop or mobile)
   * @param url - URL to capture
   * @param device - 'desktop' or 'mobile'
   * @returns Promise with renderId and statusUrl
   */
  async capture(url: string, device: 'desktop' | 'mobile' = 'desktop'): Promise<URLBoxRenderResponse> {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      throw new ValidationError('Invalid URL format', { url });
    }

    try {
      // Call URLBox API to capture screenshot
      const options = {
        format: 'webp' as const,
        fullPage: true,
        quality: 100,
        ...(device === 'mobile' && {
          width: 375,
          height: 812,
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        }),
      };

      const result = await this.urlboxClient.captureScreenshot(url, options);

      return result;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to capture screenshot',
        'ScreenshotService',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Capture both desktop and mobile screenshots
   * @param request - Screenshot capture request
   * @returns Promise with renderIds and statusUrls for both devices
   */
  async captureBoth(request: CaptureScreenshotRequest): Promise<{
    desktop?: URLBoxRenderResponse;
    mobile?: URLBoxRenderResponse;
  }> {
    const results: {
      desktop?: URLBoxRenderResponse;
      mobile?: URLBoxRenderResponse;
    } = {};

    if (request.capture_desktop !== false) {
      results.desktop = await this.capture(request.page_url, 'desktop');
    }

    if (request.capture_mobile !== false) {
      results.mobile = await this.capture(request.page_url, 'mobile');
    }

    return results;
  }

  /**
   * Check the status of a screenshot render
   * @param statusUrl - Status URL from capture response
   * @returns Promise with status and optional image data
   */
  async checkStatus(
    statusUrl: string
  ): Promise<URLBoxStatusResponse & { imageData?: string }> {
    // Validate statusUrl
    try {
      new URL(statusUrl);
    } catch {
      throw new ValidationError('Invalid statusUrl format', { statusUrl });
    }

    try {
      // Check status with URLBox
      const statusResponse = await this.urlboxClient.checkStatus(statusUrl);

      // If status is not "succeeded" or "done", return status without image
      if (statusResponse.status !== 'succeeded' && statusResponse.status !== 'done') {
        return {
          ...statusResponse,
        };
      }

      // Status is "succeeded" or "done", fetch the actual image
      if (!statusResponse.renderUrl) {
        throw new ExternalApiError(
          'Render complete but no renderUrl provided',
          'ScreenshotService',
          statusResponse
        );
      }

      // Fetch the image
      const imageData = await this.urlboxClient.fetchImage(statusResponse.renderUrl);

      return {
        ...statusResponse,
        imageData,
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to check screenshot status',
        'ScreenshotService',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Upload screenshot to Supabase Storage
   * @param imageData - Base64 image data URL
   * @param brandSlug - Brand slug for folder structure
   * @param pageType - Page type (home, pdp, about)
   * @param device - 'desktop' or 'mobile'
   * @returns Promise with storage URL
   */
  async uploadToStorage(
    imageData: string,
    brandSlug: string,
    pageType: string,
    device: 'desktop' | 'mobile'
  ): Promise<string> {
    try {
      // Extract base64 data from data URL
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Create file path: {brand_slug}/{page_type}/{device}_{timestamp}.webp
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const fileName = `${device}_${timestamp}.webp`;
      const filePath = `${brandSlug}/${pageType}/${fileName}`;

      const supabase = getServerClient();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('screenshots')
        .upload(filePath, buffer, {
          contentType: 'image/webp',
          upsert: true, // Overwrite if exists
        });

      if (error) {
        throw new ExternalApiError(
          'Failed to upload screenshot to storage',
          'Supabase Storage',
          error
        );
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('screenshots')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new ExternalApiError(
          'Failed to get public URL for screenshot',
          'Supabase Storage',
          'No public URL returned'
        );
      }

      return urlData.publicUrl;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Exception while uploading screenshot',
        'ScreenshotService',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}

