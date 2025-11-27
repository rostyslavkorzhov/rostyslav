# Deployment Guide

## Automatic Deployments

Your project is configured for **automatic deployments** from GitHub.

### How It Works

1. **Make changes** in your code
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. **Vercel automatically**:
   - Detects the push via GitHub webhook
   - Starts building your project
   - Deploys to production (if on `main` branch)
   - Sends you a notification when complete

### Deployment Types

- **Production**: Deploys from `main` branch → `bestofecom.vercel.app`
- **Preview**: Deploys from other branches → Unique preview URL

### Monitoring Deployments

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Project Page**: Shows all deployments with status
3. **Email Notifications**: Get notified when deployments complete/fail

### Manual Deployment

If you need to manually trigger a deployment:

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click "..." on any deployment → "Redeploy"

### Deployment Status

- ✅ **Ready**: Deployment successful, site is live
- 🔄 **Building**: Currently building
- ❌ **Error**: Build failed (check logs)

### Viewing Build Logs

1. Click on any deployment in Vercel Dashboard
2. Scroll to "Build Logs" section
3. Check for any errors or warnings

---

## Quick Commands

```bash
# Standard workflow
git add .
git commit -m "Description of changes"
git push origin main

# Check deployment status (after push)
# Visit: https://vercel.com/dashboard
```

---

## Troubleshooting

### Deployment Not Triggering

1. Check GitHub connection in Vercel Settings → Git
2. Verify you pushed to the correct branch
3. Check Vercel Dashboard for any webhook errors

### Build Failing

1. Check build logs in Vercel Dashboard
2. Verify all environment variables are set
3. Test build locally: `pnpm build`

### Environment Variables Not Working

1. Go to Vercel → Settings → Environment Variables
2. Verify variables are set for correct environment (Production/Preview)
3. Redeploy after adding new variables

