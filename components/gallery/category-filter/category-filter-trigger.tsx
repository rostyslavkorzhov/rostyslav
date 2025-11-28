import * as React from 'react';
import { cn } from '@/utils/cn';

interface CategoryFilterTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  count: number;
  isOpen?: boolean;
}

// Memoized trigger component - only re-renders when count or isOpen changes
export const CategoryFilterTrigger = React.memo(
  React.forwardRef<HTMLButtonElement, CategoryFilterTriggerProps>(
    ({ count, isOpen, className, ...props }, ref) => {
      const hasSelection = count > 0;

      return (
        <button
          ref={ref}
          type='button'
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full h-10 px-4',
            'text-label-md transition-colors duration-200 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            // Default state: light grey
            !hasSelection && [
              'bg-bg-weak-50 text-text-strong-950',
              'hover:bg-bg-soft-200',
              isOpen && 'bg-bg-soft-200',
            ],
            // Selected state: black
            hasSelection && [
              'bg-bg-strong-950 text-text-white-0',
              'hover:bg-bg-surface-800',
              isOpen && 'bg-bg-surface-800',
            ],
            className,
          )}
          aria-expanded={isOpen}
          aria-haspopup='true'
          {...props}
        >
          <span>Categories</span>
          {hasSelection && (
            <span className='flex items-center justify-center size-4 rounded-full bg-white-alpha-10 text-text-white-0 text-label-xs font-medium'>
              {count}
            </span>
          )}
        </button>
      );
    }
  )
);

CategoryFilterTrigger.displayName = 'CategoryFilterTrigger';

