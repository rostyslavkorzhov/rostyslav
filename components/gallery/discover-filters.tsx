'use client';

import { useEffect, useState } from 'react';
import * as Select from '@/components/ui/select';
import * as Checkbox from '@/components/ui/checkbox';
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
  const [isAllSelected, setIsAllSelected] = useState(
    selectedCategories.length === 0 || selectedCategories.length === categories.length
  );

  useEffect(() => {
    setIsAllSelected(
      selectedCategories.length === 0 || selectedCategories.length === categories.length
    );
  }, [selectedCategories, categories.length]);

  const handleCategoryToggle = (categorySlug: string) => {
    if (categorySlug === '__all__') {
      if (isAllSelected) {
        onCategoriesChange([]);
      } else {
        onCategoriesChange(categories.map((c) => c.slug));
      }
    } else {
      if (selectedCategories.includes(categorySlug)) {
        onCategoriesChange(selectedCategories.filter((s) => s !== categorySlug));
      } else {
        onCategoriesChange([...selectedCategories, categorySlug]);
      }
    }
  };

  return (
    <div className='flex flex-wrap gap-4 mb-8' suppressHydrationWarning>
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

      {/* Category checkboxes */}
      <div className='flex flex-wrap gap-3 items-center'>
        <label className='text-label-sm text-text-sub-600 mr-2'>Categories:</label>
        <div className='flex items-center gap-2'>
          <Checkbox.Root
            id='category-all'
            checked={isAllSelected}
            onCheckedChange={() => handleCategoryToggle('__all__')}
          />
          <label
            htmlFor='category-all'
            className='text-label-sm text-text-strong-950 cursor-pointer'
          >
            All
          </label>
        </div>
        {categories.map((category) => (
          <div key={category.id} className='flex items-center gap-2'>
            <Checkbox.Root
              id={`category-${category.slug}`}
              checked={selectedCategories.includes(category.slug)}
              onCheckedChange={() => handleCategoryToggle(category.slug)}
            />
            <label
              htmlFor={`category-${category.slug}`}
              className='text-label-sm text-text-strong-950 cursor-pointer'
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

