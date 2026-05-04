---
phase: 01
title: Backend bootstrap
status: in-progress
owner: rrozanov
started: 2026-05-03
last-updated: 2026-05-03
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
- [ ] `packages/tsconfig` (base.json, next.json, node.json).
- [ ] `packages/eslint-config` (flat configs: base, next, node).
- [ ] `packages/shared-zod` (stub).
- [ ] `packages/shared-types` (stub).
- [ ] Frontend copied to `apps/frontend/` from `cyberpravda-frontend-new` (no `.git`, no `node_modules`, no `.next`).
- [ ] Frontend bumped to Next 16 + React 19 + run codemods.
- [ ] Frontend `next-i18next` dropped.
- [ ] Frontend `start:prod` replaced with Turborepo task.
- [ ] `yarn workspace frontend build` green.

### Backend bootstrap

- [ ] BE-001: Bootstrap Fastify + TypeScript + tsx + Vitest in `apps/backend`.
- [ ] BE-002: Implement health (`/api/v1/health/live`, `/api/v1/health/ready`) and version (`/api/v1/version`) endpoints.
- [ ] BE-003: Add `Dockerfile`, root `docker-compose.yml` (with Postgres service even if unused this phase), `.env.example`.
- [ ] BE-004: GitHub Actions workflow: `turbo run lint typecheck test build` + build & push backend Docker image.
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

## Acceptance criteria

- `yarn install` from repo root succeeds.
- `yarn workspace backend dev` runs Fastify on a dev port.
- `curl localhost:<port>/api/v1/health/live` returns 200.
- `yarn workspace backend test` passes a smoke test.
- `docker build -f apps/backend/Dockerfile .` succeeds.
- `yarn workspace frontend build` produces a Next 16 build.
- CI runs `lint`, `typecheck`, `test`, `build` across both apps.
