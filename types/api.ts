/**
 * API request and response types
 */

import type { PageWithRelations } from './database';

/**
 * Public API: Get page by id response
 * Includes both mobile and desktop pages if available
 */
export interface GetPageResponse {
  data: PageWithRelations;
  siblingPage?: PageWithRelations | null;
}

/**
 * API error response
 */
export interface APIErrorResponse {
  error: string;
  details?: string | unknown;
}

