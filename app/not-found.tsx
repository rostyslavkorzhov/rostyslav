import Link from 'next/link';
import * as Button from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='container mx-auto flex flex-1 items-center justify-center px-5 py-8'>
      <div className='mx-auto max-w-md text-center'>
        <h1 className='text-title-h1 text-text-strong-950 mb-4'>404</h1>
        <h2 className='text-title-h3 text-text-strong-950 mb-2'>
          Page Not Found
        </h2>
        <p className='text-paragraph-md text-text-sub-600 mb-8'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button.Root variant='primary' asChild>
          <Link href='/'>Go back home</Link>
        </Button.Root>
      </div>
    </div>
  );
}

