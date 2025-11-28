'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { CategoryFilterTrigger } from './category-filter-trigger';
import { CategoryFilterDropdown } from './category-filter-dropdown';
import { CategoryFilterPills } from './category-filter-pills';
import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedSlugs: string[];
  onSelectionChange: (slugs: string[]) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedSlugs,
  onSelectionChange,
  className,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = (slug: string) => {
    if (selectedSlugs.includes(slug)) {
      onSelectionChange(selectedSlugs.filter((s) => s !== slug));
    } else {
      onSelectionChange([...selectedSlugs, slug]);
    }
  };

  const handleClear = () => {
    onSelectionChange([]);
  };

  const selectedCount = selectedSlugs.length;
  const hasSelection = selectedCount > 0;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <CategoryFilterDropdown
        categories={categories}
        selectedSlugs={selectedSlugs}
        onToggle={handleToggle}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <CategoryFilterTrigger count={selectedCount} isOpen={isOpen} />
      </CategoryFilterDropdown>

      <CategoryFilterPills
        categories={categories}
        selectedSlugs={selectedSlugs}
        onRemove={handleToggle}
      />

      {hasSelection && (
        <button
          type='button'
          onClick={handleClear}
          className={cn(
            'text-label-md text-text-soft-400',
            'transition-colors duration-200 ease-out',
            'hover:text-text-strong-950',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
          )}
        >
          Clear
        </button>
      )}
    </div>
  );
}

