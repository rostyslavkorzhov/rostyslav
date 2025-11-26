/**
 * API request and response types
 */

/**
 * Screenshot capture request
 */
export interface ScreenshotCaptureRequest {
  url: string;
  brandName: string;
  pageType: string;
}

/**
 * Screenshot capture response
 */
export interface ScreenshotCaptureResponse {
  success: true;
  renderId: string;
  statusUrl: string;
  metadata: {
    url: string;
    brandName: string;
    pageType: string;
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
 * AI analysis request
 */
export interface AIAnalysisRequest {
  imageData: string;
}

/**
 * Highlight bounds (normalized 0-1)
 */
export interface HighlightBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Highlight category
 */
export type HighlightCategory =
  | 'cta'
  | 'hero'
  | 'trust_signal'
  | 'social_proof'
  | 'form'
  | 'navigation'
  | 'other';

/**
 * Highlight response
 */
export interface Highlight {
  id: string;
  bounds: HighlightBounds;
  explanation: string;
  category: HighlightCategory;
  analyzedAt?: number;
}

/**
 * AI analysis response
 */
export interface AIAnalysisResponse {
  success: true;
  highlights: Highlight[];
}

