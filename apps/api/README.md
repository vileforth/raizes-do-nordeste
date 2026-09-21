# @raizes/api

NestJS REST API with Prisma, Supabase JWT auth, Swagger, and Winston logging.

## Run

```powershell
pnpm --filter @raizes/api dev
```

Port 3001. Swagger at `/api/docs`.

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `RESEND_API_KEY`
- `NOMINATIM_BASE_URL`

## Test

```powershell
$env:SUPABASE_JWT_SECRET='test-secret'
pnpm --filter @raizes/api test
```

## Database

```powershell
pnpm --filter @raizes/api exec prisma migrate dev
pnpm --filter @raizes/api exec prisma db seed
```
