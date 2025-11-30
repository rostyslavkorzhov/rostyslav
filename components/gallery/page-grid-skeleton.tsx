import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for PageGrid component
 * Matches the exact layout and structure of PageGrid for smooth loading transitions
 */
export function PageGridSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden'
        >
          {/* Image skeleton - matches aspect-video */}
          <Skeleton className='aspect-video w-full' />

          {/* Content skeleton - matches p-4 padding */}
          <div className='p-4 space-y-3'>
            {/* Title skeleton - matches text-title-h4 */}
            <Skeleton height='1.5rem' width='75%' />

            {/* Metadata skeleton - matches text-label-sm */}
            <div className='flex items-center gap-2'>
              <Skeleton height='1rem' width='5rem' />
              <span className='text-text-sub-400'>•</span>
              <Skeleton height='1rem' width='4rem' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

