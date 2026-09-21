# @raizes/web

Next.js 16 frontend with BFF proxy, HeroUI, TanStack Query, next-intl, and Supabase SSR auth.

## Run

```powershell
pnpm --filter @raizes/web dev
```

Port 4000.

## Environment

Copy `.env.example` to `.env` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `API_URL` (NestJS, default `http://localhost:3001`)
- `NEXT_PUBLIC_APP_URL`

## Architecture

- Browser calls `/api/*` only (BFF catch-all proxy)
- Auth via Supabase session cookie + Bearer token to BFF
- Role-based sidebar navigation
- i18n: pt-BR and en

## Test

```powershell
$env:SUPABASE_JWT_SECRET='test-secret'
pnpm --filter @raizes/web test
```
