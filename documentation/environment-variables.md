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

### OPENAI_API_KEY
- **Description**: API key for OpenAI GPT-4o model
- **Required for**: Screenshot analysis (preferred option)
- **Where to get it**: Sign up at [platform.openai.com](https://platform.openai.com) and create an API key
- **Used in**: `/api/screenshot/analyze` (POST)
- **Note**: If not provided, the app will fall back to Anthropic

### ANTHROPIC_API_KEY
- **Description**: API key for Anthropic Claude 3.5 Sonnet model
- **Required for**: Screenshot analysis (fallback option)
- **Where to get it**: Sign up at [console.anthropic.com](https://console.anthropic.com) and create an API key
- **Used in**: `/api/screenshot/analyze` (POST)
- **Note**: Only used if `OPENAI_API_KEY` is not available

---

## Environment Setup

### Local Development

Create a `.env.local` file in the project root:

```env
URLBOX_API_SECRET=your_urlbox_secret_here
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
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
- For OpenAI: Verify you have access to GPT-4o model
- For Anthropic: Verify you have access to Claude 3.5 Sonnet model

### Different Behavior Between Environments

- Ensure environment variables are set correctly in Vercel
- Check that the correct environment is selected for each variable
- Verify you're using the right branch (main for prod, preprod for preprod)

