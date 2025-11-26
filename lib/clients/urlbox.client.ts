import { config } from '@/lib/config/env';
import { ExternalApiError } from '@/lib/errors/app-error';
import type { URLBoxRenderResponse, URLBoxStatusResponse } from '@/types/services';

/**
 * URLBox API client
 * Handles all interactions with the URLBox screenshot API
 */
export class URLBoxClient {
  private readonly apiSecret: string;
  private readonly baseUrl: string;
  private readonly asyncEndpoint: string;

  constructor() {
    this.apiSecret = config.urlbox.apiSecret;
    this.baseUrl = config.urlbox.baseUrl;
    this.asyncEndpoint = config.urlbox.asyncEndpoint;
  }

  /**
   * Capture a screenshot asynchronously
   * @param url - The URL to capture
   * @param options - Optional capture options
   * @returns Promise with renderId and statusUrl
   */
  async captureScreenshot(
    url: string,
    options: {
      format?: 'webp' | 'png' | 'jpg';
      fullPage?: boolean;
      quality?: number;
    } = {}
  ): Promise<URLBoxRenderResponse> {
    const {
      format = 'webp',
      fullPage = true,
      quality = 100,
    } = options;

    const requestBody = {
      url,
      format,
      full_page: fullPage,
      quality,
    };

    try {
      const response = await fetch(this.asyncEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiSecret}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExternalApiError(
          'URLBOX API request failed',
          'URLBox',
          {
            status: response.status,
            statusText: response.statusText,
            details: errorText || `HTTP ${response.status}: ${response.statusText}`,
          }
        );
      }

      const jsonData = await response.json();
      const renderId = jsonData.renderId;
      const statusUrl = jsonData.statusUrl;

      if (!renderId || !statusUrl) {
        throw new ExternalApiError(
          'Invalid response from URLBOX API: missing renderId or statusUrl',
          'URLBox',
          jsonData
        );
      }

      return {
        renderId,
        statusUrl,
      };
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to capture screenshot',
        'URLBox',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check the status of a screenshot render
   * @param statusUrl - The status URL from the capture response
   * @returns Promise with status information
   */
  async checkStatus(statusUrl: string): Promise<URLBoxStatusResponse> {
    try {
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiSecret}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExternalApiError(
          'URLBOX status check failed',
          'URLBox',
          {
            status: response.status,
            statusText: response.statusText,
            details: errorText || `HTTP ${response.status}: ${response.statusText}`,
          }
        );
      }

      const statusData = await response.json();
      const status = statusData.status;

      if (!status) {
        throw new ExternalApiError(
          'Invalid response from URLBOX: missing status field',
          'URLBox',
          statusData
        );
      }

      return {
        status,
        renderId: statusData.renderId,
        renderUrl: statusData.renderUrl,
      };
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to check screenshot status',
        'URLBox',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Fetch the actual image from a render URL
   * @param renderUrl - The render URL from the status response
   * @param timeout - Timeout in milliseconds (default: 60000)
   * @returns Promise with base64 encoded image data URL
   */
  async fetchImage(renderUrl: string, timeout: number = 60000): Promise<string> {
    try {
      // Try with authentication first
      let imageResponse = await fetch(renderUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ScreenshotBot/1.0)',
          'Authorization': `Bearer ${this.apiSecret}`,
        },
        signal: AbortSignal.timeout(timeout),
      });

      // If auth fails with 401/403, try without auth (renderUrl might be public)
      if (imageResponse.status === 401 || imageResponse.status === 403) {
        imageResponse = await fetch(renderUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ScreenshotBot/1.0)',
          },
          signal: AbortSignal.timeout(timeout),
        });
      }

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text().catch(() => 'Unable to read error response');
        throw new ExternalApiError(
          'Failed to fetch image from render URL',
          'URLBox',
          {
            status: imageResponse.status,
            statusText: imageResponse.statusText,
            renderUrl,
            details: errorText.substring(0, 200),
          }
        );
      }

      // Convert image to base64
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:image/webp;base64,${base64Image}`;

      return dataUrl;
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }

      const isTimeout = error instanceof Error &&
        (error.name === 'AbortError' || error.message.includes('timeout'));

      throw new ExternalApiError(
        isTimeout ? 'Image fetch timed out' : 'Exception while fetching image',
        'URLBox',
        {
          renderUrl,
          details: error instanceof Error ? error.message : 'Unknown error',
        }
      );
    }
  }
}

