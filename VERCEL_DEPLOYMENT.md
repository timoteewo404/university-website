# Vercel Deployment Guide

## Prerequisites
1. Vercel account (https://vercel.com)
2. PostgreSQL database (Neon recommended)
3. GitHub repository

## Database Setup
The database has been seeded with all necessary data:
- Colleges and departments
- Programs
- News and events
- Scholarships and opportunities
- Application timeline
- Hero badges

## Environment Variables for Vercel
Set these in your Vercel project settings:

```
DATABASE_URL=postgresql://neondb_owner:npg_b6B5zGJxwjpS@ep-icy-shape-advgrop6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
RESEND_API_KEY=re_DW4xDUpU_PaKdL4HgEdVbraY6Sc3p9C3A
FROM_EMAIL=eyecabinternationaluniversity@gamil.com
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

## Deployment Steps

### Option 1: Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on pushes to main branch
3. Set environment variables in Vercel dashboard

## Post-Deployment
1. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain
2. Test all API endpoints
3. Verify admin panel functionality
4. Check news/events display on home page

## Troubleshooting
- If database connection fails, verify DATABASE_URL
- For API timeouts, check Vercel function logs
- Static generation issues can be resolved by ensuring dynamic routes use proper caching