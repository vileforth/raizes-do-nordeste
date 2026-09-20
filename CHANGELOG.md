# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Task 1: Turborepo + pnpm monorepo skeleton with `apps/api` (NestJS), `apps/web` (Next.js), and `packages/shared`
- Docker multi-stage builds and `docker-compose.yml` for web (4000) and api (3001)
- Project rules in `.cursorrules`, shared ESLint/Prettier/TypeScript configs
- `UserRole` enum and shared constants in `@raizes/shared`
- Prisma schema with 24 domain tables, migrations, and seed from xlsx
- Full NestJS API modules with role guards, Swagger, Winston, and unit tests
- `GET /auth/me` endpoint returning current user profile
- Next.js 16 web app with HeroUI, Tailwind v4, next-intl (pt-BR/en), TanStack Query
- BFF catch-all proxy at `/api/*` forwarding Authorization to NestJS
- Supabase SSR auth with middleware session protection
- Role-based dashboard shell with sidebar and topbar
- Domain pages: dashboard, clients, users, orders (board/new/detail), products, stock, promotions, coupons, loyalty, support, units, employees, network, reports
- Shared UI components: DataTable, ListPageScaffold, FormPageScaffold, KpiCard, StatusBadge, GlassPanel, FilterPill, skeletons
- `createResource` factory, `useTableState`, Zod + RHF forms, toast mutations
- Vitest tests for api path join, schemas, menu mapping, query keys, helpers
- Root README with mermaid DER, package READMEs, and docker instructions

### Skills used (historical)

- using-superpowers
- subagent-driven-development
- using-git-worktrees
- Direct implementation for the complete Next.js frontend
