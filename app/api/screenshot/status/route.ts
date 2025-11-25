import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const statusUrl = searchParams.get('statusUrl');

    if (!statusUrl) {
      return NextResponse.json(
        { error: 'Missing statusUrl parameter' },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const apiSecret = process.env.URLBOX_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json(
        { error: 'URLBOX API credentials not configured' },
        { status: 500 }
      );
    }

    // Call URLBOX status endpoint with Bearer token authentication
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiSecret}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          error: 'URLBOX status check failed',
          details: errorText || `HTTP ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const statusData = await response.json();
    const status = statusData.status;
    const renderUrl = statusData.renderUrl;

    console.log('URLBOX status response:', {
      status,
      renderUrl,
      renderId: statusData.renderId,
      fullResponse: JSON.stringify(statusData).substring(0, 500), // Log first 500 chars
    });

    // Validate response structure
    if (!status) {
      console.error('URLBOX response missing status field:', statusData);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid response from URLBOX: missing status field',
          details: 'Response structure does not match expected format',
        },
        { status: 500 }
      );
    }

    // If status is not "succeeded" or "done", return the status for continued polling
    if (status !== 'succeeded' && status !== 'done') {
      return NextResponse.json({
        success: true,
        status,
        renderUrl: null,
        imageData: null,
      });
    }

    // Status is "succeeded" or "done", fetch the actual image
    if (!renderUrl) {
      console.error('Render complete but no renderUrl provided:', statusData);
      return NextResponse.json(
        { 
          success: false,
          error: 'Render complete but no renderUrl provided',
          status: statusData.status,
        },
        { status: 500 }
      );
    }

    // Fetch the actual image from the render URL
    console.log('Fetching image from renderUrl:', renderUrl);
    
    try {
      // Try with authentication first, then without if that fails
      let imageResponse = await fetch(renderUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ScreenshotBot/1.0)',
          'Authorization': `Bearer ${apiSecret}`,
        },
        // Add a timeout signal
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });
      
      // If auth fails with 401/403, try without auth (renderUrl might be public)
      if (imageResponse.status === 401 || imageResponse.status === 403) {
        console.log('Image fetch with auth failed, trying without auth');
        imageResponse = await fetch(renderUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ScreenshotBot/1.0)',
          },
          signal: AbortSignal.timeout(60000),
        });
      }
      
      if (!imageResponse.ok) {
        const errorText = await imageResponse.text().catch(() => 'Unable to read error response');
        console.error('Failed to fetch image from render URL:', {
          status: imageResponse.status,
          statusText: imageResponse.statusText,
          renderUrl,
          errorText: errorText.substring(0, 200), // Limit error text length
        });
        return NextResponse.json(
          { 
            success: false,
            error: 'Failed to fetch image from render URL',
            details: `HTTP ${imageResponse.status}: ${imageResponse.statusText}`,
            renderUrl,
          },
          { status: 500 }
        );
      }

      // Convert image to base64
      const imageBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:image/webp;base64,${base64Image}`;

      console.log('Successfully fetched and converted image:', {
        size: imageBuffer.byteLength,
        renderUrl,
        dataUrlLength: dataUrl.length,
      });

      return NextResponse.json({
        success: true,
        status: 'succeeded',
        renderUrl,
        imageData: dataUrl,
      });
    } catch (fetchError) {
      const isTimeout = fetchError instanceof Error && 
        (fetchError.name === 'AbortError' || fetchError.message.includes('timeout'));
      
      console.error('Exception while fetching image:', {
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        errorName: fetchError instanceof Error ? fetchError.name : 'Unknown',
        isTimeout,
        renderUrl,
      });
      
      return NextResponse.json(
        { 
          success: false,
          error: isTimeout ? 'Image fetch timed out' : 'Exception while fetching image',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          renderUrl,
          status: 'succeeded', // Status from urlbox was succeeded, but image fetch failed
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in screenshot status API route:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

