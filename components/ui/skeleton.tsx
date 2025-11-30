import * as React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Whether to show the skeleton loading state
   * @default true
   */
  loading?: boolean;
  /**
   * Width of the skeleton (CSS value)
   */
  width?: string;
  /**
   * Height of the skeleton (CSS value)
   */
  height?: string;
  /**
   * Border radius variant
   * @default 'default'
   */
  radius?: 'none' | 'small' | 'default' | 'full';
}

const radiusMap = {
  none: 'rounded-none',
  small: 'rounded',
  default: 'rounded-lg',
  full: 'rounded-full',
};

/**
 * Skeleton component for loading placeholders
 *
 * Replaces content with same-shape placeholder that indicates loading state.
 * When `loading` is false, renders children instead.
 *
 * @example
 * ```tsx
 * // Basic skeleton
 * <Skeleton width="200px" height="20px" />
 *
 * // With children (shows skeleton or content based on loading)
 * <Skeleton loading={isLoading}>
 *   <Text>Actual content</Text>
 * </Skeleton>
 *
 * // Inline text skeleton
 * <Text>
 *   <Skeleton loading={isLoading}>Lorem ipsum dolor</Skeleton>
 * </Text>
 * ```
 */
export function Skeleton({
  loading = true,
  width,
  height,
  radius = 'default',
  className,
  children,
  style,
  ...props
}: SkeletonProps) {
  // If not loading and has children, render children
  if (!loading && children) {
    return <>{children}</>;
  }

  // If not loading and no children, render nothing
  if (!loading) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-block bg-bg-weak-50 animate-pulse',
        radiusMap[radius],
        // If wrapping children, make skeleton match their size
        children && 'relative overflow-hidden',
        className
      )}
      style={{
        width: width || (children ? undefined : '100%'),
        height: height || (children ? undefined : '1em'),
        ...style,
      }}
      {...props}
    >
      {/* Hidden children to preserve dimensions */}
      {children && (
        <span className="invisible" aria-hidden="true">
          {children}
        </span>
      )}
    </span>
  );
}

/**
 * SkeletonText - Pre-styled skeleton for text content
 */
export function SkeletonText({
  lines = 1,
  className,
  ...props
}: Omit<SkeletonProps, 'children'> & { lines?: number }) {
  if (lines === 1) {
    return <Skeleton className={cn('h-4', className)} {...props} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          // Last line is shorter for natural look
          width={i === lines - 1 ? '75%' : '100%'}
          {...props}
        />
      ))}
    </div>
  );
}

