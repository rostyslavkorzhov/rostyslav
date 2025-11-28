import * as React from 'react';
import { cn } from '@/utils/cn';
import { getCategoryIcon } from './category-icons';
import type { Category } from '@/types';

// Pre-compute static classNames
const PILLS_CONTAINER_CLASS = 'flex items-center gap-2';
const PILL_BUTTON_CLASS = cn(
  'inline-flex items-center gap-1.5 h-10 px-4 rounded-full',
  'bg-bg-weak-50',
  'text-label-md text-text-strong-950',
  'transition-colors duration-200 ease-out',
  'hover:bg-bg-soft-200',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
);
const PILL_ICON_CLASS = 'size-4 shrink-0 text-text-sub-600';

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedSlugs: string[];
  onRemove: (slug: string) => void;
  className?: string;
}

interface CategoryPillProps {
  category: Category;
  onRemove: (slug: string) => void;
}

// Memoized pill component to prevent unnecessary re-renders
const CategoryPill = React.memo(function CategoryPill({
  category,
  onRemove,
}: CategoryPillProps) {
  const Icon = getCategoryIcon(category.slug);
  const handleClick = React.useCallback(() => {
    onRemove(category.slug);
  }, [category.slug, onRemove]);

  return (
    <button
      type='button'
      onClick={handleClick}
      className={PILL_BUTTON_CLASS}
    >
      <span>{category.name}</span>
      <Icon className={PILL_ICON_CLASS} />
    </button>
  );
});

export const CategoryFilterPills = React.memo(function CategoryFilterPills({
  categories,
  selectedSlugs,
  onRemove,
  className,
}: CategoryFilterPillsProps) {
  // Memoize filtered categories to avoid re-filtering on every render
  const selectedCategories = React.useMemo(
    () => categories.filter((cat) => selectedSlugs.includes(cat.slug)),
    [categories, selectedSlugs],
  );

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className={cn(PILLS_CONTAINER_CLASS, className)}>
      {selectedCategories.map((category) => (
        <CategoryPill key={category.id} category={category} onRemove={onRemove} />
      ))}
    </div>
  );
});

