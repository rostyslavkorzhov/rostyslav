'use client';

import { Select } from '@/components/ui/select';
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

      <Select
        value={category || ''}
        onChange={(e) => onFilterChange({ category: e.target.value || undefined })}
      >
        <option value=''>All Categories</option>
        {BRAND_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>

      <Select
        value={country || ''}
        onChange={(e) => onFilterChange({ country: e.target.value || undefined })}
      >
        <option value=''>All Countries</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Select>

      <Select
        value={pageType || ''}
        onChange={(e) => onFilterChange({ pageType: e.target.value || undefined })}
      >
        <option value=''>All Page Types</option>
        <option value='home'>Home</option>
        <option value='pdp'>Product Detail</option>
        <option value='about'>About</option>
      </Select>
    </div>
  );
}

