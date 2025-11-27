# Validation Utilities

## Zod Error Handling

When using Zod's `safeParse()`, always use the provided utility functions to avoid common mistakes.

### ❌ Common Mistake

```typescript
// WRONG - ZodError doesn't have an 'errors' property
if (!result.success) {
  result.error.errors.forEach(...) // ❌ TypeScript error!
}
```

### ✅ Correct Approach

Use the `extractFieldErrors` utility:

```typescript
import { loginSchema, extractFieldErrors } from '@/lib/validations';

const result = loginSchema.safeParse({ email, password });

if (!result.success) {
  // ✅ Correct - uses the utility function
  const errors = extractFieldErrors<{ email: string; password: string }>(
    result.error
  );
  setValidationErrors(errors);
}
```

### Available Utilities

#### `extractFieldErrors<T>(error: ZodError): Partial<T>`

Extracts field-level errors from a ZodError into a key-value object.

**Parameters:**
- `error`: The ZodError from a failed `safeParse()` result
- `T`: TypeScript type representing the expected error object shape

**Returns:** An object with field names as keys and error messages as values

**Example:**
```typescript
const result = schema.safeParse(data);
if (!result.success) {
  const errors = extractFieldErrors<{ email: string; password: string }>(
    result.error
  );
  // errors = { email: "Invalid email", password: "Required" }
}
```

#### `isZodSuccess<T>(result): result is { success: true; data: T }`

Type guard for better TypeScript type narrowing.

**Example:**
```typescript
const result = schema.safeParse(data);
if (isZodSuccess(result)) {
  // TypeScript knows result.data is available here
  console.log(result.data);
} else {
  // TypeScript knows result.error is available here
  const errors = extractFieldErrors(result.error);
}
```

## Best Practices

1. **Always use `extractFieldErrors`** when you need field-level error messages
2. **Never access `result.error.errors`** - ZodError uses `issues`, not `errors`
3. **Import utilities from `@/lib/validations`** for convenience
4. **Type your error objects** to get better TypeScript autocomplete

## Why This Matters

- **Type Safety**: TypeScript will catch mistakes at compile time
- **Consistency**: All validation error handling uses the same pattern
- **Maintainability**: Changes to error handling logic happen in one place
- **Prevents Runtime Errors**: Catches issues before deployment

