'use client';

import * as React from 'react';
import * as Popover from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { CategoryFilterItem } from './category-filter-item';
import type { Category } from '@/types';

interface CategoryFilterDropdownProps {
  categories: Category[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CategoryFilterDropdown = React.memo(function CategoryFilterDropdown({
  categories,
  selectedSlugs,
  onToggle,
  isOpen,
  onOpenChange,
  children,
}: CategoryFilterDropdownProps) {
  // Convert selectedSlugs array to Set for O(1) lookup instead of O(n)
  const selectedSlugsSet = React.useMemo(
    () => new Set(selectedSlugs),
    [selectedSlugs],
  );

  // Memoize toggle handlers to prevent creating new functions on every render
  const toggleHandlers = React.useMemo(() => {
    const handlers = new Map<string, () => void>();
    categories.forEach((category) => {
      handlers.set(category.slug, () => onToggle(category.slug));
    });
    return handlers;
  }, [categories, onToggle]);

  const contentClassName = React.useMemo(
    () =>
      cn(
        'w-72 p-3 rounded-2xl shadow-regular-md',
        'bg-bg-surface-800',
        'border-0',
      ),
    [],
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content
        align='start'
        sideOffset={8}
        showArrow={false}
        className={contentClassName}
        unstyled
      >
        <div className='flex flex-col'>
          {categories.map((category) => (
            <CategoryFilterItem
              key={category.id}
              category={category}
              isSelected={selectedSlugsSet.has(category.slug)}
              onToggle={toggleHandlers.get(category.slug) ?? (() => onToggle(category.slug))}
            />
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
});

