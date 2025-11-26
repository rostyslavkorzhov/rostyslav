/**
 * Service layer types
 */

import type { ScreenshotCaptureRequest, ScreenshotStatusRequest, AIAnalysisRequest } from './api';

// Re-export API types for convenience
export type { ScreenshotCaptureRequest, ScreenshotStatusRequest, AIAnalysisRequest } from './api';

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
 */
export interface IScreenshotService {
  capture(request: ScreenshotCaptureRequest): Promise<URLBoxRenderResponse>;
  checkStatus(request: ScreenshotStatusRequest): Promise<URLBoxStatusResponse & { imageData?: string }>;
}

/**
 * AI analysis service interface
 */
export interface IAIAnalysisService {
  analyzeScreenshot(request: AIAnalysisRequest): Promise<{ highlights: Array<{
    id: string;
    bounds: { x: number; y: number; width: number; height: number };
    explanation: string;
    category: string;
    analyzedAt: number;
  }> }>;
}

