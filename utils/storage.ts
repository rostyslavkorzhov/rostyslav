export type ScreenshotStatus = 'completed' | 'in_progress' | 'failed';

export interface ScreenshotData {
  id: string;
  url: string;
  brandName: string;
  pageType: string;
  timestamp: number;
  status: ScreenshotStatus;
  imageData?: string; // base64 data URL (optional for in_progress)
  renderId?: string; // URLBOX render ID for async tracking
  statusUrl?: string; // URLBOX status URL for polling
}

const STORAGE_KEY = 'urlbox_screenshots';

/**
 * Generate a unique ID for a screenshot
 */
function generateId(): string {
  return `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save a screenshot to localStorage with metadata
 */
export function saveScreenshot(data: {
  url: string;
  brandName: string;
  pageType: string;
  status?: ScreenshotStatus;
  imageData?: string;
  renderId?: string;
  statusUrl?: string;
}): ScreenshotData {
  const screenshot: ScreenshotData = {
    id: generateId(),
    url: data.url,
    brandName: data.brandName,
    pageType: data.pageType,
    timestamp: Date.now(),
    status: data.status || 'completed',
    imageData: data.imageData,
    renderId: data.renderId,
    statusUrl: data.statusUrl,
  };

  const existing = getAllScreenshots();
  existing.push(screenshot);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    // Handle localStorage quota exceeded
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Storage limit exceeded. Please clear some old screenshots.');
    }
    throw error;
  }

  return screenshot;
}

/**
 * Update screenshot status and image data when async render completes
 */
export function updateScreenshotStatus(
  id: string,
  updates: {
    status: ScreenshotStatus;
    imageData?: string;
    renderId?: string;
    statusUrl?: string;
  }
): boolean {
  const screenshots = getAllScreenshots();
  const index = screenshots.findIndex((s) => s.id === id);
  
  if (index === -1) {
    return false; // Screenshot not found
  }

  screenshots[index] = {
    ...screenshots[index],
    ...updates,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(screenshots));
    return true;
  } catch (error) {
    console.error('Error updating screenshot status:', error);
    return false;
  }
}

/**
 * Get all stored screenshots (sorted by timestamp, newest first)
 */
export function getAllScreenshots(): ScreenshotData[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const screenshots = JSON.parse(stored) as ScreenshotData[];
    // Sort by timestamp (newest first)
    return screenshots.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error reading screenshots from localStorage:', error);
    return [];
  }
}

/**
 * Get all in-progress screenshots
 */
export function getInProgressScreenshots(): ScreenshotData[] {
  return getAllScreenshots().filter((s) => s.status === 'in_progress');
}

/**
 * Get a specific screenshot by ID
 */
export function getScreenshot(id: string): ScreenshotData | null {
  const screenshots = getAllScreenshots();
  return screenshots.find((s) => s.id === id) || null;
}

/**
 * Delete a screenshot by ID
 */
export function deleteScreenshot(id: string): boolean {
  const screenshots = getAllScreenshots();
  const filtered = screenshots.filter((s) => s.id !== id);
  
  if (filtered.length === screenshots.length) {
    return false; // Screenshot not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting screenshot from localStorage:', error);
    return false;
  }
}

/**
 * Clear all screenshots
 */
export function clearAllScreenshots(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing screenshots from localStorage:', error);
  }
}

