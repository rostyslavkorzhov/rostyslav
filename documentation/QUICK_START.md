# Quick Start Checklist

Use this checklist to quickly set up the application.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Supabase account created
- [ ] URLBox account created

## ✅ Supabase Setup

- [ ] Created a new Supabase project
- [ ] Copied `NEXT_PUBLIC_SUPABASE_URL` from [API Settings](https://supabase.com/dashboard/project/_/settings/api)
- [ ] Copied `NEXT_PUBLIC_SUPABASE_ANON_KEY` from API Settings
- [ ] Copied `SUPABASE_SERVICE_ROLE_KEY` from API Settings (keep this secret!)
- [ ] Verified database tables exist: `brands`, `pages`, `users`
- [ ] Verified `screenshots` storage bucket exists and is public

## ✅ URLBox Setup

- [ ] Signed up at [urlbox.io](https://urlbox.io)
- [ ] Copied `URLBOX_API_SECRET` from dashboard

## ✅ Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
URLBOX_API_SECRET=your_urlbox_secret_here
```

- [ ] Created `.env.local` file
- [ ] Added all required environment variables
- [ ] Verified variable names are correct (case-sensitive)

## ✅ Installation

- [ ] Ran `pnpm install`
- [ ] No installation errors

## ✅ Verification

- [ ] Ran `pnpm dev`
- [ ] Application starts without errors
- [ ] Can access homepage at http://localhost:3000
- [ ] Can access login page at http://localhost:3000/login
- [ ] Can access signup page at http://localhost:3000/signup
- [ ] Can access admin at http://localhost:3000/admin (after login)

## ✅ Test Flow

- [ ] Created a test account
- [ ] Verified email and logged in
- [ ] Created a test brand in admin
- [ ] Captured a test screenshot
- [ ] Viewed brand in public gallery

## 🎉 You're Ready!

If all checkboxes are checked, you're ready to start using the application!

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

