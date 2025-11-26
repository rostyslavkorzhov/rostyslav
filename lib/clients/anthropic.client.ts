import { config } from '@/lib/config/env';
import { ExternalApiError } from '@/lib/errors/app-error';
import type { Highlight } from '@/types/api';

/**
 * Analysis prompt for conversion optimization
 */
const ANALYSIS_PROMPT = `Analyze this webpage screenshot and identify areas that are optimized for conversion (elements that help convert visitors into customers or leads).

Please identify the following types of conversion-optimized elements:
- Call-to-action buttons (CTAs)
- Hero sections with value propositions
- Trust signals (badges, certifications, testimonials)
- Social proof (reviews, customer counts, logos)
- Forms or sign-up elements
- Navigation elements that guide users to conversion
- Any other elements that contribute to conversions

For each element you identify, provide:
1. Bounding box coordinates as normalized values (0-1 range) in format: { x, y, width, height }
   - x, y: top-left corner position (0-1)
   - width, height: dimensions (0-1)
   - Coordinates should be relative to the full image dimensions
2. A clear, concise explanation (2-3 sentences) of why this area works well for conversion
3. A category: "cta", "hero", "trust_signal", "social_proof", "form", "navigation", or "other"

Return ONLY a valid JSON array of objects, each with: id (unique string), bounds (x, y, width, height as numbers 0-1), explanation (string), and category (optional string).

Example format:
[
  {
    "id": "highlight-1",
    "bounds": { "x": 0.1, "y": 0.2, "width": 0.3, "height": 0.1 },
    "explanation": "This prominent CTA button uses contrasting colors and clear copy to draw attention and encourage immediate action.",
    "category": "cta"
  }
]

Focus on the most impactful conversion elements (3-8 highlights total).`;

/**
 * Anthropic API client
 * Handles interactions with Anthropic's Claude API for screenshot analysis
 */
export class AnthropicClient {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly version: string;

  constructor() {
    this.apiKey = config.anthropic.apiKey;
    this.baseUrl = config.anthropic.baseUrl;
    this.model = config.anthropic.model;
    this.version = config.anthropic.version;
  }

  /**
   * Check if Anthropic is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Analyze a screenshot and identify conversion-optimized elements
   * @param base64Image - Base64 encoded image (without data URL prefix)
   * @returns Promise with array of highlights
   */
  async analyzeScreenshot(base64Image: string): Promise<Highlight[]> {
    if (!this.apiKey) {
      throw new ExternalApiError(
        'Anthropic API key not configured',
        'Anthropic'
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.version,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/png',
                    data: base64Image,
                  },
                },
                {
                  type: 'text',
                  text: ANALYSIS_PROMPT,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExternalApiError(
          'Anthropic API request failed',
          'Anthropic',
          {
            status: response.status,
            statusText: response.statusText,
            details: errorText || `HTTP ${response.status}: ${response.statusText}`,
          }
        );
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new ExternalApiError(
          'Invalid response from Anthropic API: missing content',
          'Anthropic',
          data
        );
      }

      // Extract JSON from response (handle markdown code blocks if present)
      let jsonString = content.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
      }

      const highlights: Highlight[] = JSON.parse(jsonString);

      // Validate and normalize highlights
      return this.validateAndNormalizeHighlights(highlights);
    } catch (error) {
      if (error instanceof ExternalApiError) {
        throw error;
      }
      throw new ExternalApiError(
        'Failed to analyze screenshot with Anthropic',
        'Anthropic',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Validate and normalize highlight data
   */
  private validateAndNormalizeHighlights(highlights: Highlight[]): Highlight[] {
    return highlights
      .filter((h) =>
        h.id &&
        h.bounds &&
        typeof h.bounds.x === 'number' &&
        typeof h.bounds.y === 'number' &&
        typeof h.bounds.width === 'number' &&
        typeof h.bounds.height === 'number' &&
        h.bounds.x >= 0 &&
        h.bounds.x <= 1 &&
        h.bounds.y >= 0 &&
        h.bounds.y <= 1 &&
        h.bounds.width > 0 &&
        h.bounds.width <= 1 &&
        h.bounds.height > 0 &&
        h.bounds.height <= 1 &&
        h.explanation
      )
      .map((h, index) => ({
        id: h.id || `highlight-${index}`,
        bounds: {
          x: Math.max(0, Math.min(1, h.bounds.x)),
          y: Math.max(0, Math.min(1, h.bounds.y)),
          width: Math.max(0.01, Math.min(1, h.bounds.width)),
          height: Math.max(0.01, Math.min(1, h.bounds.height)),
        },
        explanation: h.explanation,
        category: h.category || 'other',
        analyzedAt: Date.now(),
      }));
  }
}

