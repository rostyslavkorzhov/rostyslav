# Environment Variables Documentation

This document lists all environment variables required for this application.

## Required Environment Variables

### URLBOX_API_SECRET
- **Description**: API secret key for URLBOX screenshot service
- **Required for**: Screenshot generation endpoints
- **Where to get it**: Sign up at [urlbox.io](https://urlbox.io) and get your API secret from the dashboard
- **Used in**:
  - `/api/screenshot` (POST)
  - `/api/screenshot/status` (GET)

### NEXT_PUBLIC_SUPABASE_URL
- **Description**: URL for your Supabase project
- **Required for**: Database operations and authentication
- **Where to get it**: Available in your Supabase project settings at [supabase.com](https://supabase.com/dashboard/project/_/settings/api)
- **Note**: Must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- **Used in**: All database-related operations

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Description**: Anonymous/public API key for Supabase
- **Required for**: Client-side database access (with RLS)
- **Where to get it**: Available in your Supabase project settings at [supabase.com](https://supabase.com/dashboard/project/_/settings/api)
- **Note**: Must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- **Used in**: All database-related operations

### SUPABASE_SERVICE_ROLE_KEY
- **Description**: Service role key for Supabase (server-side only)
- **Required for**: Admin operations that bypass RLS (Row Level Security)
- **Where to get it**: Available in your Supabase project settings at [supabase.com](https://supabase.com/dashboard/project/_/settings/api)
- **Security**: ⚠️ **NEVER expose this key in client-side code**. This key bypasses RLS and should only be used in API routes and server components.
- **Used in**: Admin API routes, screenshot uploads, server-side operations

---

## Environment Setup

### Local Development

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# URLBox Configuration
URLBOX_API_SECRET=your_urlbox_api_secret
```

**Important**: 
- Never commit `.env.local` to git (it should be in `.gitignore`)
- Use different keys for development vs production

### Vercel Deployment

1. Go to your Vercel project → Settings → Environment Variables
2. Add each variable with the appropriate value
3. Select which environments to apply to:
   - **Production**: For `main` branch deployments
   - **Preview**: For `preprod` and other branch deployments
   - **Development**: For local `vercel dev` command

### Environment-Specific Values

It's recommended to use different API keys for different environments:

- **Development**: Use test/sandbox keys if available
- **Pre-production**: Use production keys (or separate test keys)
- **Production**: Use production keys

---

## Optional Environment Variables

Currently, all environment variables are required. Future optional variables may include:

- `NEXT_PUBLIC_APP_URL`: Public URL of the application (for CORS, etc.)
- `NODE_ENV`: Automatically set by Next.js (`development`, `production`, `test`)

---

## Security Best Practices

1. **Never commit secrets**: Always use `.env.local` for local development
2. **Use different keys per environment**: Separate dev, preprod, and prod keys
3. **Rotate keys regularly**: Update API keys periodically
4. **Limit key permissions**: Use keys with minimal required permissions
5. **Monitor usage**: Check API usage dashboards regularly for unexpected activity

---

## Troubleshooting

### "API credentials not configured" Error

- Check that `.env.local` exists in the project root
- Verify variable names match exactly (case-sensitive)
- Restart the development server after adding/changing variables
- For Vercel: Check that variables are set in the correct environment (Production/Preview)

### API Key Not Working

- Verify the key is valid and active
- Check API usage limits/quota
- Ensure the key has the correct permissions
- For Supabase: Verify your project is active and the URL is correct

### Different Behavior Between Environments

- Ensure environment variables are set correctly in Vercel
- Check that the correct environment is selected for each variable
- Verify you're using the right branch (main for prod, preprod for preprod)

