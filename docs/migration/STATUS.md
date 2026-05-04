# Migration Status

_Last regenerated: 2026-05-03_

## Backend phases

| Phase | Title | Status | Owner | Target | Blockers |
|-------|-------|--------|-------|--------|----------|
| 00 | Discovery & contract extraction | not-started | — | TBD | — |
| 01 | Backend bootstrap | in-progress | @rrozanov | TBD | scaffolding only; backend code not yet written |
| 02 | Deployment & environment | not-started | — | TBD | depends on 01 |
| 03 | Clerk integration | not-started | — | TBD | depends on 02 |
| 04 | PostgreSQL & Drizzle | not-started | — | TBD | depends on 03 |
| 05 | API foundation conventions | not-started | — | TBD | depends on 04 |
| 06 | Core read APIs | not-started | — | TBD | depends on 05; needs Phase 0 outputs |
| 07 | Write APIs & business logic | not-started | — | TBD | needs Phase 0 outputs (see Appendix A in plan) |
| 08 | Graph-DB evaluation | not-started | — | TBD | gated on Phase 7 outcomes |
| 09 | Production hardening | not-started | — | TBD | depends on 07 |

## Monorepo bootstrap (Sprint 0)

| Step | Status | Notes |
|------|--------|-------|
| Create new repo + git init | done | 2026-05-03 |
| Yarn 4 + Turborepo + workspaces | done | scaffolding only; `yarn install` not yet run |
| Root configs (.gitignore, .yarnrc.yml, .nvmrc, README.md) | done | 2026-05-03 |
| AGENTS.md + CLAUDE.md | done | 2026-05-03 |
| docs/migration plan + per-phase docs | done | 2026-05-03 |
| Initial ADRs | done | 0001–0005 captured |
| Copy frontend → apps/frontend | not-started | next step |
| Bump Next 15 → 16 | not-started | — |
| Bump React 18 → 19 | not-started | — |
| Drop next-i18next | not-started | — |
| Verify Clerk + Next 16 | not-started | — |
| Replace start:prod with Turbo task | not-started | — |
| Create packages/tsconfig | not-started | — |
| Create packages/eslint-config | not-started | — |
| Create packages/shared-zod (stub) | not-started | — |
| Create packages/shared-types (stub) | not-started | — |

## Legend

- `not-started` — no work in flight
- `in-progress` — at least one task active
- `blocked` — external dependency stalling progress (record in `blockers:`)
- `done` — acceptance criteria met
- `deferred` — explicitly scoped out (with rationale)
