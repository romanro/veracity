---
phase: 00
title: Discovery & contract extraction
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers: []
---

# Phase 00 — Discovery & contract extraction

## Goal

Lock the API contract before writing backend code. Resolve open ambiguities about the legacy backend so we don't ship a broken contract.

## Why this is first

The migration plan (§9 Phase 0) makes Phase 6 read APIs and Phase 7 write APIs depend on this discovery. Without recorded request/response samples and answers to the open questions, we will guess at shapes and break the frontend.

## Task checklist

- [ ] Capture network traffic from the running production frontend at `https://new.cyberpravda.dev` against the legacy backend.
- [ ] Save real request/response JSON for all 20 endpoints listed in §4 of the plan, into `docs/migration/contracts/`.
- [ ] Resolve the **Comments** ambiguity — does the legacy backend expose a Comments API, or are comments embedded in the argument response?
- [ ] Resolve the **Bookmarks** ambiguity — is there a toggle endpoint?
- [ ] Confirm the legacy backend's veracity / reliability formulas (ask the team or read legacy code).
- [ ] Document the cutover plan: will both backends run simultaneously? How does DNS / API base URL flip work?
- [ ] Answer the questions in [Appendix A of the plan](./README.md#appendix-a--phase-4-prerequisites-open-questions-to-answer-before-starting).

## Decisions made in this phase

_(Record ADRs in `decisions/` as they are made.)_

## Open questions / risks

- If the legacy backend is unreachable for traffic capture, contract reconstruction will be best-effort from the frontend's TypeScript types.
- If the veracity formula is undocumented and the team cannot recover it, we ship a "v0" formula behind a feature flag in Phase 7 and revisit.

## Acceptance criteria

- All 20 endpoints in §4 of the plan have at least one recorded request/response sample under `docs/migration/contracts/`.
- The open-questions list (Appendix A) has an answer or an explicit "won't fix at MVP" decision against every item.
- The cutover plan is written down (rollback strategy included).
- Phase 6 and Phase 7 are no longer blocked.
