'use client';

import * as React from 'react';
import * as ProgressCircle from '@/components/ui/progress-circle';
import { cn } from '@/utils/cn';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeMap = {
  small: '48' as const,
  medium: '64' as const,
  large: '80' as const,
};

export function LoadingState({
  message = 'Loading...',
  size = 'medium',
  className,
}: LoadingStateProps) {
  const progressSize = sizeMap[size];
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 0 : prev + 10));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12',
        className,
      )}
    >
      <ProgressCircle.Root size={progressSize} value={progress}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='size-2 rounded-full bg-primary-base' />
        </div>
      </ProgressCircle.Root>
      {message && (
        <p className='text-paragraph-sm text-text-sub-600'>{message}</p>
      )}
    </div>
  );
}

