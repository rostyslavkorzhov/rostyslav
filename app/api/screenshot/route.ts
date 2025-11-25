import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, brandName, pageType } = body;

    // Validate required fields
    if (!url || !brandName || !pageType) {
      return NextResponse.json(
        { error: 'Missing required fields: url, brandName, and pageType are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const apiSecret = process.env.URLBOX_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json(
        { error: 'URLBOX API credentials not configured. Please set URLBOX_API_SECRET in .env.local' },
        { status: 500 }
      );
    }

    // Prepare URLBOX API request (async endpoint)
    const urlboxUrl = 'https://api.urlbox.com/v1/render/async';
    const requestBody = {
      url,
      format: 'webp',
      full_page: true,
      quality: 100,
    };

    // Call URLBOX API with Bearer token authentication
    const response = await fetch(urlboxUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiSecret}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: 'URLBOX API request failed',
          details: errorText || `HTTP ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Async endpoint returns JSON with renderId and statusUrl
    const jsonData = await response.json();
    const renderId = jsonData.renderId;
    const statusUrl = jsonData.statusUrl;

    if (!renderId || !statusUrl) {
      return NextResponse.json(
        { error: 'Invalid response from URLBOX API: missing renderId or statusUrl' },
        { status: 500 }
      );
    }

    // Return renderId and statusUrl for client-side polling
    return NextResponse.json({
      success: true,
      renderId,
      statusUrl,
      metadata: {
        url,
        brandName,
        pageType,
      },
    });
  } catch (error) {
    console.error('Error in screenshot API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

