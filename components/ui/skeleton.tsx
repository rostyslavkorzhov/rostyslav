'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether to show the skeleton or children
   * @default true
   */
  loading?: boolean;
  /**
   * Width of the skeleton
   */
  width?: string;
  /**
   * Minimum width of the skeleton
   */
  minWidth?: string;
  /**
   * Maximum width of the skeleton
   */
  maxWidth?: string;
  /**
   * Height of the skeleton
   */
  height?: string;
  /**
   * Minimum height of the skeleton
   */
  minHeight?: string;
  /**
   * Maximum height of the skeleton
   */
  maxHeight?: string;
}

/**
 * Skeleton component for loading states
 * Replaces content with a placeholder that indicates loading
 * Preserves dimensions of children when hidden
 */
export function Skeleton({
  loading = true,
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  className,
  children,
  ...props
}: SkeletonProps) {
  const style = React.useMemo(
    () => ({
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
    }),
    [width, minWidth, maxWidth, height, minHeight, maxHeight]
  );

  if (!loading && children) {
    return <span {...props}>{children}</span>;
  }

  if (children) {
    // When loading with children, preserve dimensions
    return (
      <span
        className={cn('relative inline-block', className)}
        style={style}
        {...props}
      >
        <span className='invisible' aria-hidden='true'>
          {children}
        </span>
        <span
          className='absolute inset-0 bg-bg-weak-100 rounded animate-pulse'
          aria-label='Loading'
        />
      </span>
    );
  }

  // Standalone skeleton
  return (
    <span
      className={cn(
        'inline-block bg-bg-weak-100 rounded animate-pulse',
        className
      )}
      style={style}
      aria-label='Loading'
      {...props}
    />
  );
}

