# AGENTS.md

This is the cyberpravda monorepo. Two apps will live here: `apps/frontend` (Next.js) and `apps/backend` (Fastify + Drizzle + PostgreSQL). Both are being built/migrated; see `docs/migration/STATUS.md` for current state.

## Where to start

If you're an AI assistant (or a new contributor) working in this repo:

1. **Read the migration plan** at [`docs/migration/README.md`](./docs/migration/README.md) for the full architecture and rationale.
2. **Check current status** at [`docs/migration/STATUS.md`](./docs/migration/STATUS.md) to know which phase is active.
3. **For the active phase**, open the matching `docs/migration/NN-*.md` file. The frontmatter shows status, owner, blockers; the body lists tasks.
4. **For architecture questions**, read the relevant ADR in [`docs/migration/decisions/`](./docs/migration/decisions/).
5. **For the Phase 0 captured contract**, see `docs/migration/contracts/`.

## Ground rules

- Do not change the API contract surface without updating both `packages/shared-zod` AND the relevant phase doc's "Decisions made" section.
- When you finish a task in the active phase, update the checkbox in the phase doc AND bump `last-updated` in the frontmatter AND update `STATUS.md`.
- When you make an architectural decision, write an ADR in `docs/migration/decisions/` (next sequential number, kebab-cased title).
- Conventions: §12 of the migration plan defines the backend folder structure; the frontend keeps its existing `src/` layout from the legacy repo.

## Status conventions

Phase doc frontmatter uses these status values (normative — do not invent new ones):

- `not-started` — phase has no work in flight yet.
- `in-progress` — at least one task is being actively worked on.
- `blocked` — an external dependency is preventing forward progress; record it in `blockers:`.
- `done` — all checkboxes ticked, acceptance criteria met.
- `deferred` — explicitly scoped out (with rationale in the doc).

## Repo conventions

- **Yarn 4 workspaces.** Run scripts via `yarn workspace <name> <script>` or via Turborepo: `yarn turbo run <task>`.
- **Path aliases (frontend):** `@/*`, `@core/*`, `@libs/*`, `@widgets/*` (preserved from legacy).
- **TypeScript strict mode** everywhere.
- **ESLint + Prettier + simple-import-sort** enforced in CI.
- **No new markdown docs outside `docs/migration/`** without good reason — keep the documentation surface small and scannable.

## Doc lifecycle

Every PR that completes a task in an active phase must include:

1. The checkbox flip in `docs/migration/NN-*.md`.
2. A `last-updated:` bump in the frontmatter.
3. A `STATUS.md` update if the phase status itself changed.

ADRs are append-only — never edit a merged ADR; supersede it with a new one (e.g. `0006-supersedes-0002.md`).
