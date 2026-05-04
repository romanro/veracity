# 0001 — Fastify over NestJS

- **Status:** accepted
- **Date:** 2026-05-03
- **Supersedes:** —
- **Superseded by:** —

## Context

We are building a new TypeScript backend for CyberPravda. Candidate frameworks: Fastify, NestJS, Hono, Elysia.

The contract surface is small (~22 endpoints across 4–5 resources). The team is small. The most domain-complex piece is one endpoint (opinion tree submission) that benefits from explicit transactional SQL, not from a heavy DI container.

## Decision

Use **Fastify** with `fastify-type-provider-zod` for schema-first request/response validation.

## Rationale

- **Simplicity per LOC.** Fastify exposes routes as plain functions with Zod schemas. NestJS forces a controller / service / module trinity even for trivial endpoints.
- **Mature plugin ecosystem.** `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`, `@fastify/swagger`, `@fastify/jwt`, `@clerk/backend` (works with any framework) cover all our needs.
- **Performance is incidental.** Fastify is fast, but we picked it for ergonomics, not benchmarks.
- **Lower boilerplate** for a small team that needs to ship a deployable service in week 1.
- **Hono / Elysia** have smaller ecosystems and we'd be reinventing pieces (e.g. Swagger integration, mature rate-limit plugins).

## Consequences

- We do not get NestJS's opinionated structure for free. We must define our own module template (Phase 05).
- Switching to Nest later if the team scales is feasible but expensive — make this choice with eyes open.
- Fastify's request/reply abstraction is slightly less ergonomic than Express in edge cases (e.g. streaming). Acceptable.
