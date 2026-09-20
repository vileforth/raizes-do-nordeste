# Raizes do Nordeste

Monorepo for the Raizes do Nordeste gastronomic management platform.

## Layout

```
raizes-do-nordeste/
├── apps/
│   ├── api/          NestJS backend (port 3001)
│   └── web/          Next.js frontend (port 4000)
├── packages/
│   └── shared/       Shared types, enums, schemas (@raizes/shared)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 22+
- pnpm 9.15.0 (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- Docker (optional, for containerized runs)

## Setup

```powershell
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Supabase is used remotely — configure `SUPABASE_URL` and related keys in `apps/api/.env` and `apps/web/.env`.

## Development

```powershell
pnpm dev
```

Runs all apps via Turborepo. Individual apps:

```powershell
pnpm --filter @raizes/api dev
pnpm --filter @raizes/web dev
```

## Build & Test

```powershell
pnpm build
pnpm test
pnpm lint
```

## Docker

```powershell
docker compose up --build
```

- Web: http://localhost:4000
- API: http://localhost:3001

No local Supabase container is included; point environment variables to your remote Supabase project.

## Database (future tasks)

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```
