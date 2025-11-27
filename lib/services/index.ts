/**
 * Service module exports
 * Provides singleton instances of all services
 */
import { ScreenshotService } from './screenshot.service';
import { BrandService } from './brand.service';
import { PageService } from './page.service';
import { getURLBoxClient, getBrandQueries, getPageQueries } from '@/lib/clients';

// Singleton instances
let screenshotService: ScreenshotService | null = null;
let brandService: BrandService | null = null;
let pageService: PageService | null = null;

/**
 * Get or create Screenshot service instance
 */
export function getScreenshotService(): ScreenshotService {
  if (!screenshotService) {
    screenshotService = new ScreenshotService(getURLBoxClient());
  }
  return screenshotService;
}

/**
 * Get or create Brand service instance
 */
export function getBrandService(): BrandService {
  if (!brandService) {
    brandService = new BrandService(getBrandQueries());
  }
  return brandService;
}

/**
 * Get or create Page service instance
 */
export function getPageService(): PageService {
  if (!pageService) {
    pageService = new PageService(getPageQueries());
  }
  return pageService;
}

/**
 * Export service classes for direct instantiation if needed
 */
export { ScreenshotService } from './screenshot.service';
export { BrandService } from './brand.service';
export { PageService } from './page.service';
export { AuthService } from './auth.service';

