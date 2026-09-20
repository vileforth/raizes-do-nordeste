# Raizes do Nordeste

Monorepo for the Raizes do Nordeste gastronomic franchise management platform.

## Layout

```
raizes-do-nordeste/
├── apps/
│   ├── api/          NestJS backend (port 3001)
│   └── web/          Next.js 16 BFF frontend (port 4000)
├── packages/
│   └── shared/       Shared types, enums (@raizes/shared)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## Entity Relationship Diagram

```mermaid
erDiagram
  usuario ||--o| cliente : has
  usuario ||--o| funcionario : has
  usuario ||--o{ usuario_perfil : has
  perfil ||--o{ usuario_perfil : has
  cliente ||--o{ pedido : places
  unidade ||--o{ funcionario : employs
  unidade ||--o| estoque : has
  unidade ||--o{ pedido : receives
  unidade ||--o{ promocao_unidade : participates
  produto ||--o{ estoque_produto : stocked
  estoque ||--o{ estoque_produto : contains
  pedido ||--o{ item_pedido : contains
  produto ||--o{ item_pedido : ordered
  pedido ||--o| pagamento : has
  pedido ||--o{ hist_status_pedido : tracks
  usuario ||--o{ hist_status_pedido : updates
  promocao ||--o{ cupom : issues
  promocao ||--o{ promocao_unidade : scopes
  promocao ||--o{ promocao_produto : scopes
  produto ||--o{ promocao_produto : included
  programa_fidelidade ||--o{ cliente_fidelidade : enrolls
  cliente ||--o{ cliente_fidelidade : joins
  cliente_fidelidade ||--o{ movimentacao_pontos : earns
  beneficio ||--o{ resgate_beneficio : redeemed
  cliente ||--o{ atendimento : opens
  usuario ||--o{ atendimento : handles
  atendimento ||--o{ hist_atendimento : logs
  usuario ||--o{ log_auditoria : audits
```

## Prerequisites

- Node.js 22+
- pnpm 9.15.0
- Docker (optional)
- Remote Supabase project

## Setup

```powershell
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
```

Configure Supabase keys in both `.env` files.

## Development

```powershell
pnpm dev
```

Individual apps:

```powershell
pnpm --filter @raizes/api dev
pnpm --filter @raizes/web dev
```

## Build and Test

```powershell
pnpm build
$env:SUPABASE_JWT_SECRET='test-secret'
pnpm test
pnpm lint
```

## Docker

```powershell
docker compose up --build
```

- Web: http://localhost:4000
- API: http://localhost:3001

The browser talks only to the Next.js BFF at `/api/*`, which proxies to the NestJS API.

## Database

```powershell
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```
