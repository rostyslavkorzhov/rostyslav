/**
 * Client module exports
 * Provides singleton instances of all API clients
 */
import { URLBoxClient } from './urlbox.client';
import { OpenAIClient } from './openai.client';
import { AnthropicClient } from './anthropic.client';

// Singleton instances
let urlboxClient: URLBoxClient | null = null;
let openaiClient: OpenAIClient | null = null;
let anthropicClient: AnthropicClient | null = null;

/**
 * Get or create URLBox client instance
 */
export function getURLBoxClient(): URLBoxClient {
  if (!urlboxClient) {
    urlboxClient = new URLBoxClient();
  }
  return urlboxClient;
}

/**
 * Get or create OpenAI client instance
 */
export function getOpenAIClient(): OpenAIClient {
  if (!openaiClient) {
    openaiClient = new OpenAIClient();
  }
  return openaiClient;
}

/**
 * Get or create Anthropic client instance
 */
export function getAnthropicClient(): AnthropicClient {
  if (!anthropicClient) {
    anthropicClient = new AnthropicClient();
  }
  return anthropicClient;
}

/**
 * Export client classes for direct instantiation if needed
 */
export { URLBoxClient } from './urlbox.client';
export { OpenAIClient } from './openai.client';
export { AnthropicClient } from './anthropic.client';

