# Deployment Plan: Dev, Preprod, and Production Environments

## Overview

| Environment | Location | Branch | URL | Purpose |
|------------|----------|--------|-----|---------|
| **Development** | Local machine | `dev` | `http://localhost:3000` | Active coding & testing |
| **Pre-production** | Vercel (cloud) | `preprod` | `https://preprod.myapp.com` | Staging/testing before prod |
| **Production** | Vercel (cloud) | `main` | `https://myapp.com` | Live application |

---

## Step-by-Step Setup Plan

### Phase 1: GitHub Repository Setup

1. **Create GitHub Repository**
   - Go to github.com → New repository
   - Name: `myapp` (or your preferred name)
   - Visibility: Private (recommended) or Public
   - Do not initialize with README (if you already have code)

2. **Connect Local Project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/myapp.git
   git push -u origin main
   ```

3. **Create Branch Structure**
   ```bash
   git checkout -b dev          # Development branch
   git checkout -b preprod      # Pre-production branch
   git push origin dev
   git push origin preprod
   ```

---

### Phase 2: Vercel Account and Project Setup

1. **Create Vercel Account**
   - Go to vercel.com
   - Sign up with GitHub (recommended for easy integration)

2. **Import GitHub Repository**
   - Vercel Dashboard → Add New Project
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (or `npm run build`)
   - Output Directory: `.next` (default)
   - Install Command: `pnpm install` (or `npm install`)

3. **Configure Production Deployment**
   - Production Branch: `main`
   - Vercel will auto-deploy from `main` branch

---

### Phase 3: Environment Variables Configuration

1. **Set Environment Variables in Vercel**
   - Go to Project → Settings → Environment Variables
   - Add each variable for the appropriate environments:

   **Required Variables:**
   ```
   URLBOX_API_SECRET
   SUPABASE_URL
   SUPABASE_ANON_KEY
   ```

   **For each variable:**
   - Add the variable name and value
   - Select environments:
     - ✅ Production (for `main` branch)
     - ✅ Preview (for `preprod` and other branches)
     - ✅ Development (optional, for local `vercel dev`)

2. **Create Local Environment File (Optional)**
   - Create `.env.local` in project root:
   ```
   URLBOX_API_SECRET=your_secret_here
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   - Add `.env.local` to `.gitignore` (should already be there)

---

### Phase 4: Domain Configuration

1. **Production Domain (`myapp.com`)**
   - Go to Vercel → Project → Settings → Domains
   - Add domain: `myapp.com`
   - Follow DNS instructions:
     - Add A record or CNAME as instructed by Vercel
     - Wait for DNS propagation (can take up to 48 hours)
   - Vercel will automatically provision SSL certificate

2. **Pre-production Domain (`preprod.myapp.com`)**
   - In your DNS provider:
     - Add CNAME: `preprod` → `cname.vercel-dns.com`
   - In Vercel → Settings → Domains:
     - Add domain: `preprod.myapp.com`
     - Assign to branch: `preprod`
   - SSL certificate will be auto-provisioned

---

### Phase 5: Branch Protection and Deployment Settings

1. **Configure Branch Protection (GitHub)**
   - Go to GitHub → Repository → Settings → Branches
   - Add rule for `main` branch:
     - ✅ Require pull request reviews
     - ✅ Require status checks to pass
     - ✅ Require branches to be up to date

2. **Configure Vercel Branch Deployments**
   - Go to Vercel → Project → Settings → Git
   - Production Branch: `main`
   - Preview deployments: Enabled (for all branches)
   - Automatic deployments: Enabled

---

## Deployment Workflow

### Daily Development Workflow

```bash
# 1. Start local development
git checkout dev
pnpm dev
# Work at http://localhost:3000

# 2. Commit and push changes
git add .
git commit -m "Feature: description"
git push origin dev

# 3. When ready for preprod testing
git checkout preprod
git merge dev
git push origin preprod
# Test at https://preprod.myapp.com

# 4. When ready for production
git checkout main
git merge preprod
git push origin main
# Deploys to https://myapp.com
```

---

## Access URLs Summary

| Environment | How to Access |
|------------|---------------|
| **Development** | `http://localhost:3000` (run `pnpm dev`) |
| **Pre-production** | `https://preprod.myapp.com` (or Vercel preview URL) |
| **Production** | `https://myapp.com` |

---

## Checklist for Setup

### GitHub Setup
- [ ] GitHub repository created
- [ ] Local code pushed to GitHub
- [ ] `dev` branch created and pushed
- [ ] `preprod` branch created and pushed
- [ ] Branch protection rules configured (optional)

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub repository imported to Vercel
- [ ] Production branch set to `main`
- [ ] Environment variables configured:
  - [ ] `URLBOX_API_SECRET`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
- [ ] Variables assigned to correct environments

### Domain Setup
- [ ] Production domain (`myapp.com`) added to Vercel
- [ ] DNS records configured for production
- [ ] Pre-production domain (`preprod.myapp.com`) added
- [ ] DNS records configured for pre-production
- [ ] SSL certificates verified (auto-provisioned)

### Testing
- [ ] Local dev environment working (`pnpm dev`)
- [ ] Preprod deployment successful
- [ ] Production deployment successful
- [ ] All environments accessible via their URLs

---

## Optional: Password Protection for Preprod

If you want to restrict access to preprod:

1. Go to Vercel → Project → Settings → Deployment Protection
2. Enable password protection for Preview deployments
3. Set a password
4. Only people with the password can access `preprod.myapp.com`

---

## Quick Reference Commands

```bash
# Local development
pnpm dev                    # Start dev server

# Git workflow
git checkout dev           # Switch to dev branch
git checkout preprod       # Switch to preprod branch
git checkout main          # Switch to main branch

# Deployment (automatic via Vercel)
git push origin main       # Deploys to production
git push origin preprod    # Deploys to preprod
```

---

## When Ready to Set Up

Say to Cursor:
> "I'm ready to set up cloud hosting and git. Help me follow the deployment plan."

Cursor can help with:
- Creating the GitHub repository
- Setting up branches
- Configuring Vercel
- Setting environment variables
- Configuring domains
- Testing deployments

