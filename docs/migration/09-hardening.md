---
phase: 09
title: Production hardening
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 07
---

# Phase 09 — Production hardening

## Goal

Production-grade operability. The cutover from legacy backend to new backend happens here.

## Task checklist

- [ ] Structured logs with request IDs (`@fastify/request-context` or equivalent).
- [ ] Metrics: `prom-client` exposed at `/metrics`; basic Grafana dashboards.
- [ ] APM hooks (Sentry or OpenTelemetry).
- [ ] Tighter rate limiting on write endpoints.
- [ ] Backups & PITR for Postgres (managed provider gives this for free).
- [ ] Migration / rollback runbook (drizzle-kit forward + manual rollback strategy).
- [ ] **Cutover plan:** swap `NEXT_HTTP_URL` from legacy to new backend in staging → soak for 1 week → swap in prod with DNS rollback ready.
- [ ] Synthetic monitor for the home-page flow runs every 5 minutes; alerts on failure.
- [ ] Decommission the legacy `/api/Ashvant2/...` endpoints once all callers migrated.

## Decisions made in this phase

_(record ADRs here as they are made — especially the cutover-day runbook)_

## Open questions / risks

- DNS TTL during cutover — set low (60s) a week before to give us a fast rollback window.
- Legacy backend lifecycle — when do we shut it down? Recommend keeping it warm for 2 weeks post-cutover.

## Acceptance criteria

- Synthetic monitor green for 7 consecutive days against staging before we touch prod.
- Production traffic flips with no error-rate regression in the first 24h.
- Rollback procedure documented and rehearsed at least once in staging.
- Legacy backend either decommissioned or formally archived.
