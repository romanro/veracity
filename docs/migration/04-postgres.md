---
phase: 04
title: PostgreSQL & Drizzle
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 03 (real users table replaces in-memory store)
---

# Phase 04 — PostgreSQL & Drizzle

## Goal

A real database with a real `users` table. Profile flow becomes durable instead of in-memory.

## Task checklist

- [ ] Add Drizzle + Drizzle Kit to `apps/backend`.
- [ ] Configure `drizzle.config.ts`.
- [ ] Define `users` table schema in TypeScript.
- [ ] First migration: `0001_users.sql` (generated via `drizzle-kit generate`).
- [ ] Replace the Phase 03 in-memory user store with DB-backed upsert.
- [ ] `/api/v1/health/ready` checks DB connectivity (read-only ping).
- [ ] CI: spin up Postgres in a service container, run migrations, run integration tests.
- [ ] Document the migration policy: forward-only, never edit a merged migration; supersede with a new file.

## Decisions made in this phase

- [0002 — Drizzle over Prisma](./decisions/0002-drizzle-over-prisma.md)

## Open questions / risks

- Migration tooling choice: `generate` (file-based, versioned) vs `push` (declarative, dangerous in prod) — pick `generate` for production safety.
- Connection pooling strategy: pgBouncer vs `pg`'s native pool? Defer until load is measurable.

## Acceptance criteria

- Integration test: webhook → user upsert → profile fetch — passes against real Postgres.
- `yarn workspace backend db:migrate` runs cleanly on a fresh database.
- CI green with the Postgres service container.
- `/api/v1/health/ready` returns 503 when the DB is unreachable, 200 when healthy.
