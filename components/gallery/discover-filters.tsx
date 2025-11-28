'use client';

import * as Select from '@/components/ui/select';
import { CategoryFilter } from '@/components/gallery/category-filter';
import type { Category, ViewType } from '@/types';

interface DiscoverFiltersProps {
  view: ViewType;
  selectedCategories: string[];
  categories: Category[];
  onViewChange: (view: ViewType) => void;
  onCategoriesChange: (categories: string[]) => void;
}

export function DiscoverFilters({
  view,
  selectedCategories,
  categories,
  onViewChange,
  onCategoriesChange,
}: DiscoverFiltersProps) {
  return (
    <div className='flex flex-wrap gap-4 mb-8 items-center' suppressHydrationWarning>
      {/* View selector */}
      <Select.Root
        value={view}
        onValueChange={(value) => onViewChange(value as ViewType)}
      >
        <Select.Trigger className='min-w-[140px]'>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='mobile'>Mobile</Select.Item>
          <Select.Item value='desktop'>Desktop</Select.Item>
        </Select.Content>
      </Select.Root>

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedSlugs={selectedCategories}
        onSelectionChange={onCategoriesChange}
      />
    </div>
  );
}

