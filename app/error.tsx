'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Button from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='container mx-auto flex flex-1 items-center justify-center px-5 py-8'>
      <div className='mx-auto max-w-md'>
        <ErrorState
          title='Something went wrong!'
          message={error.message || 'An unexpected error occurred. Please try again.'}
          onRetry={reset}
        />
        <div className='mt-4 flex justify-center'>
          <Button.Root variant='neutral' mode='stroke' asChild>
            <Link href='/'>Go back home</Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}

