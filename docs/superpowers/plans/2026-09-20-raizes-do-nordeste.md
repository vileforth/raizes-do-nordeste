# Raizes do Nordeste Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development.

**Goal:** Build the complete Raizes do Nordeste franchise platform as a pnpm + Turborepo monorepo with Next.js 16 BFF frontend and NestJS API on Supabase PostgreSQL.

**Architecture:** apps/web (Next.js + HeroUI + BFF proxy) talks only to /api. apps/api (NestJS + Prisma + Winston + Swagger) talks to Supabase. packages/shared holds Zod schemas, enums, and types. Auth via Supabase JWT. Payment mocked. Email via Resend. Geo via Nominatim.

**Tech Stack:** Next.js 16, React 19, HeroUI, Tailwind v4, TanStack Query v5, Zod, React Hook Form, next-intl, Vitest, NestJS, Prisma, Jest, Supabase, Winston, Resend, Docker, pnpm, Turborepo.

## Global Constraints

- Variable, function, component, hook, file, and folder names in English.
- Database table and column names in Portuguese snake_case.
- Never fetch the NestJS API from the browser; always use Next.js BFF routes `/api/*`.
- Always use TanStack Query for client data fetching.
- Always use Zod + React Hook Form on forms.
- Every data page must have skeleton loading; every mutation must toast success/error.
- Unit tests are mandatory for every module, hook, service, and component of business logic.
- Swagger on every NestJS HTTP endpoint.
- Winston logger service used in every backend module.
- Role guards on every protected route (CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR).
- Files under 200-300 lines; split when larger.
- Types in `*.types.ts`, schemas in `*.schema.ts`.
- No comments in source code.
- No README or docs unless the task explicitly requires them.
- Do not read or overwrite `.env` files; only create `.env.example`.
- Reuse plataform-brasil layout/component patterns (HeroUI + Tailwind tokens), do not invent a new design system.
- Payment is mocked; geolocation uses Nominatim; email uses Resend.
- i18n required (pt-BR + en).
- Work only under `C:\Users\AMD\Documents\raizes-project\raizes-do-nordeste`.
- PowerShell: never use `&&` as a command separator.
- Commit after the task is complete and tests pass.

---

# Task 1 Monorepo + Docker + Rules

Create the Turborepo + pnpm monorepo skeleton. Delete or ignore the untracked `raizes-do-nordeste-frontend/` template — do not keep it. Leave `PROJETO MULTIDISCIPLINAR - UNINTER.md` and `base de dados - 1 ano - teste.xlsx` at the repo root (do not move or delete them).

## Deliverables

1. Root `package.json` with name `raizes-do-nordeste`, private, packageManager `pnpm@9.15.0`, scripts: `dev`, `build`, `lint`, `test`, `db:generate`, `db:migrate`, `db:seed` via turbo.
2. `pnpm-workspace.yaml` with `apps/*` and `packages/*`.
3. `turbo.json` pipelines: `build`, `dev` (persistent), `lint`, `test`, `db:generate`.
4. Root `.gitignore` covering node_modules, .next, dist, coverage, .env, .env.local, .turbo, .superpowers, prisma generated, OS junk.
5. Root `.cursorrules` with ALL project rules listed in Global Constraints plus: always look for `.cursorrules`; frontend must honor roles; BFF only; React Query only; Zod+RHF; skeletons+toasts; unit tests; swagger; logger; English names; Portuguese snake_case DB; componentize; hooks; no large files.
6. Shared configs: `.prettierrc`, `.eslintrc.cjs` or flat eslint config at root, `tsconfig.base.json`.
7. `packages/shared` package: name `@raizes/shared`, TypeScript, exports for `src/index.ts`, placeholder folders `src/schemas`, `src/types`, `src/enums`, `src/constants`, a `UserRole` enum matching PERFIL names, a `package.json` with `test` script using vitest, and at least one unit test for the enum/constants.
8. `apps/api` NestJS-ready package.json (Nest 10+, prisma, class-validator, swagger, winston, jest) with `src/main.ts` hello bootstrap that compiles, a health module later in Task 4 — for Task 1 only scaffold: `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts` returning `{ status: 'ok' }`, Dockerfile, `.env.example` (PORT, DATABASE_URL, SUPABASE_URL, SUPABASE_JWT_SECRET, RESEND_API_KEY, NOMINATIM_BASE_URL), jest config, one unit test for the controller.
9. `apps/web` Next.js 16 App Router scaffold with `src/app/page.tsx` simple landing, `src/app/layout.tsx`, Tailwind v4 postcss, Dockerfile, `.env.example` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, API_URL, NEXT_PUBLIC_APP_URL), vitest config, one unit test for a tiny `src/lib/health.ts` export `getClientHealth()`.
10. Root `docker-compose.yml` with services `web` (4000), `api` (3001), no real supabase container (document that remote Supabase is used). Multi-stage Dockerfiles that build each app.
11. Root `CHANGELOG.md` starting with Unreleased Task 1 entry (this task explicitly requires changelog start).
12. Root `README.md` describing monorepo layout and how to run (this task explicitly requires root README).

Do NOT implement Prisma schema, Nest modules, or frontend pages beyond the landing scaffold.

## Tests

- `packages/shared` vitest passes.
- `apps/api` jest controller test passes.
- `apps/web` vitest health test passes.

## Commit

`chore: bootstrap turborepo monorepo with docker and project rules`

---

# Task 2 Prisma Schema + Migrations

Create Prisma schema for all 24 domain tables plus implicit join tables matching the xlsx sheets (except Resumo and LEIA-ME).

Path: `apps/api/prisma/schema.prisma` (keep prisma inside the api app so Nest can generate client). Also add a root convenience if needed, but schema lives in `apps/api/prisma`.

## Tables (exact Portuguese snake_case names)

usuario, perfil, usuario_perfil, cliente, funcionario, unidade, produto, estoque, estoque_produto, pedido, item_pedido, pagamento, hist_status_pedido, promocao, cupom, promocao_unidade, promocao_produto, programa_fidelidade, cliente_fidelidade, movimentacao_pontos, beneficio, resgate_beneficio, atendimento, hist_atendimento, log_auditoria.

## Column mapping (must match xlsx headers)

- usuario: id_usuario PK, nome, email unique, senha_hash, telefone, status, data_cadastro
- perfil: id_perfil PK, nome unique, descricao, ativo
- usuario_perfil: id_usuario, id_perfil composite PK
- cliente: id_cliente PK, id_usuario unique FK, cpf unique, data_cadastro, ativo
- funcionario: id_funcionario PK, id_usuario unique FK, id_unidade FK, matricula unique, cargo, ativo
- unidade: id_unidade PK, nome, endereco, telefone, status, data_cadastro, latitude optional, longitude optional
- produto: id_produto PK, nome, descricao, preco Decimal, categoria, ativo
- estoque: id_estoque PK, id_unidade unique FK, status
- estoque_produto: id_estoque_produto PK, id_estoque FK, id_produto FK, quantidade, estoque_minimo, unique(id_estoque, id_produto)
- pedido: id_pedido PK, id_cliente FK, id_unidade FK, status, tipo_consumo, valor_total Decimal, codigo_pedido unique, data_criacao, data_atualizacao
- item_pedido: id_item_pedido PK, id_pedido FK, id_produto FK, quantidade, preco_unitario Decimal, subtotal Decimal
- pagamento: id_pagamento PK, id_pedido unique FK, metodo, valor Decimal, status, data_pagamento, codigo_transacao unique
- hist_status_pedido: id_historico_status PK, id_pedido FK, status, data_hora, id_usuario FK, observacao
- promocao: id_promocao PK, nome, descricao, regra, data_inicio, data_fim, status
- cupom: id_cupom PK, id_promocao FK, codigo unique, validade, limite_uso, ativo
- promocao_unidade: id_promocao + id_unidade composite PK
- promocao_produto: id_promocao + id_produto composite PK
- programa_fidelidade: id_programa PK, nome, descricao, status
- cliente_fidelidade: id_cliente_fidelidade PK, id_cliente FK, id_programa FK, saldo_pontos, nivel, data_adesao, status, unique(id_cliente, id_programa)
- movimentacao_pontos: id_movimentacao PK, id_cliente_fidelidade FK, tipo, pontos, origem, data_hora, observacao
- beneficio: id_beneficio PK, nome, descricao, pontos_necessarios, validade, ativo
- resgate_beneficio: id_resgate PK, id_cliente_fidelidade FK, id_beneficio FK, data_resgate, status, codigo_resgate unique
- atendimento: id_atendimento PK, id_cliente FK, id_usuario_responsavel FK nullable, protocolo unique, tipo, descricao, status, data_abertura, data_atualizacao
- hist_atendimento: id_historico PK, id_atendimento FK, id_usuario FK, status, observacao, data_hora
- log_auditoria: id_log PK, id_usuario FK nullable, acao, entidade, id_entidade, data_hora, detalhes

Use Prisma enums for: UserStatus, UnitStatus, OrderStatus (RECEBIDO, EM_PREPARACAO, PRONTO, RETIRADO), ConsumptionType (CONSUMO_NO_LOCAL, RETIRADA_NO_BALCAO), PaymentMethod (CARTAO_DEBITO, CARTAO_CREDITO, PIX), PaymentStatus, PromotionStatus, LoyaltyLevel (BRONZE, PRATA, OURO), PointMovementType, SupportType (PEDIDO, SUPORTE, PAGAMENTO), SupportStatus, AuditAction.

Map Prisma model names in English (User, Profile, UserProfile, Client, Employee, Unit, Product, Stock, StockProduct, Order, OrderItem, Payment, OrderStatusHistory, Promotion, Coupon, PromotionUnit, PromotionProduct, LoyaltyProgram, ClientLoyalty, PointMovement, Benefit, BenefitRedemption, SupportTicket, SupportHistory, AuditLog) with `@@map("tabela")` and `@map("coluna")`.

Add `@@index` on FKs and frequently queried fields (email, cpf, codigo_pedido, protocolo, status).

Both sides of every relation with `@relation`.

IDs: `@id @default(autoincrement())` for ints.

Add a Prisma schema unit test that loads the schema file and asserts all 24 mapped table names exist.

Do NOT run migrate against a live DB if DATABASE_URL is missing — generate a SQL migration file with `prisma migrate diff` from empty to schema, saved as `apps/api/prisma/migrations/0001_init/migration.sql`.

`prisma generate` must succeed.

Commit: `feat: add prisma schema for 24 domain tables`

---

# Task 3 Seed Script

Create `apps/api/prisma/seed.ts` that reads `base de dados - 1 ano - teste.xlsx` from repo root using the `xlsx` package.

Seed in FK-safe order. Convert Excel serial dates. Use createMany in batches for large sheets (PEDIDO 12100, ITEM_PEDIDO 35869, HIST_STATUS_PEDIDO 48000, PAGAMENTO 12100, MOVIMENTACAO_PONTOS 11878, LOG_AUDITORIA 5000).

Map cliente.id_cliente to usuario.id_usuario 1:1 when ids match; if cliente sheet has no id_usuario, set id_usuario = id_cliente (xlsx CLIENTE has id_cliente, cpf, data_cadastro, ativo — add id_usuario = id_cliente). Same for funcionario: xlsx has id_funcionario, id_unidade, matricula, cargo, ativo — set id_usuario to a user that has the matching profile (funcionario ids 1-60 map to users 121-180 or document the mapping used and keep it consistent).

Skip Resumo and LEIA-ME.

Unit tests: date conversion helper and sheet-name allowlist, without requiring a live database.

package.json prisma.seed configured.

Commit: `feat: add xlsx seed script for one-year test database`

---

# Task 4 NestJS Base + Logger + Swagger

Expand apps/api:

- Winston LoggerModule + LoggerService (error, warn, info, debug) injectable everywhere.
- Global LoggingInterceptor (method, path, status, duration).
- Global HttpExceptionFilter that logs and returns `{ statusCode, message, error }`.
- Global ValidationPipe (whitelist, transform, forbidNonWhitelisted).
- Swagger at `/docs` with Bearer auth.
- HealthModule GET `/health` public.
- PrismaModule global PrismaService.
- CORS for web origin from env.
- Listen on PORT default 3001.
- Unit tests for LoggerService, exception filter, health controller.

Commit: `feat: nestjs logger swagger health and global pipes`

---

# Task 5 Auth Module

- Supabase JWT validation via passport strategy using SUPABASE_JWT_SECRET.
- JwtAuthGuard default APP_GUARD.
- @Public() decorator to skip auth.
- @Roles(...roles) + RolesGuard.
- @CurrentUser() decorator.
- AuthController: POST /auth/login, POST /auth/register, POST /auth/forgot-password as proxies to Supabase Auth admin/client. Do not invent password hashing beyond storing senha_hash placeholder if needed — Supabase owns credentials; still persist usuario row.
- Map JWT email to usuario and attach profiles.
- Audit login via LoggerService (full audit table in Task 13).
- Unit tests for guards, strategy extract, roles.

Commit: `feat: add supabase jwt auth guards and role decorators`

---

# Task 6 Users + Clients + Employees Modules

CRUD modules with DTOs (class-validator + swagger), services, controllers:

- Users: GET/POST/PUT /users, GET /users/:id
- Profiles: GET /profiles
- User profiles assignment PUT /users/:id/profiles (ADMIN only)
- Clients: POST/GET/PUT /clients, GET /clients/:id (UC01)
- Employees: CRUD /employees scoped by unit for GERENTE, all for ADMIN

Role matrix:
- CLIENTE can GET/PUT own client
- ATENDENTE can GET clients
- GERENTE/ADMIN full employee+user as specified

Unit tests for services (mock Prisma).

Commit: `feat: add users clients and employees modules`

---

# Task 7 Units + Products + Stock Modules

- Units CRUD /units with Nominatim geocode service (public API, User-Agent header required). Persist latitude/longitude.
- Products CRUD /products
- Stock GET /units/:id/stock, PATCH stock product qty, low-stock query
- GeoService isolated and unit tested with mocked fetch
- Role: GERENTE own unit, ADMIN all

Commit: `feat: add units products stock and nominatim geo`

---

# Task 8 Orders Module

UC02 + UC04:

- POST /orders (create with items, generate codigo_pedido, status RECEBIDO, write hist_status_pedido)
- GET /orders, GET /orders/:id, GET /orders/:id/status
- PUT /orders/:id only when RECEBIDO
- PUT /orders/:id/status next status only: RECEBIDO → EM_PREPARACAO → PRONTO → RETIRADO
- Reject unavailable products (stock qty)
- tipo_consumo CONSUMO_NO_LOCAL | RETIRADA_NO_BALCAO
- Associate id_cliente when identified

Unit tests for status machine and create/update rules.

Commit: `feat: add orders module with status machine`

---

# Task 9 Payments Module Mock

UC03:

- POST /payments (mock gateway: approve unless metodo invalid or valor mismatch)
- GET /payments/:id
- POST /payments/:id/confirm
- Methods CARTAO_DEBITO, CARTAO_CREDITO, PIX
- Generate codigo_transacao
- Do not mark paid without confirmation
- Unit tests for mock gateway and value matching

Commit: `feat: add mocked payments module`

---

# Task 10 Promotions + Coupons Modules

UC05:

- CRUD /promotions ADMIN create/config/activate
- GERENTE GET unit promotions
- POST /coupons/validate usable by ATENDENTE and CLIENTE
- Promotion-unit and promotion-product associations
- Validate dates and limits

Unit tests for coupon validation.

Commit: `feat: add promotions and coupons modules`

---

# Task 11 Loyalty Module

UC06:

- GET /loyalty/program
- GET /clients/:id/loyalty, GET /clients/:id/points
- POST /benefits/:id/redeem
- Point accrual helper (e.g. 1 point per 1 BRL on paid order — implement as function used by payments later or standalone)
- Levels BRONZE < 500, PRATA < 2000, OURO otherwise
- History movimentacao_pontos

Unit tests for level calculation and redeem rules.

Commit: `feat: add loyalty points and benefits module`

---

# Task 12 Support Module

UC07:

- POST /support, GET /support/:id, PUT /support/:id
- Generate protocolo unique
- hist_atendimento on status change
- Types PEDIDO, SUPORTE, PAGAMENTO
- EmailService using Resend (injectable; mock in tests)
- Notify on ticket create

Commit: `feat: add support tickets and resend email service`

---

# Task 13 Reports + Audit Module

UC10 + audit:

- GET /reports/indicators?from&to&unitId
- GET /reports/:type (orders, stock, promotions, loyalty)
- GERENTE scoped to their unit; ADMIN network-wide
- AuditInterceptor writing log_auditoria for mutating requests
- Unit tests for scope filtering and audit mapping

Commit: `feat: add reports indicators and audit interceptor`

---

# Task 14 Frontend Base + i18n + Providers

Rebuild apps/web following plataform-brasil skeleton:

- HeroUI + Tailwind v4 + tokens `--raizes-*` adapted from `--brasil-*` (brand orange/petrol palette)
- next-intl pt-BR + en dictionaries (starter keys for common UI)
- Providers: QueryClient, HeroUI, next-intl
- `src/lib/api.ts` fetch wrapper to `/api` only
- BFF catch-all `src/app/api/[...path]/route.ts` proxy to API_URL
- Vitest + Testing Library setup
- Unit test for api wrapper and proxy path join

Do not build pages yet beyond existing landing.

Commit: `feat: add web providers i18n heroui and bff proxy`

---

# Task 15 Auth Pages + Supabase Client

- `@supabase/ssr` browser + server clients
- Middleware: unauthenticated users redirected to /login except public routes
- Pages: /login, /register, /forgot-password with Zod+RHF, toasts, skeletons
- AuthProvider
- After login, BFF attaches session; frontend never calls Nest directly
- Unit tests for form schemas and middleware matcher

Commit: `feat: add supabase auth pages and route protection`

---

# Task 16 Dashboard Shell

Port plataform-brasil patterns (read `C:\Users\AMD\Documents\raizes-project\plataform-brasil\src\components\sidebar` and topbar for structure, rewrite for this domain — do not copy Firebase/realm):

- Sidebar with role-based categories
- Topbar with locale switcher, user menu
- Dashboard layout
- Toast provider
- Global skeleton
- Unit tests for role-to-menu mapping

Roles must hide unauthorized nav items.

Commit: `feat: add dashboard shell sidebar topbar and toasts`

---

# Task 17 Shared Components + Services Layer

Port patterns (not pixel-copy proprietary brand text):

- DataTable, ListPageScaffold, FormPageScaffold, KpiCard, SectionCard, GlassPanel, StatusBadge, FilterPill, skeletons
- `createResource` factory + query keys
- useTableState hook
- Unit tests for factory query-key and table state

Commit: `feat: add shared ui components and react-query resource factory`

---

# Task 18 Client + User Management Pages

Pages under (dashboard): /clients, /clients/[id], /users, /users/[id]

Zod+RHF forms, skeletons, toasts, React Query services, role-aware.

Unit tests for client form schema.

Commit: `feat: add client and user management pages`

---

# Task 19 Order Management Pages

/orders, /orders/new, /orders/[id], /orders/board (kanban)

Status timeline, cart builder, consumption type, kitchen kanban.

Unit tests for status next-step helper on client.

Commit: `feat: add order management and kitchen kanban pages`

---

# Task 20 Product + Stock Pages

/products, /products/new, /products/[id], /stock

Low stock alerts. Zod forms. Skeletons. Toasts.

Commit: `feat: add product catalog and stock pages`

---

# Task 21 Promotions + Loyalty Pages

/promotions, /promotions/new, /promotions/[id], /coupons, /loyalty

Admin/gerente/atendente/cliente views per UC05/UC06.

Commit: `feat: add promotions coupons and loyalty pages`

---

# Task 22 Support + Units + Network Pages

/support, /support/[id], /units, /units/[id], /network, /employees

Nominatim address search in unit form. Gerente unit scope vs admin network.

Commit: `feat: add support units employees and network pages`

---

# Task 23 Reports + Dashboard Overview

Dashboard home KPIs + /reports

nivo charts, period/unit filters, CSV export, gerente vs admin scope.

Skeletons. Unit tests for KPI mappers.

Commit: `feat: add dashboard kpis reports and csv export`

---

# Task 24 Documentation + Final Integration

- Root README with DER/MER mermaid matching schema
- CHANGELOG complete for all tasks + list of AI commands/skills used (subagent-driven-development, using-superpowers, using-git-worktrees)
- README in apps/web, apps/api, packages/shared
- Verify docker-compose files still valid
- Add missing swagger descriptions if any
- Do not invent passing tests — run lint/test and fix breakages you cause

Commit: `docs: add der mer changelog and package readmes`
