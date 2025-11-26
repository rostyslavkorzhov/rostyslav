import { URLBoxClient } from '@/lib/clients/urlbox.client';
import { ValidationError, ExternalApiError } from '@/lib/errors/app-error';
import type {
  ScreenshotCaptureRequest,
  ScreenshotStatusRequest,
  URLBoxRenderResponse,
  URLBoxStatusResponse,
} from '@/types/services';

/**
 * Screenshot service
 * Handles business logic for screenshot capture and status checking
 */
export class ScreenshotService {
  constructor(private urlboxClient: URLBoxClient) {}

  /**
   * Capture a screenshot
   * @param request - Screenshot capture request
   * @returns Promise with renderId and statusUrl
   */
  async capture(request: ScreenshotCaptureRequest): Promise<URLBoxRenderResponse> {
    // Validate URL format
    try {
      new URL(request.url);
    } catch {
      throw new ValidationError('Invalid URL format', { url: request.url });
    }

    // Validate required fields
    if (!request.brandName?.trim()) {
      throw new ValidationError('Brand Name is required');
    }

    if (!request.pageType?.trim()) {
      throw new ValidationError('Page Type is required');
    }

    try {
      // Call URLBox API to capture screenshot
      const result = await this.urlboxClient.captureScreenshot(request.url, {
        format: 'webp',
        fullPage: true,
        quality: 100,
      });

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
   * Check the status of a screenshot render
   * @param request - Status check request
   * @returns Promise with status and optional image data
   */
  async checkStatus(
    request: ScreenshotStatusRequest
  ): Promise<URLBoxStatusResponse & { imageData?: string }> {
    // Validate statusUrl
    try {
      new URL(request.statusUrl);
    } catch {
      throw new ValidationError('Invalid statusUrl format', { statusUrl: request.statusUrl });
    }

    try {
      // Check status with URLBox
      const statusResponse = await this.urlboxClient.checkStatus(request.statusUrl);

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
}

