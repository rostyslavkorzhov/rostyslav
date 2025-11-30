'use client';

import * as SegmentedControl from '@/components/ui/segmented-control';
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
    <div className='flex justify-between items-center mb-8 gap-4' suppressHydrationWarning>
      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedSlugs={selectedCategories}
        onSelectionChange={onCategoriesChange}
      />

      {/* View selector */}
      <SegmentedControl.Root
        value={view}
        onValueChange={(value) => onViewChange(value as ViewType)}
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='mobile'>Mobile</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='desktop'>Desktop</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
}
