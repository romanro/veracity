---
phase: 01
title: Backend bootstrap
status: in-progress
owner: rrozanov
started: 2026-05-03
last-updated: 2026-05-04
target-completion:
blockers: []
---

# Phase 01 — Backend bootstrap

## Goal

A runnable, lint-clean Fastify service inside `apps/backend/`, plus the surrounding monorepo scaffolding.

## Task checklist

### Monorepo scaffolding (Sprint 0)

- [x] `git init` new repo (this repo).
- [x] Yarn 4 + workspaces + Turborepo configured at root.
- [x] Root configs: `.gitignore`, `.yarnrc.yml`, `.nvmrc`, `package.json`, `turbo.json`, `README.md`.
- [x] `AGENTS.md` + `CLAUDE.md` written.
- [x] `docs/migration/` populated with plan and per-phase docs.
- [x] `packages/tsconfig` (base.json, next.json, node.json).
- [x] `packages/eslint-config` (flat configs: base, next, node).
- [x] `packages/shared-zod` (stub).
- [x] `packages/shared-types` (stub).
- [x] Frontend copied to `apps/frontend/` from `cyberpravda-frontend-new` (no `.git`, no `node_modules`, no `.next`).
- [x] Frontend bumped to Next 16 + React 19 + run codemods.
- [x] Frontend `next-i18next` dropped.
- [x] Frontend `start:prod` replaced with Turborepo task.
- [x] `yarn workspace frontend build` green.

### Backend bootstrap

- [x] BE-001: Bootstrap Fastify + TypeScript + tsx + Vitest in `apps/backend`.
- [x] BE-002: Implement health (`/api/v1/health/live`, `/api/v1/health/ready`) and version (`/api/v1/version`) endpoints.
- [x] BE-003: Add `Dockerfile`, root `docker-compose.yml` (with Postgres service even if unused this phase), `.env.example`.
- [x] BE-004: GitHub Actions workflow: `turbo run lint typecheck test build` + build & push backend Docker image.
- [ ] BE-005: Provision staging Postgres + deploy backend skeleton to staging (covered in Phase 02).

## Decisions made in this phase

- [0001 — Fastify over NestJS](./decisions/0001-fastify-over-nest.md)
- [0002 — Drizzle over Prisma](./decisions/0002-drizzle-over-prisma.md)
- [0003 — Monorepo layout (Yarn 4 + Turborepo)](./decisions/0003-monorepo-layout.md)
- [0004 — Defer Neo4j until justified](./decisions/0004-defer-neo4j.md)
- [0005 — Clerk JWT only (drop legacy localStorage path)](./decisions/0005-clerk-jwt-only.md)

## Open questions / risks

- React 19 strict-mode tightening can surface effect-cleanup bugs in widgets like `NewConfRefContainer` (heavy local reducer state). Budget 1–2 days for triage when frontend is migrated.
- `eslint-plugin-drizzle` is already a frontend dep in the legacy repo; double-check whether a different ESLint version is needed when we bring it into the monorepo.
- Frontend `@tanstack/react-query@^5.81.2` resolved to `5.100.9` in the fresh monorepo lockfile and the SSR experimental package's type contract drifted — `ClientReactQueryProvider.tsx:13` now reports `unknown` not assignable to `DehydratedState`. _Resolved 2026-05-04 as part of the Next 16 / React 19 bump: typed `dehydratedState` as `DehydratedState | null`._
- **Frontend builds with `next build --webpack`, not Turbopack.** Turbopack rejects two patterns the legacy widgets use: type-only deep imports without runtime files (e.g. `@dnd-kit/core/dist/hooks/utilities`) and client components importing types from server-side App Router page modules (creates client/server boundary leaks). The fixes applied (inlining the trivial dnd-kit type, inlining route-param types in `VersionsSideMenu` / `NewOpinionInput`) cleared two such leaks. Migrating fully to Turbopack means auditing the rest of the widget tree the same way and is deliberately deferred.
- **Build-time Clerk fallback in `next.config.mjs`.** A documented placeholder publishable key (`pk_test_…example.com$`) lets `/_not-found` prerender without a real Clerk dashboard key. Real keys must be supplied at deploy time via `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Frontend lint config still legacy.** `eslint-config-next@16` ships flat-native and crashes the legacy `FlatCompat({ extends: ['next'] })` chain. Patched by importing `@next/eslint-plugin-next` directly and dropping the `import/*` rules that came in via the next preset. Migrating the frontend onto `@cyberpravda/eslint-config/next` produced 600+ legacy errors and was scoped out of Phase 01.

## Acceptance criteria

- `yarn install` from repo root succeeds.
- `yarn workspace backend dev` runs Fastify on a dev port.
- `curl localhost:<port>/api/v1/health/live` returns 200.
- `yarn workspace backend test` passes a smoke test.
- `docker build -f apps/backend/Dockerfile .` succeeds.
- `yarn workspace frontend build` produces a Next 16 build.
- CI runs `lint`, `typecheck`, `test`, `build` across both apps.
