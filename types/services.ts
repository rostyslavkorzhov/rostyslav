/**
 * Service layer types
 */

import type { ScreenshotCaptureRequest, ScreenshotStatusRequest } from './api';

// Re-export API types for convenience
export type { ScreenshotCaptureRequest, ScreenshotStatusRequest } from './api';

// Re-export ScreenshotCaptureRequest from api.ts (it's defined there)
export type { ScreenshotCaptureRequest as IScreenshotCaptureRequest } from './api';

/**
 * Screenshot metadata
 */
export interface ScreenshotMetadata {
  url: string;
  brandName: string;
  pageType: string;
}

/**
 * URLBox render response
 */
export interface URLBoxRenderResponse {
  renderId: string;
  statusUrl: string;
}

/**
 * URLBox status response
 */
export interface URLBoxStatusResponse {
  status: string;
  renderId?: string;
  renderUrl?: string;
}

/**
 * Screenshot service interface
 * Note: The actual implementation uses different signatures:
 * - capture(url: string, device: 'desktop' | 'mobile'): Promise<URLBoxRenderResponse>
 * - checkStatus(statusUrl: string): Promise<URLBoxStatusResponse & { imageData?: string }>
 */
export interface IScreenshotService {
  capture(url: string, device?: 'desktop' | 'mobile'): Promise<URLBoxRenderResponse>;
  checkStatus(statusUrl: string): Promise<URLBoxStatusResponse & { imageData?: string }>;
}

