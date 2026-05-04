---
phase: 08
title: Graph-DB evaluation
status: not-started
owner:
started:
last-updated: 2026-05-03
target-completion:
blockers:
  - depends on Phase 07 outcomes
---

# Phase 08 — Graph-DB evaluation

## Goal

Decide whether to introduce Neo4j or stay PostgreSQL-only. **This is an evaluation phase, not a build phase.** The default outcome is "no Neo4j" with a written ADR.

## Task checklist

- [ ] Profile slow recursive-CTE queries from Phase 07. Identify any that exceed p95 SLO and cannot be fixed with indexes or a closure table.
- [ ] Review the product roadmap: are cross-topic argument graphs, user-trust propagation, or shortest-path explanations on the roadmap?
- [ ] Document the answer to each trigger condition (see [ADR 0004](./decisions/0004-defer-neo4j.md)).
- [ ] If "no": write ADR 000N supersedes 0004 confirming decision is unchanged; close phase.
- [ ] If "yes": write ADR 000N proposing Neo4j as a **secondary** read model with CDC sync from Postgres; do not implement yet.

## Decisions made in this phase

- See [0004 — Defer Neo4j until justified](./decisions/0004-defer-neo4j.md). This phase confirms or supersedes it.

## Open questions / risks

- Confirmation bias: if Phase 07 shipped fine on Postgres, the team may not even consider graph DB. That is the intended outcome; the phase exists to record the decision, not to manufacture work.

## Acceptance criteria

- A new ADR is written that either confirms 0004 or supersedes it.
- If superseded, the new ADR has concrete trigger evidence (slow query measurements or roadmap items), not just speculation.
