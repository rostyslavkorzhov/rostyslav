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

export function CategoryFilterDropdown({
  categories,
  selectedSlugs,
  onToggle,
  isOpen,
  onOpenChange,
  children,
}: CategoryFilterDropdownProps) {
  // Memoize the selected slugs Set for O(1) lookup
  const selectedSet = React.useMemo(
    () => new Set(selectedSlugs),
    [selectedSlugs]
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <Popover.Content
        align='start'
        sideOffset={8}
        showArrow={false}
        className={cn(
          'w-72 p-3 rounded-2xl shadow-regular-md',
          'bg-bg-surface-800',
          'border-0',
        )}
        unstyled
      >
        <div className='flex flex-col'>
          {categories.map((category) => (
            <CategoryFilterItem
              key={category.id}
              category={category}
              isSelected={selectedSet.has(category.slug)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
