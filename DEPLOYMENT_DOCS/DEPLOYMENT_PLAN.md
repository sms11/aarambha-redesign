# Deployment Plan

## Detected Services
- **aarambha-redesign** — Frontend (SSR), Next.js 16, React 19, Tailwind CSS v4, Framer Motion

## Recommended Platforms

| Service | Platform | Reason | Free Tier Limits |
|---------|----------|--------|-----------------|
| aarambha-redesign | Vercel | Next.js creator's platform; zero-config SSR, edge functions, image optimization, automatic preview deploys | 100GB bandwidth/month, 100 deployments/day, serverless function limits |

## Free Tier Warnings

- **Vercel**: Free tier ("Hobby") is limited to non-commercial, personal projects. 100GB bandwidth/month. Serverless functions have 10s execution limit. Image optimization limited to 1000 source images/month.

## Deployment Order
1. Frontend → Vercel (single service, no dependencies)

## Required Accounts
- **Vercel** — Sign up at vercel.com (GitHub login recommended)
- **GitHub** — Repository must be on GitHub for Vercel auto-deploy

## Environment Variable Wiring
No cross-service wiring needed — this is a single frontend service with no backend dependencies.
