import { z } from 'zod';

/**
 * AI analysis request schema
 */
export const aiAnalysisSchema = z.object({
  imageData: z
    .string()
    .min(1, 'imageData is required')
    .refine(
      (data) => {
        // Check if it's a base64 string or data URL
        const base64Pattern = /^data:image\/(png|jpeg|jpg|webp);base64,/;
        const isDataUrl = base64Pattern.test(data);
        const isBase64 = /^[A-Za-z0-9+/=]+$/.test(data.split(',')[1] || data);
        return isDataUrl || isBase64;
      },
      {
        message: 'imageData must be a valid base64 string or data URL',
      }
    ),
});

/**
 * Type inference from schema
 */
export type AIAnalysisInput = z.infer<typeof aiAnalysisSchema>;

