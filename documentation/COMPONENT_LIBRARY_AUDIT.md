# AlignUI Component Library Audit Report

**Date:** December 2024  
**Project:** Best of Ecom  
**Design System:** AlignUI

## Executive Summary

This audit identified several instances where the codebase deviated from the AlignUI design system by using native HTML elements instead of AlignUI components. All identified issues have been fixed to ensure consistency with the design system.

## Issues Found & Fixed

### 1. ✅ FilterBar Component - Native HTML Select Elements
**Location:** `components/gallery/filter-bar.tsx`

**Issue:** The FilterBar component was using native HTML `<select>` elements for category, country, and page type filters instead of the AlignUI Select component.

**Impact:**
- Inconsistent styling with the rest of the application
- Missing accessibility features provided by Radix UI primitives
- No support for design system variants (size, variant, etc.)

**Fix:** Replaced all three native `<select>` elements with AlignUI Select components using the proper structure:
- `Select.Root` with `value` and `onValueChange` props
- `Select.Trigger` with `Select.Value` for placeholder
- `Select.Content` with `Select.Item` for options

### 2. ✅ Login Page - Custom Error Display
**Location:** `app/(auth)/login/page.tsx`

**Issue:** Error messages were displayed using a custom red div with inline styles instead of the AlignUI Alert component.

**Impact:**
- Inconsistent error messaging UI across the application
- Missing design system styling and variants
- No icon support or proper status indicators

**Fix:** Replaced custom error div with AlignUI Alert component:
- `Alert.Root` with `variant='lighter'` and `status='error'`
- `Alert.Icon` with error warning icon
- Proper semantic structure and styling

### 3. ✅ Admin Pages - Incorrect Select Usage
**Locations:** 
- `app/(admin)/admin/brands/new/page.tsx`
- `app/(admin)/admin/screenshots/page.tsx`

**Issue:** Select components were being used incorrectly, treating them like native HTML select elements with `onChange` handlers and `<option>` children.

**Impact:**
- Components would not work as expected (Select is a Radix UI component, not a native select)
- Type errors and runtime issues
- Inconsistent with AlignUI component patterns

**Fix:** Updated both pages to use AlignUI Select correctly:
- Changed from `Select` (default export) to `* as Select` namespace import
- Replaced `onChange` with `onValueChange`
- Replaced `<option>` elements with `Select.Item` components
- Added proper `Select.Trigger`, `Select.Value`, and `Select.Content` structure

### 4. ✅ Screenshots Page - Native HTML Checkboxes
**Location:** `app/(admin)/admin/screenshots/page.tsx`

**Issue:** Native HTML `<input type="checkbox">` elements were used instead of AlignUI Checkbox component.

**Impact:**
- Inconsistent checkbox styling
- Missing design system animations and states
- No support for design system variants

**Fix:** Replaced native checkboxes with AlignUI Checkbox:
- Imported `Root as Checkbox` from checkbox component
- Replaced `onChange` with `onCheckedChange` (Radix UI pattern)
- Proper boolean handling for checked state

### 5. ✅ Standardized UI Patterns - Loading, Empty, and Error States
**Locations:** Multiple files across `app/` and `components/`

**Issue:** Loading, empty, and error states were implemented inconsistently using plain text divs instead of standardized components.

**Impact:**
- Inconsistent user experience across the application
- No visual indicators or proper styling
- Difficult to maintain and update

**Fix:** Created three reusable pattern components using AlignUI:
- `LoadingState` - Uses ProgressCircle for loading indicators
- `EmptyState` - Uses Alert component with information status
- `ErrorState` - Uses Alert component with error status
- Replaced all instances across the codebase

### 6. ✅ Design Token Inconsistencies
**Locations:**
- `components/gallery/brand-card.tsx`
- `app/brands/[slug]/page.tsx`
- `app/pages/[id]/page.tsx`

**Issues:**
- Used `shadow-lg` (Tailwind default) instead of AlignUI shadow tokens
- Used native `<button>` elements instead of AlignUI Button
- Used `text-white`, `text-lg`, `font-semibold` instead of AlignUI tokens
- Used `bg-black/50` instead of AlignUI overlay tokens

**Fix:**
- Replaced `shadow-lg` with `shadow-regular-md`
- Replaced native buttons with AlignUI Button components
- Replaced typography with AlignUI tokens (`text-title-h5`, `text-paragraph-sm`)
- Replaced colors with AlignUI tokens (`text-static-white`, `bg-overlay`)

## Components Properly Using AlignUI

The following components are correctly using AlignUI components:

- ✅ **Header** (`components/header.tsx`) - Properly uses Button, Dropdown, Drawer, and CompactButton
- ✅ **Sidebar** (`components/sidebar.tsx`) - Properly uses Button and Avatar components
- ✅ **Brand Card** (`components/gallery/brand-card.tsx`) - Uses custom styling appropriately (no equivalent Card component in AlignUI)
- ✅ **Brand Grid** (`components/gallery/brand-grid.tsx`) - Layout component, no design system equivalent needed
- ✅ **Auth Pages** - Login and Signup pages now properly use Input, Label, Button, and Alert components
- ✅ **FilterBar** (`components/gallery/filter-bar.tsx`) - Properly uses Select and Input components
- ✅ **Theme Switch** (`components/theme-switch.tsx`) - Properly uses SegmentedControl component

## Component Decision Tree

When creating or modifying components, follow this decision tree:

1. **Does AlignUI have an equivalent component?**
   - ✅ Yes → Use AlignUI component
   - ❌ No → Continue to step 2

2. **Can existing AlignUI components be composed to achieve this?**
   - ✅ Yes → Create composed component using AlignUI components
   - ❌ No → Continue to step 3

3. **Is this a domain-specific component that's appropriate to be custom?**
   - ✅ Yes → Create custom component using AlignUI design tokens
   - ❌ No → Reconsider approach

### Approved Custom Components

The following custom components are approved and documented:

- **BrandCard** (`components/gallery/brand-card.tsx`)
  - **Reason:** Domain-specific card component for displaying brand information
  - **Status:** Uses AlignUI design tokens (borders, colors, typography, shadows)
  - **Note:** AlignUI does not have a generic Card component, so custom styling is appropriate

- **BrandGrid** (`components/gallery/brand-grid.tsx`)
  - **Reason:** Layout component for displaying brand cards in a grid
  - **Status:** Uses standard CSS Grid, no design system equivalent needed

## Reusable Pattern Components

The following components are reusable patterns built on top of AlignUI components:

### LoadingState
**Location:** `components/ui/loading-state.tsx`

A standardized loading indicator using AlignUI ProgressCircle.

**Usage:**
```tsx
import { LoadingState } from '@/components/ui/loading-state';

<LoadingState message="Loading brands..." size="medium" />
```

**Props:**
- `message?: string` - Optional loading message (default: "Loading...")
- `size?: 'small' | 'medium' | 'large'` - Size of the spinner (default: "medium")
- `className?: string` - Additional CSS classes

### EmptyState
**Location:** `components/ui/empty-state.tsx`

A standardized empty state display using AlignUI Alert component.

**Usage:**
```tsx
import { EmptyState } from '@/components/ui/empty-state';
import * as Button from '@/components/ui/button';

<EmptyState
  title="No brands found"
  description="Try adjusting your filters to see more results."
  action={<Button.Root>Create Brand</Button.Root>}
/>
```

**Props:**
- `title: string` - Title text (required)
- `description?: string` - Optional description text
- `action?: ReactNode` - Optional action button or element
- `className?: string` - Additional CSS classes

### ErrorState
**Location:** `components/ui/error-state.tsx`

A standardized error display using AlignUI Alert component.

**Usage:**
```tsx
import { ErrorState } from '@/components/ui/error-state';

<ErrorState
  title="Something went wrong"
  message="Failed to load data. Please try again."
  onRetry={() => refetch()}
/>
```

**Props:**
- `title?: string` - Optional title (default: "Something went wrong")
- `message: string` - Error message (required)
- `onRetry?: () => void` - Optional retry callback
- `className?: string` - Additional CSS classes

## Design Token Guidelines

### Approved AlignUI Design Tokens

When styling custom components, always use AlignUI design tokens instead of Tailwind defaults:

#### Border Radius
- ✅ `rounded-lg`, `rounded-xl`, `rounded-10`, `rounded-20`, `rounded-2xl`, `rounded-md`
- ❌ Avoid: `rounded-sm`, `rounded`, `rounded-full` (unless specifically needed)

#### Shadows
- ✅ `shadow-regular-xs`, `shadow-regular-sm`, `shadow-regular-md`, `shadow-regular-lg`
- ✅ `shadow-button-primary-focus`, `shadow-button-important-focus`, `shadow-button-error-focus`
- ❌ Avoid: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` (Tailwind defaults)

#### Colors
- ✅ Background: `bg-bg-white-0`, `bg-bg-weak-50`, `bg-bg-soft-200`, `bg-primary-base`, `bg-overlay`
- ✅ Text: `text-text-strong-950`, `text-text-sub-600`, `text-text-soft-400`, `text-static-white`
- ✅ Borders: `border-stroke-soft-200`, `border-stroke-strong-950`
- ❌ Avoid: `bg-white`, `bg-black`, `text-white`, `text-gray-*`, `border-gray-*`

#### Typography
- ✅ Titles: `text-title-h1` through `text-title-h6`
- ✅ Labels: `text-label-xl`, `text-label-lg`, `text-label-md`, `text-label-sm`, `text-label-xs`
- ✅ Paragraphs: `text-paragraph-xl`, `text-paragraph-lg`, `text-paragraph-md`, `text-paragraph-sm`, `text-paragraph-xs`
- ✅ Subheadings: `text-subheading-md`, `text-subheading-sm`, `text-subheading-xs`
- ❌ Avoid: `text-lg`, `text-sm`, `text-base`, `font-semibold`, `font-bold` (use AlignUI tokens instead)

#### Spacing
- ✅ Use consistent spacing: `gap-4`, `p-4`, `px-4 py-2`, etc.
- ✅ Follow AlignUI component spacing patterns

### Design Token Audit Checklist

When creating or reviewing custom components, verify:
- [ ] Border radius uses AlignUI tokens
- [ ] Shadows use AlignUI tokens (not Tailwind defaults)
- [ ] Colors use AlignUI tokens (not generic colors)
- [ ] Typography uses AlignUI tokens (not Tailwind defaults)
- [ ] Spacing follows consistent patterns
- [ ] Borders use AlignUI tokens

## Recommendations

### 1. Component Usage Guidelines
- Always use AlignUI components instead of native HTML form elements
- Use namespace imports (`* as Component`) for components with multiple exports
- Follow the Radix UI patterns (e.g., `onValueChange` instead of `onChange`)
- Use AlignUI design tokens for all styling
- Prefer reusable pattern components (LoadingState, EmptyState, ErrorState) over custom implementations

### 2. Code Review Checklist
When reviewing new code, check for:
- [ ] Native HTML `<select>` elements → Use `Select` component
- [ ] Native HTML `<input type="checkbox">` → Use `Checkbox` component
- [ ] Native HTML `<input type="radio">` → Use `Radio` component
- [ ] Native HTML `<button>` elements → Use `Button` component
- [ ] Custom error/info divs → Use `Alert` or `ErrorState` component
- [ ] Custom button styling → Use `Button` component variants
- [ ] Loading states → Use `LoadingState` component
- [ ] Empty states → Use `EmptyState` component
- [ ] Error states → Use `ErrorState` component
- [ ] Design tokens → Verify AlignUI tokens are used (not Tailwind defaults)

### 3. Component Usage Examples

#### Using Select Component
```tsx
import * as Select from '@/components/ui/select';

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Select an option" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
  </Select.Content>
</Select.Root>
```

#### Using Button Component
```tsx
import * as Button from '@/components/ui/button';

<Button.Root variant="primary" size="small" onClick={handleClick}>
  Click me
</Button.Root>
```

#### Using Alert Component
```tsx
import * as Alert from '@/components/ui/alert';
import { RiErrorWarningLine } from '@remixicon/react';

<Alert.Root variant="lighter" status="error" size="large">
  <Alert.Icon as={RiErrorWarningLine} />
  <div>
    <h3>Error Title</h3>
    <p>Error message here</p>
  </div>
</Alert.Root>
```

### 4. Future Considerations
- Consider creating a linting rule to catch native form elements
- Consider Tailwind plugin to restrict non-AlignUI tokens
- Add pre-commit hooks to flag potential issues
- Regular audits to catch deviations early

## Testing Recommendations

After these changes, test:
1. Filter functionality on the home page
2. Form submissions on admin pages
3. Error handling on login page
4. Checkbox interactions on screenshots page
5. Visual consistency across all pages
6. Loading states across all pages
7. Empty states when no data is available
8. Error states and error handling
9. Button interactions and styling
10. Design token consistency (shadows, colors, typography)

## Conclusion

All identified deviations from the AlignUI design system have been fixed. The codebase now consistently uses AlignUI components throughout, ensuring:
- Visual consistency
- Better accessibility
- Easier maintenance
- Design system compliance
- Standardized UI patterns
- Consistent design tokens

### Summary of Changes

1. ✅ Replaced all native HTML form elements with AlignUI components
2. ✅ Created standardized LoadingState, EmptyState, and ErrorState components
3. ✅ Replaced all loading, empty, and error states with standardized components
4. ✅ Fixed design token inconsistencies (shadows, colors, typography)
5. ✅ Replaced native button elements with AlignUI Button components
6. ✅ Documented component decision tree and usage guidelines
7. ✅ Established design token guidelines and audit checklist

---

**Status:** ✅ All issues resolved  
**Last Updated:** December 2024

