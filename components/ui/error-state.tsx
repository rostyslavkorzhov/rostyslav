'use client';

import * as React from 'react';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import { RiErrorWarningLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <Alert.Root
        variant='lighter'
        status='error'
        size='large'
        className='max-w-md'
      >
        <Alert.Icon as={RiErrorWarningLine} />
        <div className='flex flex-col gap-2'>
          <h3 className='text-label-md font-medium text-text-strong-950'>
            {title}
          </h3>
          <p className='text-paragraph-sm text-text-sub-600'>{message}</p>
          {onRetry && (
            <div className='mt-4'>
              <Button.Root variant='primary' size='small' onClick={onRetry}>
                Try again
              </Button.Root>
            </div>
          )}
        </div>
      </Alert.Root>
    </div>
  );
}

