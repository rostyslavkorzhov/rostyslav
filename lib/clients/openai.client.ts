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
 * OpenAI API client
 * Handles interactions with OpenAI's vision API for screenshot analysis
 */
export class OpenAIClient {
  private readonly apiKey: string | undefined;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.apiKey = config.openai.apiKey;
    this.baseUrl = config.openai.baseUrl;
    this.model = config.openai.model;
  }

  /**
   * Check if OpenAI is configured
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
        'OpenAI API key not configured',
        'OpenAI'
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: ANALYSIS_PROMPT,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/png;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExternalApiError(
          'OpenAI API request failed',
          'OpenAI',
          {
            status: response.status,
            statusText: response.statusText,
            details: errorText || `HTTP ${response.status}: ${response.statusText}`,
          }
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new ExternalApiError(
          'Invalid response from OpenAI API: missing content',
          'OpenAI',
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
        'Failed to analyze screenshot with OpenAI',
        'OpenAI',
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

