import * as React from 'react';
import { cn } from '@/utils/cn';
import { getCategoryIcon } from './category-icons';
import type { Category } from '@/types';

interface CategoryFilterPillsProps {
  categories: Category[];
  selectedSlugs: string[];
  onRemove: (slug: string) => void;
  className?: string;
}

// Memoize individual pill button to prevent unnecessary re-renders
const CategoryPill = React.memo(function CategoryPill({
  category,
  onRemove,
}: {
  category: Category;
  onRemove: (slug: string) => void;
}) {
  const Icon = React.useMemo(() => getCategoryIcon(category.slug), [category.slug]);

  const handleClick = React.useCallback(() => {
    onRemove(category.slug);
  }, [category.slug, onRemove]);

  // Pre-compute static className string
  const buttonClassName = React.useMemo(
    () =>
      cn(
        'inline-flex items-center gap-1.5 h-10 px-4 rounded-full',
        'bg-bg-weak-50',
        'text-label-md text-text-strong-950',
        'transition-colors duration-200 ease-out',
        'hover:bg-bg-soft-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2',
      ),
    [],
  );

  const iconClassName = React.useMemo(
    () => 'size-4 shrink-0 text-text-sub-600',
    [],
  );

  return (
    <button
      type='button'
      onClick={handleClick}
      className={buttonClassName}
    >
      <span>{category.name}</span>
      <Icon className={iconClassName} />
    </button>
  );
});

export const CategoryFilterPills = React.memo(function CategoryFilterPills({
  categories,
  selectedSlugs,
  onRemove,
  className,
}: CategoryFilterPillsProps) {
  // Convert selectedSlugs to Set for O(1) lookup
  const selectedSlugsSet = React.useMemo(
    () => new Set(selectedSlugs),
    [selectedSlugs],
  );

  // Memoize filtered categories to avoid re-filtering on every render
  const selectedCategories = React.useMemo(
    () => categories.filter((cat) => selectedSlugsSet.has(cat.slug)),
    [categories, selectedSlugsSet],
  );

  if (selectedCategories.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {selectedCategories.map((category) => (
        <CategoryPill key={category.id} category={category} onRemove={onRemove} />
      ))}
    </div>
  );
});

