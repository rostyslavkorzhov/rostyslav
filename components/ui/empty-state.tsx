'use client';

import * as React from 'react';
import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import { RiInboxLine } from '@remixicon/react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <Alert.Root
        variant='lighter'
        status='information'
        size='large'
        className='max-w-md'
      >
        <Alert.Icon as={RiInboxLine} />
        <div className='flex flex-col gap-2'>
          <h3 className='text-label-md text-text-strong-950'>
            {title}
          </h3>
          {description && (
            <p className='text-paragraph-sm text-text-sub-600'>{description}</p>
          )}
          {action && <div className='mt-4'>{action}</div>}
        </div>
      </Alert.Root>
    </div>
  );
}

