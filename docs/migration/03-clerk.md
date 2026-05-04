---
phase: 03
title: Clerk integration
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 02
  - needs Clerk JWT template configuration confirmed by product
---

# Phase 03 — Clerk integration

## Goal

End-to-end auth working: frontend → Clerk → backend verifies JWT and returns a user-scoped response.

## Task checklist

- [ ] Add `@clerk/backend` to `apps/backend`.
- [ ] Implement `authPlugin` (Fastify plugin) that decorates `request.user` from `Authorization: Bearer <jwt>`.
- [ ] Implement `requireAuth` preHandler hook for protected routes.
- [ ] Add Svix-signed webhook receiver `POST /api/v1/webhooks/clerk` — verify signature, upsert into an in-memory user map for now (real DB lands in Phase 04).
- [ ] Implement `GET /api/v1/profile` against the in-memory store as the integration test target.
- [ ] Frontend: keep the existing `setTokenGetter` Clerk integration; verify it works against staging backend.
- [ ] Decommission ticket: schedule removal of the legacy `localStorage[KEY_ACCESS_TOKEN]` fallback in `apps/frontend/src/core/api/client.ts` after Phase 03 ships (see [ADR 0005](./decisions/0005-clerk-jwt-only.md)).

## Decisions made in this phase

- [0005 — Clerk JWT only (drop legacy localStorage path)](./decisions/0005-clerk-jwt-only.md)

## Open questions / risks

- Clerk JWT template configuration mismatch — fix by aligning JWT template `aud` with the backend's expected audience.
- What user fields does the Clerk JWT carry today (`id`, `email`, `languageCode`)? Confirm with product / Clerk dashboard.

## Acceptance criteria

- Frontend can hit `/api/v1/profile` on staging backend and receive a 200 with a Clerk-derived user payload.
- 401 returned for missing/invalid token.
- Manual test: sign in via Clerk on the frontend → profile fetch succeeds.
- Webhook receiver returns 200 for a valid Svix signature, 401 for an invalid one.
