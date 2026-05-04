---
phase: 02
title: Deployment & environment
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 01 acceptance criteria
  - need answers from legacy team on existing self-hosted runner setup
---

# Phase 02 — Deployment & environment

## Goal

Backend deployable to staging before any business logic exists. Frontend deployable from the new repo path (still pointed at the legacy backend at this stage — that is fine).

## Task checklist

- [ ] Define deployment strategy (target: existing self-hosted runner box; revisit when team confirms).
- [ ] GitHub Actions: lint + test + build Docker image for backend; push to registry.
- [ ] GitHub Actions: build + deploy frontend (mirror legacy `start:prod` flow but via Turborepo).
- [ ] Secrets strategy: `.env` files on host now; document migration path to a managed secrets store (Doppler / 1Password Connect / Vault).
- [ ] Configure `@fastify/cors` to whitelist `https://new.cyberpravda.dev` and localhost.
- [ ] Configure `@fastify/helmet`, `@fastify/rate-limit` defaults.
- [ ] Provision a staging Postgres (managed or via Compose on the host).
- [ ] Structured logging via Fastify's default `pino`.
- [ ] Smoke test: CI runs `curl https://api-staging.cyberpravda.dev/api/v1/health/live` after deploy and asserts 200.

## Decisions made in this phase

_(record ADRs here as they are made)_

## Open questions / risks

- Legacy self-hosted runner config is opaque — we may need to reverse-engineer the systemd unit on the box.
- Decision: keep frontend on existing port 6062 layout, or switch to a unified reverse-proxy in front of both apps?

## Acceptance criteria

- A reachable `https://api-staging.cyberpravda.dev/api/v1/health/live` (or equivalent) returns 200.
- Frontend deploys from the new repo path and serves the existing site (still hitting legacy backend).
- CI deploys on push to `main` and reports back status.
