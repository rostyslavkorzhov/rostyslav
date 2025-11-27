import Link from 'next/link';
import * as Button from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';

export default function NotFound() {
  return (
    <div className='container mx-auto flex flex-1 items-center justify-center px-5 py-8'>
      <div className='mx-auto max-w-md'>
        <ErrorState
          title='Page Not Found'
          message="The page you're looking for doesn't exist or has been moved."
        />
        <div className='mt-4 flex justify-center'>
          <Button.Root variant='primary' asChild>
            <Link href='/'>Go back home</Link>
          </Button.Root>
        </div>
      </div>
    </div>
  );
}

