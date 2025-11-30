'use client';

import * as SegmentedControl from '@/components/ui/segmented-control';
import { CategoryFilter } from '@/components/gallery/category-filter';
import { useDiscoverFilters } from '@/hooks/use-discover-filters';
import type { Category, ViewType } from '@/types';

interface DiscoverFiltersProps {
  categories: Category[];
}

export function DiscoverFilters({ categories }: DiscoverFiltersProps) {
  const [filters, setFilters] = useDiscoverFilters();

  const handleViewChange = (view: ViewType) => {
    setFilters({ view });
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setFilters({ categories: newCategories });
  };

  return (
    <div className='flex justify-between items-center mb-8 gap-4' suppressHydrationWarning>
      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedSlugs={filters.categories}
        onSelectionChange={handleCategoriesChange}
      />

      {/* View selector */}
      <SegmentedControl.Root
        value={filters.view}
        onValueChange={(value) => handleViewChange(value as ViewType)}
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='mobile'>Mobile</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='desktop'>Desktop</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
}

