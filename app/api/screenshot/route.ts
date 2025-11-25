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

    // Prepare URLBOX API request
    const urlboxUrl = 'https://api.urlbox.com/v1/render/sync';
    const requestBody = {
      url,
      format: 'png',
      full_page: true,
      retina: true,
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

    // Check content type to determine if response is JSON or binary image
    const contentType = response.headers.get('content-type') || '';
    let imageBuffer: ArrayBuffer;

    if (contentType.includes('application/json')) {
      // URLBOX returned JSON with a renderUrl - fetch the actual image
      const jsonData = await response.json();
      const renderUrl = jsonData.renderUrl || jsonData.url;
      
      if (!renderUrl) {
        return NextResponse.json(
          { error: 'No render URL found in URLBOX response' },
          { status: 500 }
        );
      }

      // Fetch the actual image from the render URL
      const imageResponse = await fetch(renderUrl);
      if (!imageResponse.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch image from render URL' },
          { status: 500 }
        );
      }
      imageBuffer = await imageResponse.arrayBuffer();
    } else {
      // Direct binary image response
      imageBuffer = await response.arrayBuffer();
    }
    
    // Convert to base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Return the image data along with metadata
    return NextResponse.json({
      success: true,
      imageData: dataUrl,
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

