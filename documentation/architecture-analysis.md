# Architecture Analysis & Recommendations

## Executive Summary

Your current Next.js application has a **functional but not scalable** architecture. While it works for the current MVP, adding GitHub, Vercel, URLBox, Stripe, Supabase, and authentication will require significant refactoring to maintain code quality and scalability.

**Recommendation: Refactor now** before adding new features to avoid technical debt.

---

## Current Architecture Assessment

### ✅ What's Working Well

1. **Next.js App Router structure** - Modern and appropriate
2. **Component organization** - Clean separation of UI components
3. **TypeScript** - Type safety in place
4. **Utility functions** - Good separation in `utils/` directory

### ⚠️ Current Issues

1. **Business logic in API routes** - All logic is directly in route handlers
2. **No service layer** - External API calls (URLBox, OpenAI, Anthropic) are embedded in routes
3. **No database abstraction** - Will need this for Supabase
4. **No authentication layer** - No middleware or utilities for auth
5. **No payment service** - Will need abstraction for Stripe
6. **Environment variables scattered** - Accessed directly via `process.env` throughout
7. **No validation layer** - Input validation is ad-hoc
8. **No error handling strategy** - Inconsistent error responses
9. **No configuration management** - No centralized config

---

## Recommended Architecture

### Proposed Directory Structure

```
rostyslav/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (thin controllers)
│   │   ├── auth/                 # Auth endpoints
│   │   ├── payments/             # Stripe webhooks & endpoints
│   │   ├── screenshots/          # Screenshot endpoints
│   │   └── webhooks/             # External webhooks
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── signup/
│   └── (dashboard)/              # Protected routes
│       └── screenshots/
│
├── lib/                          # Core application code
│   ├── config/                   # Configuration management
│   │   ├── env.ts                # Environment variables
│   │   └── constants.ts          # App constants
│   │
│   ├── services/                 # Business logic layer
│   │   ├── screenshot.service.ts
│   │   ├── ai-analysis.service.ts
│   │   ├── payment.service.ts    # Stripe integration
│   │   └── user.service.ts
│   │
│   ├── clients/                  # External API clients
│   │   ├── urlbox.client.ts      # URLBox API wrapper
│   │   ├── openai.client.ts     # OpenAI API wrapper
│   │   ├── anthropic.client.ts   # Anthropic API wrapper
│   │   ├── stripe.client.ts      # Stripe SDK wrapper
│   │   └── supabase.client.ts    # Supabase client
│   │
│   ├── db/                       # Database layer
│   │   ├── supabase.ts           # Supabase client setup
│   │   ├── queries/              # Database queries
│   │   │   ├── users.queries.ts
│   │   │   ├── screenshots.queries.ts
│   │   │   └── payments.queries.ts
│   │   └── migrations/           # DB migrations (if needed)
│   │
│   ├── auth/                     # Authentication utilities
│   │   ├── middleware.ts         # Auth middleware
│   │   ├── session.ts            # Session management
│   │   ├── providers.ts          # Auth providers (Supabase Auth)
│   │   └── guards.ts             # Route protection helpers
│   │
│   ├── validations/              # Input validation schemas
│   │   ├── screenshot.schema.ts
│   │   ├── auth.schema.ts
│   │   └── payment.schema.ts
│   │
│   ├── errors/                   # Error handling
│   │   ├── app-error.ts          # Custom error classes
│   │   ├── error-handler.ts      # Error handler utility
│   │   └── error-responses.ts    # Standardized error responses
│   │
│   └── utils/                    # Shared utilities (keep existing)
│       ├── cn.ts
│       └── ...
│
├── types/                        # TypeScript type definitions
│   ├── database.ts               # Database types (from Supabase)
│   ├── api.ts                    # API request/response types
│   ├── services.ts               # Service layer types
│   └── index.ts                  # Re-export all types
│
├── middleware.ts                 # Next.js middleware (auth, etc.)
│
└── components/                   # React components (keep as-is)
    ├── ui/
    └── ...
```

---

## Key Architectural Principles

### 1. **Separation of Concerns**

- **API Routes** → Thin controllers that validate, call services, return responses
- **Services** → Business logic and orchestration
- **Clients** → External API integrations (URLBox, OpenAI, Stripe, etc.)
- **Database** → Data access layer (Supabase queries)

### 2. **Dependency Injection**

Services should receive clients as dependencies, making testing easier:

```typescript
// ❌ Bad: Direct instantiation
class ScreenshotService {
  async capture() {
    const client = new URLBoxClient();
    // ...
  }
}

// ✅ Good: Dependency injection
class ScreenshotService {
  constructor(private urlboxClient: URLBoxClient) {}
  async capture() {
    // Use this.urlboxClient
  }
}
```

### 3. **Configuration Management**

Centralize all environment variables:

```typescript
// lib/config/env.ts
export const config = {
  urlbox: {
    apiSecret: process.env.URLBOX_API_SECRET!,
    baseUrl: 'https://api.urlbox.com/v1',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  // ... etc
} as const;
```

### 4. **Error Handling Strategy**

Use custom error classes and consistent error responses:

```typescript
// lib/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}
```

### 5. **Type Safety**

Generate types from Supabase schema and use throughout:

```typescript
// types/database.ts
import { Database } from '@/types/supabase';

type Screenshot = Database['public']['tables']['screenshots']['Row'];
```

---

## Migration Plan

### Phase 1: Foundation (Do First)
1. ✅ Create `lib/config/env.ts` - Centralize environment variables
2. ✅ Create `lib/errors/` - Error handling infrastructure
3. ✅ Create `lib/validations/` - Input validation schemas (use Zod)
4. ✅ Create `types/` structure - Type definitions

### Phase 2: Extract Services (Critical)
1. ✅ Create `lib/clients/urlbox.client.ts` - Extract URLBox logic
2. ✅ Create `lib/clients/openai.client.ts` - Extract OpenAI logic
3. ✅ Create `lib/clients/anthropic.client.ts` - Extract Anthropic logic
4. ✅ Create `lib/services/screenshot.service.ts` - Business logic
5. ✅ Create `lib/services/ai-analysis.service.ts` - AI analysis logic
6. ✅ Refactor API routes to use services

### Phase 3: Database Layer (Before Supabase)
1. ✅ Set up Supabase client in `lib/db/supabase.ts`
2. ✅ Create database query functions in `lib/db/queries/`
3. ✅ Generate TypeScript types from Supabase schema
4. ✅ Replace localStorage with Supabase

### Phase 4: Authentication (Before User Features)
1. ✅ Set up Supabase Auth in `lib/auth/`
2. ✅ Create auth middleware
3. ✅ Create protected route groups
4. ✅ Add session management

### Phase 5: Payment Integration (After Auth)
1. ✅ Create `lib/clients/stripe.client.ts`
2. ✅ Create `lib/services/payment.service.ts`
3. ✅ Create payment webhook handlers
4. ✅ Integrate payment plan validation

### Phase 6: GitHub & Vercel Integration (Optional)
1. ✅ Create GitHub API client (if needed)
2. ✅ Set up Vercel API integration (if needed)
3. ✅ Add deployment webhooks

---

## Benefits of This Architecture

### 1. **Maintainability**
- Clear separation makes code easier to understand
- Changes to external APIs only affect client files
- Business logic is testable in isolation

### 2. **Scalability**
- Easy to add new services
- Database queries are centralized
- New integrations follow the same pattern

### 3. **Testability**
- Services can be unit tested with mocked clients
- API routes can be tested with mocked services
- Database queries can be tested independently

### 4. **Type Safety**
- Generated types from Supabase
- Type-safe API clients
- Type-safe service interfaces

### 5. **Developer Experience**
- Clear file organization
- Consistent patterns
- Easy onboarding for new developers

---

## Example: Before vs After

### Before (Current)

```typescript
// app/api/screenshot/route.ts
export async function POST(request: NextRequest) {
  const apiSecret = process.env.URLBOX_API_SECRET; // ❌ Direct env access
  const response = await fetch('https://api.urlbox.com/v1/render/async', { // ❌ Direct API call
    // ... business logic mixed with HTTP handling
  });
}
```

### After (Recommended)

```typescript
// lib/clients/urlbox.client.ts
export class URLBoxClient {
  constructor(private config: URLBoxConfig) {}
  async captureScreenshot(url: string): Promise<URLBoxResponse> {
    // API call logic here
  }
}

// lib/services/screenshot.service.ts
export class ScreenshotService {
  constructor(private urlboxClient: URLBoxClient) {}
  async capture(url: string, metadata: ScreenshotMetadata) {
    // Business logic here
    return await this.urlboxClient.captureScreenshot(url);
  }
}

// app/api/screenshots/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = screenshotSchema.parse(body); // ✅ Validation
  const service = new ScreenshotService(urlboxClient); // ✅ Dependency injection
  const result = await service.capture(validated.url, validated); // ✅ Service call
  return NextResponse.json(result); // ✅ Thin controller
}
```

---

## Next Steps

1. **Review this document** - Confirm the architecture aligns with your vision
2. **Start Phase 1** - Set up foundation (config, errors, validations)
3. **Refactor incrementally** - One service at a time, test as you go
4. **Add new features** - Use the new architecture for Stripe, Supabase, Auth

---

## Questions to Consider

1. **Do you need GitHub API integration?** (Or just GitHub for version control?)
2. **Do you need Vercel API integration?** (Or just Vercel for hosting?)
3. **What's your timeline?** (This affects how aggressive the refactor should be)
4. **Team size?** (Larger teams benefit more from strict architecture)

---

## Conclusion

**Yes, you should refactor** before adding the new integrations. The current architecture will become unmaintainable with Stripe, Supabase, and Auth added directly to routes.

The recommended architecture follows industry best practices for Next.js applications and will scale well as your application grows.

**Estimated Refactoring Time:** 2-4 days for a complete refactor, or 1-2 weeks if done incrementally alongside new features.

