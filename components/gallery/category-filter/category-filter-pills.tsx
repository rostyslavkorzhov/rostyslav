import * as React from 'react';
import { cn } from '@/utils/cn';
import { getCategoryIcon } from './category-icons';
import type { Category } from '@/types';

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedSlugs: string[];
  onRemove: (slug: string) => void;
  className?: string;
}

export function CategoryFilterPills({
  categories,
  selectedSlugs,
  onRemove,
  className,
}: CategoryFilterPillsProps) {
  const selectedCategories = categories.filter((cat) =>
    selectedSlugs.includes(cat.slug),
  );

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {selectedCategories.map((category) => {
        const Icon = getCategoryIcon(category.slug);
        return (
          <button
            key={category.id}
            type='button'
            onClick={() => onRemove(category.slug)}
            className={cn(
              'inline-flex items-center gap-1.5 h-10 px-4 rounded-full',
              'bg-bg-weak-50',
              'text-label-md text-text-strong-950',
              'transition-colors duration-200 ease-out',
              'hover:bg-bg-soft-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
            )}
          >
            <span>{category.name}</span>
            <Icon className='size-4 shrink-0 text-text-sub-600' />
          </button>
        );
      })}
    </div>
  );
}

