/**
 * API request and response types
 */

import type { PageWithRelations } from './database';
import type { CreatePageInput, CaptureScreenshotRequest } from './page';

/**
 * Public API: Get page by id response
 * Includes both mobile and desktop pages if available
 */
export interface GetPageResponse {
  data: PageWithRelations;
  siblingPage?: PageWithRelations | null;
}

/**
 * Admin API: Capture screenshot request
 */
export interface CaptureScreenshotAPIRequest extends CaptureScreenshotRequest {}

/**
 * Admin API: Screenshot capture response
 */
export interface ScreenshotCaptureResponse {
  success: true;
  renderId: string;
  statusUrl: string;
  metadata: {
    brand_id: string;
    page_type: string;
    page_url: string;
  };
}

/**
 * Screenshot status check request (query params)
 */
export interface ScreenshotStatusRequest {
  statusUrl: string;
}

/**
 * Screenshot status response
 */
export interface ScreenshotStatusResponse {
  success: true;
  status: string;
  renderUrl: string | null;
  imageData: string | null;
}

/**
 * Screenshot capture request (public API format)
 * Note: This is different from CaptureScreenshotRequest which is for admin API
 */
export interface ScreenshotCaptureRequest {
  url: string;
  brandName: string;
  pageType: string;
}

/**
 * API error response
 */
export interface APIErrorResponse {
  error: string;
  details?: string | unknown;
}

