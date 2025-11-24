'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Button from '@/components/ui/button';

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
      <div className='mx-auto max-w-md text-center'>
        <h1 className='text-title-h1 text-text-strong-950 mb-4'>
          Something went wrong!
        </h1>
        <p className='text-paragraph-md text-text-sub-600 mb-8'>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className='flex gap-4 justify-center'>
          <Button.Root variant='primary' onClick={reset}>
            Try again
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' asChild>
            <Link href='/'>Go back home</Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}

