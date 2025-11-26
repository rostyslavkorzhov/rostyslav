import { OpenAIClient } from '@/lib/clients/openai.client';
import { AnthropicClient } from '@/lib/clients/anthropic.client';
import { ConfigurationError, ExternalApiError } from '@/lib/errors/app-error';
import type { AIAnalysisRequest, Highlight } from '@/types/api';

/**
 * AI Analysis service
 * Handles business logic for AI-powered screenshot analysis
 * Auto-selects provider based on available API keys (prefers OpenAI)
 */
export class AIAnalysisService {
  constructor(
    private openaiClient: OpenAIClient,
    private anthropicClient: AnthropicClient
  ) {}

  /**
   * Analyze a screenshot and identify conversion-optimized elements
   * @param request - AI analysis request with image data
   * @returns Promise with array of highlights
   */
  async analyzeScreenshot(request: AIAnalysisRequest): Promise<{ highlights: Highlight[] }> {
    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Image = request.imageData.includes(',')
      ? request.imageData.split(',')[1]
      : request.imageData;

    // Check which AI provider is available (prefer OpenAI)
    const useOpenAI = this.openaiClient.isConfigured();
    const useAnthropic = this.anthropicClient.isConfigured();

    if (!useOpenAI && !useAnthropic) {
      throw new ConfigurationError(
        'AI API credentials not configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in environment variables'
      );
    }

    try {
      let highlights: Highlight[];

      if (useOpenAI) {
        highlights = await this.openaiClient.analyzeScreenshot(base64Image);
      } else {
        highlights = await this.anthropicClient.analyzeScreenshot(base64Image);
      }

      return {
        highlights,
      };
    } catch (error) {
      if (error instanceof ConfigurationError || error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to analyze screenshot',
        'AIAnalysisService',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}

