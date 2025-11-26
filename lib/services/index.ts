/**
 * Service module exports
 * Provides singleton instances of all services
 */
import { ScreenshotService } from './screenshot.service';
import { AIAnalysisService } from './ai-analysis.service';
import { getURLBoxClient, getOpenAIClient, getAnthropicClient } from '@/lib/clients';

// Singleton instances
let screenshotService: ScreenshotService | null = null;
let aiAnalysisService: AIAnalysisService | null = null;

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
 * Get or create AI Analysis service instance
 */
export function getAIAnalysisService(): AIAnalysisService {
  if (!aiAnalysisService) {
    aiAnalysisService = new AIAnalysisService(
      getOpenAIClient(),
      getAnthropicClient()
    );
  }
  return aiAnalysisService;
}

/**
 * Export service classes for direct instantiation if needed
 */
export { ScreenshotService } from './screenshot.service';
export { AIAnalysisService } from './ai-analysis.service';

