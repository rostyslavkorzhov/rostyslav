# Setup Guide

This guide will walk you through setting up the Best of E-commerce application from scratch.

## Prerequisites

- Node.js 18+ and pnpm installed
- A Supabase account ([sign up here](https://supabase.com))
- A URLBox account ([sign up here](https://urlbox.io))

## Step 1: Clone and Install Dependencies

```bash
cd bestofecom
pnpm install
```

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details
4. Wait for the database to be provisioned

### 2.2 Get Your Supabase Credentials

1. Go to your project settings: [API Settings](https://supabase.com/dashboard/project/_/settings/api)
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`)

⚠️ **Important**: Keep the service_role key secret! Never commit it to git or expose it in client-side code.

### 2.3 Database Schema

The database schema has already been created via migrations. The following tables exist:

- `brands` - Stores brand information
- `pages` - Stores page information with screenshot URLs
- `users` - Extends Supabase Auth with user profile data

### 2.4 Storage Bucket

The `screenshots` storage bucket has been created via migration. It's configured as:
- **Public**: Screenshots are publicly accessible
- **Authenticated uploads**: Only authenticated users can upload/update/delete

You can verify the bucket exists in the [Supabase Storage dashboard](https://supabase.com/dashboard/project/_/storage/buckets).

## Step 3: Set Up URLBox

1. Sign up at [urlbox.io](https://urlbox.io)
2. Go to your dashboard
3. Copy your **API Secret** (this is your `URLBOX_API_SECRET`)

## Step 4: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# URLBox Configuration
URLBOX_API_SECRET=your_urlbox_secret_here
```

**Important**: 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use different keys for development vs production

## Step 5: Verify Setup

### 5.1 Check Database Tables

You can verify your tables exist in the [Supabase Table Editor](https://supabase.com/dashboard/project/_/editor).

### 5.2 Check Storage Bucket

1. Go to [Storage](https://supabase.com/dashboard/project/_/storage/buckets)
2. Verify the `screenshots` bucket exists and is marked as **Public**

### 5.3 Test the Application

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- The homepage loads
- You can navigate to `/login` and `/signup`
- Admin routes are accessible at `/admin`

## Step 6: Test the Flow

### 6.1 Create an Account

1. Navigate to `/signup`
2. Create a new account
3. Check your email for the verification link
4. Verify your account

### 6.2 Access Admin Dashboard

1. Log in at `/login`
2. Navigate to `/admin`
3. You should see the admin dashboard

### 6.3 Create a Brand

1. Go to `/admin/brands/new`
2. Fill in the brand details:
   - Name
   - Slug (URL-friendly identifier)
   - Category
   - Country
   - Website URL
   - Logo URL (optional)
   - Tier (A, B, or C)
3. Click "Create Brand"

### 6.4 Capture Screenshots

1. Go to `/admin/screenshots`
2. Select a brand
3. Enter a page URL
4. Select page type (home, pdp, about)
5. Choose to capture desktop and/or mobile screenshots
6. Click "Capture Screenshots"
7. Wait for the capture to complete (check status if needed)

### 6.5 View in Public Gallery

1. Navigate to the homepage (`/`)
2. You should see brands in the gallery
3. Click on a brand to view its details
4. View pages with their screenshots

## Troubleshooting

### Environment Variables Not Working

- Ensure `.env.local` is in the project root (not in a subdirectory)
- Restart the development server after adding/changing variables
- Verify variable names match exactly (case-sensitive)
- Check that `NEXT_PUBLIC_` prefix is used for client-accessible variables

### Database Connection Issues

- Verify your Supabase project is active
- Check that the URL and keys are correct
- Ensure your IP is not blocked (check Supabase dashboard)

### Storage Upload Fails

- Verify the `screenshots` bucket exists
- Check that the bucket is set to public
- Verify RLS policies are set correctly
- Check that you're authenticated (for uploads)

### Screenshot Capture Fails

- Verify your URLBox API secret is correct
- Check your URLBox account has credits/quota
- Verify the URL you're trying to capture is accessible
- Check the browser console and server logs for errors

### TypeScript Errors

Run the type checker:

```bash
pnpm build
```

This will show any TypeScript errors that need to be fixed.

## Next Steps

- Review the [Architecture Documentation](./architecture-analysis.md)
- Check the [API Documentation](./api-documentation.md)
- Review the [Deployment Plan](./deployment-plan.md)

## Security Notes

1. **Service Role Key**: Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code. It bypasses RLS.
2. **Environment Variables**: Never commit `.env.local` to version control.
3. **RLS Policies**: The database has Row Level Security enabled. Review policies in the Supabase dashboard.
4. **Storage Policies**: Storage buckets have access policies. Review them in the Supabase dashboard.

## Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Check the [URLBox Documentation](https://urlbox.io/docs)
- Review error messages in the browser console and server logs

