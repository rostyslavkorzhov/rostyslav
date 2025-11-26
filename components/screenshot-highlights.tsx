'use client';

import { useRef, useEffect, useState } from 'react';
import {
  Provider as TooltipProvider,
  Root as TooltipRoot,
  Trigger as TooltipTrigger,
  Content as TooltipContent,
} from '@/components/ui/tooltip';
import { ScreenshotHighlight } from '@/utils/storage';
import { normalizeToImageCoords } from '@/utils/image-coordinates';

interface ScreenshotHighlightsProps {
  imageData: string;
  highlights: ScreenshotHighlight[];
  className?: string;
}

export default function ScreenshotHighlights({
  imageData,
  highlights,
  className = '',
}: ScreenshotHighlightsProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [highlightPositions, setHighlightPositions] = useState<
    Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      explanation: string;
      category?: string;
    }>
  >([]);

  useEffect(() => {
    if (!imageRef.current || !imageLoaded) {
      return;
    }

    const updatePositions = () => {
      if (!imageRef.current) return;

      // Update image dimensions
      setImageDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });

      const positions = highlights.map((highlight) => {
        const coords = normalizeToImageCoords(highlight.bounds, imageRef.current!);
        return {
          id: highlight.id,
          x: coords.x,
          y: coords.y,
          width: coords.width,
          height: coords.height,
          explanation: highlight.explanation,
          category: highlight.category,
        };
      });

      setHighlightPositions(positions);
    };

    updatePositions();

    // Update positions on window resize
    const handleResize = () => {
      updatePositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [highlights, imageLoaded]);

  return (
    <TooltipProvider>
      <div className={`relative ${className}`}>
        <img
          ref={imageRef}
          src={imageData}
          alt="Screenshot with highlights"
          className="w-full h-auto"
          onLoad={() => setImageLoaded(true)}
        />
        {imageLoaded && highlightPositions.length > 0 && imageDimensions && (
          <div 
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: `${imageDimensions.width}px`,
              height: `${imageDimensions.height}px`,
            }}
          >
            {highlightPositions.map((highlight) => (
              <TooltipRoot key={highlight.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute cursor-pointer pointer-events-auto border-2 border-primary-base bg-primary-base/10 hover:bg-primary-base/20 transition-colors rounded-sm"
                    style={{
                      left: `${highlight.x}px`,
                      top: `${highlight.y}px`,
                      width: `${highlight.width}px`,
                      height: `${highlight.height}px`,
                    }}
                    aria-label={`Highlight: ${highlight.explanation.substring(0, 50)}...`}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  variant="light"
                  size="medium"
                  className="max-w-sm"
                  sideOffset={8}
                >
                  <div className="space-y-1">
                    {highlight.category && (
                      <div className="text-label-xs font-medium text-text-sub-600 uppercase tracking-wide">
                        {highlight.category.replace('_', ' ')}
                      </div>
                    )}
                    <div className="text-paragraph-sm text-text-strong-950">
                      {highlight.explanation}
                    </div>
                  </div>
                </TooltipContent>
              </TooltipRoot>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

