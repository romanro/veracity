# 0002 — Drizzle over Prisma

- **Status:** accepted
- **Date:** 2026-05-03
- **Supersedes:** —
- **Superseded by:** —

## Context

The CyberPravda domain includes recursive opinion trees and aggregate scores (veracity, reliability, author rating) that may need to be expressed as recursive CTEs or window-function queries. We need a TypeScript ORM/query layer that does not get in the way of writing real SQL.

Candidates: **Drizzle ORM**, **Prisma**, **Kysely**, raw `pg` + handwritten queries.

## Decision

Use **Drizzle ORM** with **Drizzle Kit** for migrations.

## Rationale

- **SQL transparency.** Drizzle is closer to SQL than Prisma; recursive CTEs and lateral joins are first-class via `with` and `sql` template tags.
- **Type inference.** Drizzle's TypeScript inference is excellent and exports types we can publish to a workspace package.
- **Migration strategy.** `drizzle-kit generate` produces versioned SQL files that we commit — production-safe by default. `drizzle-kit push` exists but we will not use it in CI/prod.
- **Existing signal.** The frontend's `package.json:30` already includes `eslint-plugin-drizzle`. Someone on the team has already considered this direction.
- **Why not Prisma:** Prisma's recursive-CTE support requires `$queryRaw`, which loses Prisma's main type-safety benefit. For tree-heavy domains, you end up writing raw SQL anyway — better to do it in a tool that owns SQL.
- **Why not Kysely:** Kysely is a pure query builder with no migration story. Drizzle gives us both.
- **Why not raw `pg`:** Loses type safety for the 80% of queries that don't need recursion.

## Consequences

- Team needs to learn Drizzle's schema DSL. Cost: low; the DSL is small.
- We commit to PostgreSQL-only; switching DBs later means rewriting Drizzle schemas. Acceptable given the project's PostgreSQL-only constraint.
- Drizzle's docs are thinner than Prisma's. Mitigate with internal examples in the module template (Phase 05).
