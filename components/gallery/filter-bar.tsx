'use client';

import * as Select from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BRAND_CATEGORIES, COUNTRIES } from '@/types/brand';

interface FilterBarProps {
  category?: string;
  country?: string;
  pageType?: string;
  search?: string;
  onFilterChange: (filters: {
    category?: string;
    country?: string;
    pageType?: string;
    search?: string;
  }) => void;
}

export function FilterBar({
  category,
  country,
  pageType,
  search,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className='flex flex-wrap gap-4 mb-8'>
      <Input
        placeholder='Search brands...'
        value={search || ''}
        onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
        className='flex-1 min-w-[200px]'
      />

      <Select.Root
        value={category || undefined}
        onValueChange={(value) => {
          onFilterChange({ category: value === '__all__' ? undefined : value });
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder='All Categories' />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='__all__'>All Categories</Select.Item>
          {BRAND_CATEGORIES.map((cat) => (
            <Select.Item key={cat} value={cat}>
              {cat}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root
        value={country || undefined}
        onValueChange={(value) => {
          onFilterChange({ country: value === '__all__' ? undefined : value });
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder='All Countries' />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='__all__'>All Countries</Select.Item>
          {COUNTRIES.map((c) => (
            <Select.Item key={c} value={c}>
              {c}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      <Select.Root
        value={pageType || undefined}
        onValueChange={(value) => {
          onFilterChange({ pageType: value === '__all__' ? undefined : value });
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder='All Page Types' />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value='__all__'>All Page Types</Select.Item>
          <Select.Item value='home'>Home</Select.Item>
          <Select.Item value='pdp'>Product Detail</Select.Item>
          <Select.Item value='about'>About</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}

