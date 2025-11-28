import * as React from 'react';
import { cn } from '@/utils/cn';
import { getCategoryIcon } from './category-icons';
import type { Category } from '@/types';

interface CategoryFilterItemProps {
  category: Category;
  isSelected: boolean;
  onToggle: () => void;
}

export function CategoryFilterItem({
  category,
  isSelected,
  onToggle,
}: CategoryFilterItemProps) {
  const Icon = getCategoryIcon(category.slug);

  return (
    <button
      type='button'
      onClick={onToggle}
      className={cn(
        'w-full flex items-center gap-4 h-10 px-3 rounded-xl',
        'text-left transition-colors duration-200 ease-out',
        'hover:bg-white-alpha-10',
        'focus:outline-none focus-visible:bg-white-alpha-10',
      )}
    >
      {/* Selection indicator */}
      <div className='flex items-center justify-center shrink-0 size-5 rounded'>
        {isSelected ? (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='size-5'
          >
            <rect width='20' height='20' rx='4' fill='white' fillOpacity='0.12' />
            <path
              d='M8.33333 13.7292L5 10.3958L6.0625 9.33333L8.33333 11.6042L13.9375 6L15 7.0625L8.33333 13.7292Z'
              fill='white'
            />
          </svg>
        ) : (
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='size-5'
          >
            <rect width='20' height='20' rx='4' fill='white' fillOpacity='0.12' />
          </svg>
        )}
      </div>

      {/* Category name */}
      <span className='flex-1 text-label-md text-text-white-0 truncate'>{category.name}</span>

      {/* Category icon */}
      <Icon className='size-4 shrink-0 text-text-soft-400' />
    </button>
  );
}

