# Services Map

| Service | Type | Framework | Local Port | Depends On |
|---------|------|-----------|------------|------------|
| aarambha-redesign | Frontend (SSR) | Next.js 16 | 3000 | None |

## Environment Variables Per Service

### aarambha-redesign (Frontend)
- No environment variables required
- Uses `next/image` with remote pattern for `images.unsplash.com` (configured in `next.config.ts`)
- `output: 'standalone'` enabled for Docker/containerized deployments
