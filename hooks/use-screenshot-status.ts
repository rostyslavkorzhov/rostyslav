'use client';

import { useEffect, useRef } from 'react';
import { 
  getInProgressScreenshots, 
  updateScreenshotStatus, 
  updateScreenshotHighlights,
  hasHighlights,
} from '@/utils/storage';

/**
 * Custom hook to poll for status updates on in-progress screenshots
 */
export function useScreenshotStatus() {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    /**
     * Analyze a screenshot to generate conversion highlights
     */
    const analyzeScreenshot = async (screenshotId: string, imageData: string) => {
      try {
        const response = await fetch('/api/screenshot/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageData }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Failed to analyze screenshot:', {
            screenshotId,
            error: data.error,
            details: data.details,
          });
          return;
        }

        if (data.success && data.highlights) {
          // Save highlights to storage
          const updated = updateScreenshotHighlights(screenshotId, data.highlights);
          if (updated) {
            console.log('Highlights saved for screenshot:', screenshotId);
          } else {
            console.error('Failed to save highlights:', screenshotId);
          }
        }
      } catch (error) {
        console.error('Error analyzing screenshot:', {
          screenshotId,
          error,
        });
        // Fail silently - highlights are optional
      }
    };

    const pollStatus = async () => {
      const inProgressScreenshots = getInProgressScreenshots();

      if (inProgressScreenshots.length === 0) {
        return;
      }

      // Poll each in-progress screenshot
      for (const screenshot of inProgressScreenshots) {
        if (!screenshot.statusUrl) {
          continue;
        }

        try {
          const response = await fetch(
            `/api/screenshot/status?statusUrl=${encodeURIComponent(screenshot.statusUrl)}`
          );

          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            // If JSON parsing fails, log and continue
            console.error('Failed to parse response as JSON:', {
              status: response.status,
              statusText: response.statusText,
              renderId: screenshot.renderId,
              error: jsonError,
            });
            continue;
          }

          if (!response.ok) {
            console.error('Failed to check screenshot status:', {
              status: response.status,
              statusText: response.statusText,
              error: data.error,
              details: data.details,
              renderId: screenshot.renderId,
              fullResponse: data,
            });
            continue;
          }

          // Log the response for debugging
          console.log('Screenshot status API response:', {
            renderId: screenshot.renderId,
            hasSuccess: 'success' in data,
            success: data.success,
            status: data.status,
            hasImageData: !!data.imageData,
            imageDataLength: data.imageData?.length,
            fullData: data,
          });

          // Check if the response indicates success
          if (data.success && (data.status === 'succeeded' || data.status === 'done')) {
            if (data.imageData) {
              // Screenshot is complete with image data, update it
              const updated = updateScreenshotStatus(screenshot.id, {
                status: 'completed',
                imageData: data.imageData,
              });
              if (updated) {
                console.log('Screenshot completed:', screenshot.id);
                
                // Trigger AI analysis if highlights don't exist
                if (!hasHighlights(screenshot.id)) {
                  analyzeScreenshot(screenshot.id, data.imageData);
                }
              } else {
                console.error('Failed to update screenshot status:', screenshot.id);
              }
            } else {
              // Status is succeeded but no imageData - might be still processing or error fetching image
              console.warn('Screenshot status succeeded but no imageData:', {
                renderId: screenshot.renderId,
                statusUrl: screenshot.statusUrl,
                response: data,
              });
            }
          } else if (data.success && data.status === 'failed') {
            // Screenshot failed
            updateScreenshotStatus(screenshot.id, {
              status: 'failed',
            });
          } else if (!data.success) {
            // API returned an error
            console.error('API returned error:', {
              error: data.error,
              details: data.details,
              renderId: screenshot.renderId,
              status: data.status,
            });
            
            // If status was succeeded but image fetch failed, mark as failed
            if (data.status === 'succeeded') {
              console.warn('Status was succeeded but image fetch failed, marking as failed');
              updateScreenshotStatus(screenshot.id, {
                status: 'failed',
              });
            }
          } else {
            // Response doesn't match expected format
            console.warn('Unexpected response format:', {
              renderId: screenshot.renderId,
              data,
            });
          }
          // If status is still pending, continue polling
        } catch (error) {
          console.error('Error polling screenshot status:', {
            error,
            renderId: screenshot.renderId,
            statusUrl: screenshot.statusUrl,
          });
        }
      }
    };

    // Poll every 3 seconds
    pollingIntervalRef.current = setInterval(pollStatus, 3000);

    // Initial poll
    pollStatus();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);
}

