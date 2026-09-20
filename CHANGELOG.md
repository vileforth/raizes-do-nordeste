# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Task 1: Turborepo + pnpm monorepo skeleton with `apps/api` (NestJS), `apps/web` (Next.js), and `packages/shared`
- Docker multi-stage builds and `docker-compose.yml` for web (4000) and api (3001)
- Project rules in `.cursorrules`, shared ESLint/Prettier/TypeScript configs
- `UserRole` enum and shared constants in `@raizes/shared`
- Unit tests for shared enum, API controller, and web health helper
- Remote Supabase used for auth/database (no local Supabase container)
