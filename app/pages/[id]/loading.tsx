import { PageContainer } from '@/components/page-container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <PageContainer>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Screenshot Viewer Skeleton */}
        <div>
          <div className='mb-4'>
            <Skeleton width='200px' height='40px' />
          </div>
          <Skeleton
            width='100%'
            height='600px'
            radius='default'
            className='rounded-lg border border-stroke-soft-200'
          />
        </div>

        {/* Info Panel Skeleton */}
        <div>
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            {/* Title */}
            <Skeleton width='60%' height='32px' className='mb-2' />
            {/* Category */}
            <Skeleton width='40%' height='20px' className='mb-6' />

            <div className='space-y-4'>
              {/* Page Type */}
              <div>
                <Skeleton width='80px' height='16px' className='mb-1' />
                <Skeleton width='50%' height='20px' />
              </div>

              {/* View */}
              <div>
                <Skeleton width='60px' height='16px' className='mb-1' />
                <Skeleton width='40%' height='20px' />
              </div>

              {/* Page URL */}
              <div>
                <Skeleton width='90px' height='16px' className='mb-1' />
                <Skeleton width='100%' height='20px' />
              </div>

              {/* Captured Month */}
              <div>
                <Skeleton width='120px' height='16px' className='mb-1' />
                <Skeleton width='30%' height='20px' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

