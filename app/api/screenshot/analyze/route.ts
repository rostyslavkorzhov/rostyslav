import { NextRequest, NextResponse } from 'next/server';
import { aiAnalysisSchema } from '@/lib/validations/ai-analysis.schema';
import { getAIAnalysisService } from '@/lib/services';
import { handleError } from '@/lib/errors/error-handler';
import { ValidationError } from '@/lib/errors/app-error';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = aiAnalysisSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new ValidationError(`Validation failed: ${errors}`, validationResult.error.issues);
    }

    const validatedData = validationResult.data;

    // Get service instance
    const aiAnalysisService = getAIAnalysisService();

    // Analyze screenshot
    const result = await aiAnalysisService.analyzeScreenshot({
      imageData: validatedData.imageData,
    });

    // Return success response (maintain backward compatibility)
    return NextResponse.json({
      success: true,
      highlights: result.highlights,
    });
  } catch (error) {
    return handleError(error);
  }
}
