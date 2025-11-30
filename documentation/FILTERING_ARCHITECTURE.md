# Filtering Architecture: Problem Analysis & Solution

> **Purpose:** This document describes the current filtering issues in the Discover pages and outlines the recommended solution architecture for implementation.

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Current Architecture](#current-architecture)
- [Problem Analysis](#problem-analysis)
- [Recommended Solution](#recommended-solution)
- [Implementation Plan](#implementation-plan)
- [Technical Specifications](#technical-specifications)
- [Migration Strategy](#migration-strategy)

---

## Executive Summary

### The Problem
When users interact with filters on Discover pages (`/discover/[type]`), the UI exhibits several issues:
1. **Slow perceived response** – Despite optimistic state updates, there's a visible delay
2. **Filter pills reshuffle** – Pills appear to jump/reorganize unexpectedly
3. **URL doesn't update instantly** – Parameters lag behind user interactions
4. **Full page re-renders** – Every filter change triggers complete page reload

### The Solution
Implement **shallow URL updates with streaming data** using:
- **nuqs** for instant, shallow URL state management
- **Suspense boundaries** for isolated loading states
- **Streaming pattern** where only the results grid re-renders
- **Stable component keys** to prevent unnecessary remounts

### Expected Outcomes
- ✅ Instant URL updates (< 16ms)
- ✅ Stable filter pills (no reshuffling)
- ✅ Only results area shows loading state
- ✅ Shareable/bookmarkable filter URLs
- ✅ Back/forward browser navigation works correctly

---

## Current Architecture

### Component Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  app/discover/[type]/page.tsx (Server Component)               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Parse searchParams (categories, view)                 │  │
│  │  2. Fetch categories from Supabase                        │  │
│  │  3. Fetch pages with filters from Supabase                │  │
│  │  4. Pass all data to DiscoverClient                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  discover-client.tsx (Client Component)                   │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  • Maintains optimisticView, optimisticCategories   │  │  │
│  │  │  • useEffect syncs optimistic state with URL        │  │  │
│  │  │  • updateFilters() calls router.replace()           │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                         ↓                                 │  │
│  │  ┌─────────────────────┐  ┌────────────────────────────┐  │  │
│  │  │  DiscoverFilters    │  │  PageGrid                  │  │  │
│  │  │  • CategoryFilter   │  │  • Renders page cards      │  │  │
│  │  │  • ViewSelector     │  │  • Shows empty state       │  │  │
│  │  └─────────────────────┘  └────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Current Data Flow (On Filter Change)

```
User clicks category checkbox
         ↓
setOptimisticCategories(newCategories)  ← Immediate (good!)
         ↓
startTransition(() => {
  router.replace(`/discover/${type}?${params}`)  ← Full navigation
})
         ↓
┌─────────────────────────────────────────┐
│  Next.js triggers full server render:   │
│  1. loading.tsx shows                   │
│  2. page.tsx re-executes                │
│  3. Categories re-fetched (unnecessary) │
│  4. Pages re-fetched with new filters   │
│  5. Entire component tree rebuilt       │
└─────────────────────────────────────────┘
         ↓
useEffect fires (syncs optimistic state with new URL)
         ↓
Another render cycle (causes pill reshuffle)
```

### Key Files

| File | Role |
|------|------|
| `app/discover/[type]/page.tsx` | Server Component, data fetching |
| `app/discover/[type]/discover-client.tsx` | Client wrapper, state management |
| `app/discover/[type]/loading.tsx` | Full page loading state |
| `components/gallery/discover-filters.tsx` | Filter UI container |
| `components/gallery/category-filter/` | Category dropdown & pills |
| `components/gallery/page-grid.tsx` | Results grid |
| `lib/clients/supabase.client.ts` | Data fetching queries |

---

## Problem Analysis

### Problem 1: Full Navigation on Filter Change

**Location:** `discover-client.tsx` line 71-73

```typescript
startTransition(() => {
  router.replace(`/discover/${type}?${params.toString()}`);
});
```

**Impact:**
- `router.replace()` is a **navigation**, not a URL update
- Next.js treats this as a new page request
- Server Component re-executes entirely
- All child components unmount and remount
- `loading.tsx` shows, replacing the entire page

**Why it matters:**
The user sees a flash of loading content, then the entire UI rebuilds. Even though optimistic state updates the checkbox immediately, the surrounding context (pills, grid) gets destroyed and recreated.

---

### Problem 2: Double State Management

**Location:** `discover-client.tsx` lines 34-48

```typescript
// Optimistic state
const [optimisticView, setOptimisticView] = useState<ViewType>(initialView);
const [optimisticCategories, setOptimisticCategories] = useState<string[]>(
  initialSelectedCategories
);

// Sync with URL
useEffect(() => {
  const urlView = (searchParams.get('view') || initialView) as ViewType;
  const urlCategories = searchParams.get('categories')?.split(',') || initialSelectedCategories;

  setOptimisticView(urlView);
  setOptimisticCategories(urlCategories);
}, [searchParams, initialView, initialSelectedCategories]);
```

**Impact:**
- State exists in 3 places: optimistic state, URL params, initial props
- When server re-renders, `initialSelectedCategories` changes
- This triggers `useEffect`, causing another state update
- Two renders happen: one from new props, one from effect

**Why it matters:**
This creates a brief moment where pills might render with old state, then immediately re-render with new state, causing visual "jumping."

---

### Problem 3: Inefficient Database Queries

**Location:** `lib/clients/supabase.client.ts` lines 37-158

```typescript
async listPagesByType(filters: PageFilters = {}) {
  // Query 1: Get page_type_id
  const { data: pageType } = await this.client
    .from('page_types')
    .select('id')
    .eq('slug', page_type_slug)
    .single();

  // Query 2: Get category IDs (if filtering)
  const { data: categories } = await this.client
    .from('categories')
    .select('id')
    .in('slug', category_slugs);

  // Query 3: Get brand IDs for those categories
  const { data: brands } = await this.client
    .from('brands')
    .select('id')
    .in('category_id', category_ids);

  // Query 4: Get pages
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
}
```

**Impact:**
- 4 sequential database round-trips per filter change
- Each query waits for the previous one
- ~100-200ms latency added per query
- Total: 400-800ms just for database operations

**Why it matters:**
Even with perfect UI patterns, the backend latency makes the experience feel slow.

---

### Problem 4: No Suspense Boundaries for Partial Loading

**Location:** `app/discover/[type]/loading.tsx`

```typescript
export default function Loading() {
  return (
    <PageContainer>
      <LoadingState message='Loading pages...' />
    </PageContainer>
  );
}
```

**Impact:**
- Loading state replaces the **entire page**
- Filters, header, and all context disappear
- User loses their place in the interface

**Why it matters:**
Best practice is to show skeleton/loading only where content is changing. Filters should remain visible and interactive during data loading.

---

### Problem 5: Not Using nuqs

**Expected (per .cursorrules):**
> Use 'nuqs' for URL search parameter state management

**Actual:**
- nuqs is not installed
- Manual `useSearchParams` + `router.replace` pattern
- No shallow URL updates

**Impact:**
- Missed optimization opportunity
- More complex code than necessary
- No built-in debouncing or type safety

---

## Recommended Solution

### New Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  app/discover/[type]/page.tsx (Server Component)               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Fetch categories ONLY (stable data)                   │  │
│  │  2. Pass to DiscoverPage (client)                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  discover-page.tsx (Client Component)                     │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  • nuqs manages URL state (view, categories)        │  │  │
│  │  │  • No optimistic state needed (nuqs is instant)     │  │  │
│  │  │  • Stable filter components                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                         ↓                                 │  │
│  │  ┌─────────────────────┐                                  │  │
│  │  │  DiscoverFilters    │  ← Updates URL instantly         │  │
│  │  │  • CategoryFilter   │                                  │  │
│  │  │  • ViewSelector     │                                  │  │
│  │  └─────────────────────┘                                  │  │
│  │                         ↓                                 │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  Suspense (key={filterKey})                        │   │  │
│  │  │  ┌──────────────────────────────────────────────┐  │   │  │
│  │  │  │  fallback={<PageGridSkeleton />}             │  │   │  │
│  │  │  └──────────────────────────────────────────────┘  │   │  │
│  │  │  ┌──────────────────────────────────────────────┐  │   │  │
│  │  │  │  PageGridServer (Server Component)           │  │   │  │
│  │  │  │  • Fetches pages based on filters            │  │   │  │
│  │  │  │  • Streams results                           │  │   │  │
│  │  │  └──────────────────────────────────────────────┘  │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### New Data Flow (On Filter Change)

```
User clicks category checkbox
         ↓
nuqs.setCategories([...newCategories])
         ↓
┌─────────────────────────────────────────┐
│  Instant (< 16ms):                      │
│  • URL updates immediately (shallow)    │
│  • Filter pills update (same component) │
│  • Suspense key changes                 │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Streaming (parallel):                  │
│  • PageGridSkeleton shows               │
│  • Server fetches filtered pages        │
│  • Results stream in                    │
│  • Skeleton replaced with real content  │
└─────────────────────────────────────────┘
         ↓
Done (filters never remounted, URL is shareable)
```

### Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| URL Update | ~200ms (full navigation) | < 16ms (shallow) |
| Filter Pills | Remount (reshuffle) | Stable (same instance) |
| Loading State | Full page | Grid skeleton only |
| Data Fetching | 4 sequential queries | 1 optimized query |
| State Management | 3 sources of truth | 1 (URL via nuqs) |

---

## Implementation Plan

### Phase 1: Install Dependencies

```bash
pnpm add nuqs
```

### Phase 2: Create URL State Hook

Create a custom hook that defines the URL schema for filter state:

**File:** `hooks/use-discover-filters.ts`

```typescript
import { parseAsString, parseAsArrayOf, useQueryStates } from 'nuqs';

export const filtersParsers = {
  view: parseAsString.withDefault('mobile'),
  categories: parseAsArrayOf(parseAsString, ',').withDefault([]),
};

export function useDiscoverFilters() {
  return useQueryStates(filtersParsers, {
    shallow: true, // Don't trigger server navigation
    history: 'replace', // Replace history entry, don't push
  });
}
```

### Phase 3: Create Skeleton Component

**File:** `components/gallery/page-grid-skeleton.tsx`

```typescript
export function PageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden">
          <div className="aspect-video bg-bg-weak-50 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-5 w-2/3 bg-bg-weak-50 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-bg-weak-50 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Phase 4: Restructure Server Component

**File:** `app/discover/[type]/page.tsx`

```typescript
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/clients/supabase-server';
import { DiscoverFilters } from '@/components/gallery/discover-filters';
import { PageGridServer } from './page-grid-server';
import { PageGridSkeleton } from '@/components/gallery/page-grid-skeleton';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PageTypeSlug } from '@/types';

const VALID_TYPES: PageTypeSlug[] = ['product', 'home', 'about'];

async function getCategories() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  return data || [];
}

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ view?: string; categories?: string }>;
}

export default async function DiscoverPage({ params, searchParams }: Props) {
  const { type } = await params;
  const { view = 'mobile', categories = '' } = await searchParams;

  if (!VALID_TYPES.includes(type as PageTypeSlug)) {
    notFound();
  }

  const categoriesData = await getCategories();
  const categoryList = categories ? categories.split(',').filter(Boolean) : [];

  // Create stable key for Suspense boundary
  const filterKey = `${view}-${categoryList.sort().join(',')}`;

  return (
    <NuqsAdapter>
      <PageContainer>
        {/* Header - stable, never re-renders on filter change */}
        <div className="mb-8 text-center">
          <h1 className="text-title-h1 text-text-strong-950 mb-4">
            Discover {type.charAt(0).toUpperCase() + type.slice(1)} Pages
          </h1>
        </div>

        {/* Filters - client component with nuqs */}
        <DiscoverFilters categories={categoriesData} />

        {/* Results - isolated Suspense boundary */}
        <Suspense key={filterKey} fallback={<PageGridSkeleton />}>
          <PageGridServer
            type={type as PageTypeSlug}
            view={view}
            categories={categoryList}
          />
        </Suspense>
      </PageContainer>
    </NuqsAdapter>
  );
}
```

### Phase 5: Create Server Component for Grid

**File:** `app/discover/[type]/page-grid-server.tsx`

```typescript
import { getPageService } from '@/lib/services';
import { PageGrid } from '@/components/gallery/page-grid';
import type { PageTypeSlug, ViewType } from '@/types';

interface Props {
  type: PageTypeSlug;
  view: string;
  categories: string[];
}

export async function PageGridServer({ type, view, categories }: Props) {
  const result = await getPageService().listPagesByType({
    page_type_slug: type,
    view: view as ViewType,
    category_slugs: categories.length > 0 ? categories : undefined,
    limit: 20,
    offset: 0,
  });

  return (
    <>
      <PageGrid pages={result.data} />
      {result.hasMore && (
        <div className="mt-8 text-center">
          <p className="text-label-sm text-text-sub-600">
            Showing {result.data.length} of {result.count} pages
          </p>
        </div>
      )}
    </>
  );
}
```

### Phase 6: Update Filters Component

**File:** `components/gallery/discover-filters.tsx`

```typescript
'use client';

import * as SegmentedControl from '@/components/ui/segmented-control';
import { CategoryFilter } from '@/components/gallery/category-filter';
import { useDiscoverFilters } from '@/hooks/use-discover-filters';
import type { Category, ViewType } from '@/types';

interface Props {
  categories: Category[];
}

export function DiscoverFilters({ categories }: Props) {
  const [filters, setFilters] = useDiscoverFilters();

  const handleViewChange = (view: ViewType) => {
    setFilters({ view });
  };

  const handleCategoriesChange = (newCategories: string[]) => {
    setFilters({ categories: newCategories });
  };

  return (
    <div className="flex justify-between items-center mb-8 gap-4">
      <CategoryFilter
        categories={categories}
        selectedSlugs={filters.categories}
        onSelectionChange={handleCategoriesChange}
      />

      <SegmentedControl.Root
        value={filters.view}
        onValueChange={(value) => handleViewChange(value as ViewType)}
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value="mobile">Mobile</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value="desktop">Desktop</SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
}
```

### Phase 7: Optimize Database Query

**File:** `lib/clients/supabase.client.ts`

Replace the multi-query approach with a single optimized query:

```typescript
async listPagesByType(filters: PageFilters = {}) {
  const {
    page_type_slug,
    view = 'mobile',
    category_slugs,
    limit = 20,
    offset = 0,
  } = filters;

  let query = this.client
    .from('pages')
    .select(`
      *,
      brand:brands!inner(*, category:categories!inner(*)),
      page_type:page_types!inner(*)
    `, { count: 'exact' })
    .eq('page_type.slug', page_type_slug)
    .eq('view', view)
    .eq('brand.is_published', true);

  // Filter by category slugs in one query
  if (category_slugs && category_slugs.length > 0) {
    query = query.in('brand.category.slug', category_slugs);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // ... error handling
}
```

### Phase 8: Delete Obsolete Files

Remove:
- `app/discover/[type]/discover-client.tsx`
- `app/discover/[type]/loading.tsx` (replaced by Suspense)

---

## Technical Specifications

### nuqs Configuration

```typescript
// nuqs options
{
  shallow: true,    // Don't trigger full navigation
  history: 'replace', // Don't add to browser history stack
  scroll: false,    // Don't scroll to top
}
```

### Suspense Key Strategy

The key format ensures React knows when to show loading state:

```typescript
const filterKey = `${view}-${categories.sort().join(',')}`;
```

- Sorting categories ensures consistent keys regardless of selection order
- Key changes → Suspense boundary resets → Skeleton shows

### TypeScript Types

```typescript
// hooks/use-discover-filters.ts
interface DiscoverFilters {
  view: string;
  categories: string[];
}

type SetFilters = (
  values: Partial<DiscoverFilters>
) => Promise<URLSearchParams>;
```

---

## Migration Strategy

### Step-by-Step Migration

1. **Install nuqs** (non-breaking)
2. **Create new components** alongside existing ones
3. **Test new flow** on development
4. **Switch page.tsx** to new architecture
5. **Remove old components**
6. **Optimize database query** (independent improvement)

### Rollback Plan

If issues arise:
1. Revert `page.tsx` to use `DiscoverClient`
2. Keep old components until new flow is stable

### Testing Checklist

- [ ] URL updates instantly on filter change
- [ ] Filter pills don't reshuffle
- [ ] Skeleton shows only in grid area
- [ ] Browser back/forward works correctly
- [ ] Shared URLs load correct filters
- [ ] Empty state displays correctly
- [ ] Mobile responsive behavior unchanged

---

## Related Documentation

- [Lessons Learned](./LESSONS_LEARNED.md) - Previous optimization patterns
- [Component Library Audit](./COMPONENT_LIBRARY_AUDIT.md) - UI component usage
- [Architecture Analysis](./architecture-analysis.md) - Overall system design
- [nuqs Documentation](https://nuqs.47ng.com/) - External library docs

---

## Appendix: Alternative Approaches Considered

### A. Client-Side Filtering
**Rejected because:** Dataset may grow beyond browser memory limits; doesn't scale.

### B. React Query + Client Fetching
**Rejected because:** Adds complexity; Server Components are already optimized for this.

### C. Server Actions
**Considered for future:** Could replace Suspense pattern but requires more complex state management.

---

*Document created: November 2024*
*Last updated: November 2024*

