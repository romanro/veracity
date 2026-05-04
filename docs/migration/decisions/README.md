# Architectural Decision Records (ADRs)

This directory contains ADRs documenting the architectural choices made during the CyberPravda migration.

## Conventions

- Files are numbered sequentially: `NNNN-kebab-case-title.md`.
- ADRs are **append-only**. Never edit a merged ADR. To change a decision, write a new ADR that supersedes the old one and update both files' frontmatter (`Superseded by` / `Supersedes`).
- Every ADR has the same template at the top:

```markdown
# NNNN — Title

- **Status:** accepted | proposed | superseded
- **Date:** YYYY-MM-DD
- **Supersedes:** NNNN — Title (or —)
- **Superseded by:** NNNN — Title (or —)

## Context
…

## Decision
…

## Rationale
…

## Consequences
…
```

## Index

- [0001 — Fastify over NestJS](./0001-fastify-over-nest.md)
- [0002 — Drizzle over Prisma](./0002-drizzle-over-prisma.md)
- [0003 — Monorepo layout (Yarn 4 + Turborepo)](./0003-monorepo-layout.md)
- [0004 — Defer Neo4j until justified](./0004-defer-neo4j.md)
- [0005 — Clerk JWT only (drop legacy localStorage path)](./0005-clerk-jwt-only.md)
