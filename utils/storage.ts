export interface ScreenshotData {
  id: string;
  url: string;
  brandName: string;
  pageType: string;
  timestamp: number;
  imageData: string; // base64 data URL
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
  imageData: string;
}): ScreenshotData {
  const screenshot: ScreenshotData = {
    id: generateId(),
    url: data.url,
    brandName: data.brandName,
    pageType: data.pageType,
    timestamp: Date.now(),
    imageData: data.imageData,
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
 * Get all stored screenshots
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
    return JSON.parse(stored) as ScreenshotData[];
  } catch (error) {
    console.error('Error reading screenshots from localStorage:', error);
    return [];
  }
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

