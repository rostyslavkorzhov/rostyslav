import { HighlightBounds } from './storage';

/**
 * Calculate the scale factor for an image based on its displayed size vs natural size
 */
export function getImageScale(imageElement: HTMLImageElement): {
  scaleX: number;
  scaleY: number;
} {
  if (!imageElement.naturalWidth || !imageElement.naturalHeight) {
    return { scaleX: 1, scaleY: 1 };
  }

  const displayedWidth = imageElement.clientWidth;
  const displayedHeight = imageElement.clientHeight;
  const naturalWidth = imageElement.naturalWidth;
  const naturalHeight = imageElement.naturalHeight;

  return {
    scaleX: displayedWidth / naturalWidth,
    scaleY: displayedHeight / naturalHeight,
  };
}

/**
 * Convert normalized coordinates (0-1 range) to pixel coordinates based on displayed image size
 */
export function normalizeToImageCoords(
  bounds: HighlightBounds,
  imageElement: HTMLImageElement
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const { scaleX, scaleY } = getImageScale(imageElement);
  const displayedWidth = imageElement.clientWidth;
  const displayedHeight = imageElement.clientHeight;

  return {
    x: bounds.x * displayedWidth,
    y: bounds.y * displayedHeight,
    width: bounds.width * displayedWidth,
    height: bounds.height * displayedHeight,
  };
}

/**
 * Get the bounding rectangle of the image element relative to its container
 */
export function getImageBoundingRect(imageElement: HTMLImageElement): DOMRect {
  return imageElement.getBoundingClientRect();
}

