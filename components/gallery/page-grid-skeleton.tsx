import { Skeleton } from '@/components/ui/skeleton';

interface PageGridSkeletonProps {
  /**
   * Number of skeleton cards to display
   * @default 8
   */
  count?: number;
}

/**
 * Skeleton loader for PageGrid
 *
 * Matches the exact layout of PageGrid cards:
 * - Responsive grid (3 columns mobile, 2 columns desktop)
 * - Grey background card with screenshot area
 * - Brand logo and details below
 *
 * Used as Suspense fallback when filtering triggers data refetch.
 */
export function PageGridSkeleton({ count = 8 }: PageGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PageCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Individual card skeleton matching PageCard structure
 */
function PageCardSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Grey background card with screenshot area */}
      <div className="bg-bg-weak-50 rounded-lg p-8 overflow-hidden">
        <Skeleton
          className="aspect-video w-full"
          radius="none"
        />
      </div>

      {/* Brand details section */}
      <div className="mt-3 flex items-start gap-2">
        {/* Logo skeleton - 40px square with rounded-xl */}
        <Skeleton
          className="size-10 shrink-0 rounded-xl"
          radius="none"
        />

        {/* Text skeletons */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Brand name skeleton */}
          <Skeleton className="h-4" width="70%" />
          {/* Category skeleton */}
          <Skeleton className="h-4" width="50%" />
        </div>
      </div>
    </div>
  );
}

