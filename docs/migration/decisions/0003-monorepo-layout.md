# 0003 — Monorepo layout (Yarn 4 + Turborepo)

- **Status:** accepted
- **Date:** 2026-05-03
- **Supersedes:** —
- **Superseded by:** —

## Context

The team is building a new TypeScript backend alongside an existing Next.js frontend that will be **copied into a fresh repo and upgraded to the latest Next.js**. Repo strategy options:

1. Two separate repos (frontend + backend).
2. Fresh monorepo from day 1, frontend copied in.
3. Transitional hybrid: separate repos for 4 weeks, merge later.

## Decision

**Fresh monorepo from day 1.** Yarn 4 workspaces + Turborepo. Frontend is copied flat (no git history) into `apps/frontend`. Backend is built fresh in `apps/backend`. Shared packages live under `packages/`.

## Rationale

- The frontend is being upgraded to Next 16 + React 19 anyway — combining the upgrade with the monorepo move is cheaper than doing them sequentially. Both touch the same scripts, configs, and CI.
- Yarn 4 is already in use in the legacy frontend (`package.json:86`). Workspaces are the natural primitive — zero learning curve.
- No git history is preserved (per user direction). This removes the only operational reason to use `git subtree` or `git filter-repo`. Saves 1–2 days.
- Backend has zero code; building it inside the monorepo costs no more than a separate repo.
- Shared packages (`shared-zod`, `shared-types`) become useful immediately as the backend introduces validation that the frontend currently lacks.

## Layout

```
cyberpravda/
├── apps/
│   ├── frontend/           # Next 16 + React 19, copied from cyberpravda-frontend-new
│   └── backend/            # Fastify + Drizzle + PostgreSQL, built fresh
├── packages/
│   ├── shared-zod/         # Zod request/response schemas
│   ├── shared-types/       # TS types inferred from Zod
│   ├── eslint-config/      # flat configs: base, next, node
│   └── tsconfig/           # base.json, next.json, node.json
├── docs/
│   └── migration/          # this plan + status + ADRs + contracts
└── …root configs
```

## Tooling

- **Yarn 4 workspaces** with `nodeLinker: node-modules` (preserves frontend's existing dependency assumptions; PnP would be a separate fight).
- **Turborepo** for `lint` / `typecheck` / `test` / `build` pipelines + remote cache (free tier for now).
- **Husky + lint-staged** at root — neither exists in legacy; this is a quality-of-life upgrade.
- **Changesets** is *not* recommended yet — no published packages to version.

## Rejected alternatives

- **Two separate repos** — forces type duplication or a published-types release loop. Heavier coordination cost over time.
- **Transitional hybrid** — would require restructuring the frontend twice (once into a separate repo, once into the monorepo). The Next.js upgrade makes this even more expensive.
- **pnpm workspaces** — would force the frontend off Yarn 4. Not worth the churn.
- **Nx** — overkill for two apps + four config packages. Heavier learning curve.
- **Yarn workspaces without Turborepo** — works for two apps but loses CI cache and parallelism wins.

## Consequences

- Day-1 cost: setting up workspaces, shared configs, and the frontend copy. Estimated 1–2 days of focused work.
- All future PRs span both apps if a contract changes — atomic, but reviewers must be comfortable reading both sides.
- Deployment changes from per-repo workflows to filtered Turborepo workflows (`turbo run build --filter=backend`).
