---
phase: 06
title: Core read APIs
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 05
  - depends on Phase 00 contract captures
---

# Phase 06 — Core read APIs

## Goal

Frontend home page, topic page, version page, and argument page fully usable against the new backend, without contract changes.

## Task checklist (in order)

- [ ] **Topics module:** schema + `GET /api/v1/topics`, `GET /api/v1/topics/:id` (include version summaries and authors).
- [ ] **Versions module:** schema + `GET /api/v1/versions`, `GET /api/v1/versions/:id`.
- [ ] **Arguments module:** schema + `GET /api/v1/arguments` with filters; `GET /api/v1/arguments/:id` with paginated approve/refuse via lateral joins.
- [ ] **Opinions module:** schema + `GET /api/v1/opinions/by-version/:versionId/flat?userId=`.
- [ ] Seed data fixtures (small, realistic) via Drizzle Kit's seeder.
- [ ] Manual run-through of every read-only route against staging.
- [ ] Backwards-compat: response payloads keep existing field names (including the `verasity` typo as an alias) until the frontend ships its rename.

## Decisions made in this phase

_(record ADRs here as they are made)_

## Open questions / risks

- Argument detail endpoint's twin pagination (`pageApprove`/`perPageApprove` and `pageRefuse`/`perPageRefuse`) needs lateral joins in Drizzle; budget time for the SQL.
- If lateral-join performance is poor, fall back to splitting into two endpoints (`/arguments/:id/approvals` and `/arguments/:id/refusals`) — but keep the original shape for compat.

## Acceptance criteria

- Manual: every read-only route in §2 of the plan renders against staging API.
- Frontend swap: change `NEXT_HTTP_URL` in staging FE to point at new backend, browse the site, no errors.
- p95 latency for `/api/v1/topics` ≤ 200ms with seed data.
