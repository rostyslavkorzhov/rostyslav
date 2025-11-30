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
 * - Responsive grid (1-4 columns)
 * - Card with aspect-video image area
 * - Content area with title and metadata
 *
 * Used as Suspense fallback when filtering triggers data refetch.
 */
export function PageGridSkeleton({ count = 8 }: PageGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PageCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Individual card skeleton matching PageGrid card structure
 */
function PageCardSkeleton() {
  return (
    <div className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden">
      {/* Image area - matches aspect-video */}
      <Skeleton
        className="aspect-video w-full"
        radius="none"
      />

      {/* Content area - matches p-4 */}
      <div className="p-4">
        {/* Title skeleton - matches text-title-h4 */}
        <Skeleton
          className="h-5 mb-2"
          width="65%"
        />

        {/* Metadata skeleton - matches the flex row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4" width="60px" radius="small" />
          <span className="text-text-soft-400">•</span>
          <Skeleton className="h-4" width="50px" radius="small" />
        </div>
      </div>
    </div>
  );
}

