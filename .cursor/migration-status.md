# Migration Status: Supabase → Drizzle/Better Auth/Vercel Blob

**Last Updated:** February 4, 2026  
**Status:** Core migration complete, type alignment and cleanup remaining

---

## Overview

This Next.js 15.1.4 application has been migrated from a Supabase backend to:
- **Database:** Drizzle ORM on Neon Postgres (serverless)
- **Authentication:** Better Auth
- **Storage:** Vercel Blob

---

## Completed Work

### 1. Database Layer (Drizzle ORM)

**New files created:**
- `lib/db/index.ts` - Drizzle client initialization with Neon serverless driver
- `lib/db/schema/index.ts` - Schema aggregator
- `lib/db/schema/enums.ts` - 14 PostgreSQL ENUM types
- `lib/db/schema/accounts.ts` - Accounts table
- `lib/db/schema/collections.ts` - Collections table with relations
- `lib/db/schema/attributes.ts` - Attributes table (JSONB typed)
- `lib/db/schema/layers.ts` - Layers table (JSONB typed)
- `lib/db/schema/actions.ts` - Actions table (JSONB typed)
- `lib/db/schema/uploads.ts` - Uploads and folders tables
- `lib/db/schema/relations.ts` - Drizzle relational queries

**Query modules:**
- `lib/db/queries/types.ts` - Shared `ReturnInfo` type
- `lib/db/queries/accounts.ts`
- `lib/db/queries/collections.ts`
- `lib/db/queries/attributes.ts`
- `lib/db/queries/layers.ts`
- `lib/db/queries/actions.ts`
- `lib/db/queries/action-graph.ts`
- `lib/db/queries/image-graph.ts`
- `lib/db/queries/uploads.ts`
- `lib/db/queries/profiles.ts`
- `lib/db/queries/versions.ts`
- `lib/db/queries/action-issues.ts`
- `lib/db/queries/index.ts` - Re-exports

**Configuration:**
- `drizzle.config.ts` - Drizzle Kit configuration

### 2. Authentication (Better Auth)

**New files created:**
- `lib/auth/index.ts` - Server-side Better Auth configuration with Drizzle adapter
- `lib/auth/client.ts` - Client-side auth hooks (signIn, signUp, signOut, useSession)
- `lib/auth/schema.ts` - Better Auth tables (user, session, account, verification)
- `app/api/auth/[...all]/route.ts` - Auth API route handler

**Updated authentication flows:**
- Login page (`app/login/page.tsx`)
- Signup page (`app/signup/page.tsx`)
- Forgot password (`app/auth/forgot-password/page.tsx`)
- Reset password (`app/auth/reset-password/page.tsx`)
- Auth callback/confirm routes
- Middleware (`middleware.ts`)
- Root layout (`app/layout.tsx`)

### 3. Storage (Vercel Blob)

**New files created:**
- `lib/storage/index.ts` - Vercel Blob client, BUCKETS enum, utility functions
- `lib/storage/uploaders.ts` - Generic upload/delete functions
- `lib/storage/user-images.ts` - User image management utilities

**Updated components:**
- `components/supabase/supabase-image.tsx` - Uses blob loader
- `components/supabase/editable-image.tsx` - Uses Vercel Blob uploads
- Collection image component
- Profile image input

### 4. Cleanup

**Deleted:**
- `lib/supabase/` directory (entire)
- `lib/hubspot/` directory (entire)
- `types/database-generated.types.ts`
- `shared/engine/temp-service-client.ts`

**Removed packages:**
- `@supabase/ssr`
- `@supabase/storage-js`
- `@supabase/supabase-js`
- `@hubspot/api-client`
- `supabase` CLI

**Added packages:**
- `@neondatabase/serverless`
- `drizzle-orm` (updated to 0.45.1)
- `drizzle-kit`
- `better-auth`
- `@vercel/blob`

---

## Remaining Work

### Critical: Type Alignment (~40 TypeScript errors)

Run `pnpm check-types` to see current errors. Main categories:

#### 1. `UploadsTree` Type Mismatch
Files affected:
- `app/collections/[collection]/uploads/(components)/upload-folder-view.tsx`
- `app/collections/[collection]/uploads/(components)/folder.tsx`
- `components/datatypes/image/image-input.tsx`

**Issue:** Old `types/database.types.ts` has different `UploadsTree` structure than new `lib/db/queries/uploads.ts`. Need to either:
- Update components to use new type from `lib/db/queries/uploads`
- Or update `types/database.types.ts` to match Drizzle schema

#### 2. Property Naming Convention (snake_case → camelCase)
Files affected:
- `app/collections/[collection]/layout.tsx`
- `app/collections/[collection]/collection-context.tsx`

**Issue:** `CollectionData` type expects snake_case (`max_supply`, `created_at`, `settings_locked`) but Drizzle schema uses camelCase (`maxSupply`, `createdAt`, `settingsLocked`).

**Solution:** Update `types/database.types.ts` to align with Drizzle schema's camelCase naming.

#### 3. Generic Type Issues in Datatypes
Files affected:
- `components/datatypes/weather/weather-input.tsx`
- `components/datatypes/weather/weather-display.tsx`
- `components/datatypes/direction/direction-input.tsx`
- `components/datatypes/direction/direction-display.tsx`
- `components/datatypes/generic-display.tsx`

**Issue:** Pre-existing type issues with `never` types and index access.

#### 4. Upload Function Signature
File: `app/collections/[collection]/uploads/(functions)/upload.ts`

**Issue:** `deleteUpload` call at line 76 expects 2-3 arguments but receives 1. The new Drizzle query signature may differ.

### Environment Variables Required

```env
# Database (Neon Postgres)
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-token

# Optional: PostHog
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=...
```

### Database Setup

1. Create Neon database at https://neon.tech
2. Run migrations:
```bash
pnpm db:push  # Push schema to database
# OR
pnpm db:generate && pnpm db:migrate  # Generate and run migrations
```

3. Create Better Auth tables (included in schema but may need manual creation)

### Files to Review/Update

1. **`types/database.types.ts`** - Main type definitions file. Needs complete overhaul to match Drizzle schema (camelCase, new structures).

2. **`app/collections/[collection]/collection-context.tsx`** - Uses `CollectionData` type that needs updating.

3. **`app/collections/[collection]/uploads/(components)/upload-folder-view.tsx`** - Import `UploadsTree` from correct location.

4. **`shared/` directory** - May contain types that need alignment with new schema.

---

## Package.json Scripts

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate", 
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

---

## Architecture Notes

### Drizzle Schema Naming
All Drizzle schemas use **camelCase** for TypeScript properties while maintaining snake_case for actual PostgreSQL column names via explicit column name parameters.

Example:
```typescript
createdAt: timestamp("created_at").defaultNow()
```

### Better Auth Integration
- Uses Drizzle adapter
- Session stored in cookies with 7-day expiry
- Email/password auth enabled
- Email verification required

### Vercel Blob Buckets
```typescript
enum BUCKETS {
  USER_IMAGES = "user-images",
  UPLOADS = "uploads", 
  COLLECTION_IMAGES = "collection-images",
  AVATARS = "avatars"
}
```

---

## Quick Start for Next Agent

1. Read this file for context
2. Run `pnpm check-types` to see current errors
3. Focus on `types/database.types.ts` alignment first
4. Update component imports to use `@/lib/db/schema` types
5. Test authentication flow
6. Test database operations
7. Test file uploads
8. Deploy to Vercel

---

## Files Changed Summary

~60 files were modified during this migration. Key patterns:
- `@/lib/supabase/db/*` → `@/lib/db/queries/*`
- `createSupabaseClient()` → `authClient` from Better Auth
- `supabase.auth.*` → `auth.api.*` or `authClient.*`
- Type imports from `@/types/database.types` may need updating to `@/lib/db/schema`
