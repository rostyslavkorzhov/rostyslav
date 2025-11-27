import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/clients/supabase-server';
import { handleError } from '@/lib/errors/error-handler';

/**
 * GET /api/categories
 * List all categories
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return handleError(error);
  }
}

