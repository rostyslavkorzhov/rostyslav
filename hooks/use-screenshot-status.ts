'use client';

import { useEffect, useRef } from 'react';
import { 
  getInProgressScreenshots, 
  updateScreenshotStatus,
} from '@/utils/storage';

/**
 * Custom hook to poll for status updates on in-progress screenshots
 */
export function useScreenshotStatus() {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
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
          } catch {
            // If JSON parsing fails, skip this screenshot
            continue;
          }

          if (!response.ok) {
            // Skip failed requests and continue polling
            continue;
          }

          // Check if the response indicates success
          if (data.success && (data.status === 'succeeded' || data.status === 'done')) {
            if (data.imageData) {
              // Screenshot is complete with image data, update it
              updateScreenshotStatus(screenshot.id, {
                status: 'completed',
                imageData: data.imageData,
              });
            }
          } else if (data.success && data.status === 'failed') {
            // Screenshot failed
            updateScreenshotStatus(screenshot.id, {
              status: 'failed',
            });
          } else if (!data.success) {
            // If status was succeeded but image fetch failed, mark as failed
            if (data.status === 'succeeded') {
              updateScreenshotStatus(screenshot.id, {
                status: 'failed',
              });
            }
          }
          // If status is still pending, continue polling
        } catch {
          // Silently continue polling on errors
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

