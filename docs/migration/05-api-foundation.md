---
phase: 05
title: API foundation conventions
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 04
---

# Phase 05 — API foundation conventions

## Goal

A documented pattern any backend module can follow. By the end of this phase, adding a new module is mechanical.

## Task checklist

- [ ] Standard error model: `{ error: { code, message, details? } }`.
- [ ] Pagination shape matching frontend's `TPagination`: `{ page, perPage, pages, total, data }`.
- [ ] Zod schemas in `packages/shared-zod/` (consumed by both backend and frontend).
- [ ] Response serialiser via `fastify-type-provider-zod`.
- [ ] `@fastify/swagger` + `@fastify/swagger-ui` exposing OpenAPI at `/api/v1/docs`.
- [ ] Module template: `apps/backend/src/modules/_template/` showing routes + schemas + service + repository.
- [ ] Document the module template in this file (or link to a README in the template dir).
- [ ] Refactor profile module to conform to the template.

## Decisions made in this phase

_(record ADRs here as they are made)_

## Open questions / risks

- Do we generate a TypeScript client for the frontend from the OpenAPI spec, or have the frontend consume `packages/shared-zod` directly? **Recommend the latter** — Zod gives runtime validation too.
- Do we expose the OpenAPI doc on production, or only on staging? Defer — but lean toward staging-only.

## Acceptance criteria

- `/api/v1/docs` renders the full schema for the existing endpoints.
- Profile module conforms to the template (used as a reference for future modules).
- A new module can be added in <30 min by copying the template and editing four files.
