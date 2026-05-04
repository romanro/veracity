---
phase: 07
title: Write APIs & business logic
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 06
  - depends on Phase 00 answers (veracity/reliability formula, comments, bookmarks)
---

# Phase 07 — Write APIs & business logic

## Goal

Submission flows working: opinions, confirmations, refutations. The current frontend branch `feat/more-confirmation-page-changes` becomes deployable end-to-end against the new backend.

## Task checklist

- [ ] Topics/Versions/Arguments POST/PUT/DELETE with author-only authorisation checks.
- [ ] **Argument proofs:** `POST /api/v1/arguments/:id/proofs` (replaces legacy `/api/arguments2`).
- [ ] **Opinion submission:** `POST /api/v1/opinions` — accepts a tree, persists transactionally, updates aggregate counts. **This is the most complex endpoint.**
- [ ] **Veracity / reliability calculation:** synchronous, in-transaction. Recompute on every relevant write. Don't go async until proven necessary.
- [ ] Soft-delete semantics on Topic/Version/Argument (`deleted_at`); hide from reads, keep historical opinions.
- [ ] Bookmark + Comment endpoints, only if Phase 00 confirms they exist.
- [ ] Integration tests covering partial-failure rollback on tree submission.

## Decisions made in this phase

_(record ADRs here as they are made)_

## Open questions / risks

- **Veracity formula uncertainty** — locked by Phase 00 contract recovery. If unknown by start of Phase 07, ship a "v0" formula behind a feature flag.
- **Transactional integrity for tree submission** — write the integration tests covering partial-failure first; build the endpoint against them.
- **Frontend cache invalidation** — the legacy frontend has React Query invalidation commented out in `useSubmitOpinionArguments` and `useUpdateProfile`. Recommendation: backend returns the canonical state in the mutation response so manual `setQueryData` keeps working.
- Author rating formula similarly TBD.

## Acceptance criteria

- End-to-end: user submits an opinion tree from the frontend → the tree appears in the right places (version page, argument page, profile page).
- End-to-end: user submits a confirmation/refutation tree → the parent argument's counts update.
- All writes return `401 Unauthorized` for missing/invalid Clerk JWT.
- Author-only mutations return `403` for non-authors.
- Integration test suite green against ephemeral Postgres in CI.
