/**
 * Service module exports
 * Provides singleton instances of all services
 */
import { PageService } from './page.service';
import { getServerPageQueries } from '@/lib/clients';

// Singleton instances
let pageService: PageService | null = null;

/**
 * Get or create Page service instance
 * Uses server-side queries (service role key) for API routes
 */
export function getPageService(): PageService {
  if (!pageService) {
    pageService = new PageService(getServerPageQueries());
  }
  return pageService;
}

/**
 * Export service classes for direct instantiation if needed
 */
export { PageService } from './page.service';
export { AuthService } from './auth.service';

