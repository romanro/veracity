# CyberPravda

Monorepo for the CyberPravda consensus-building platform.

```
apps/
  frontend/    Next.js application (to be copied & upgraded — see docs/migration)
  backend/     Fastify + Drizzle + PostgreSQL service (to be built — see docs/migration)
packages/
  shared-zod/      Zod request/response schemas (single source of truth)
  shared-types/    TS types inferred from Zod
  eslint-config/   Shared flat ESLint configs
  tsconfig/        Shared base tsconfig files
docs/
  migration/   Phased migration plan and status tracking
```

## Getting started

This repo is in early bootstrap. See [`docs/migration/STATUS.md`](./docs/migration/STATUS.md) for the current state of the migration.

```bash
# requires: Node 20, Corepack-enabled Yarn 4
corepack enable
yarn install
yarn dev          # runs all apps via Turborepo
yarn lint
yarn typecheck
yarn test
yarn build
```

## Documentation

- [Migration plan](./docs/migration/README.md) — full architecture and rationale
- [Status dashboard](./docs/migration/STATUS.md) — phase-by-phase progress
- [Decisions (ADRs)](./docs/migration/decisions/) — architectural decision records
- [`AGENTS.md`](./AGENTS.md) — entry point for AI assistants and new contributors
