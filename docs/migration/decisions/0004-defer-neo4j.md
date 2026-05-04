# 0004 — Defer Neo4j until product justifies it

- **Status:** accepted
- **Date:** 2026-05-03
- **Supersedes:** —
- **Superseded by:** —

## Context

The CyberPravda domain includes tree-shaped opinion structures and aggregate scores that *could* be modelled as a graph. Some early discussions flagged Neo4j as a possible source of truth or secondary engine.

The frontend was inspected to determine whether graph-native queries are actually needed today (see migration plan §8 and Phase 06 endpoints).

## Decision

**Defer Neo4j indefinitely.** PostgreSQL is the source of truth for all domain data. Tree traversal uses recursive CTEs and (optionally) a closure table. Phase 08 is an evaluation gate that confirms or supersedes this decision.

## Rationale

Inspection of the frontend found:

- All API responses are flat lists or single records with bounded nested children. No graph-native queries are demonstrated.
- The opinion tree has a single root per opinion (`TOpinionItem.children: TOpinionItem[]`) — a tree, not a graph.
- The proof-tree under arguments (`isProof`, `parentArgumentId`) is also a tree.
- No recursive API endpoints exist — backend returns complete subtrees per request, well within recursive-CTE territory.
- "Veracity" sort param exists but the calculation is on aggregates, not graph traversal.

PostgreSQL with recursive CTE handles all observed patterns; introducing Neo4j now would buy nothing and cost:

- Dual-store complexity (CDC sync, eventual consistency).
- Extra infra to deploy, monitor, back up.
- Steeper learning curve for the team.
- Higher operational risk during the migration we are already running.

## Trigger conditions to revisit

Any *one* of these reopens the decision:

1. Cross-topic argument graphs become a first-class product feature ("argument cites other arguments across topics").
2. User-trust propagation / pagerank-style scoring is on the roadmap.
3. A specific recursive query in PostgreSQL has been measured to exceed p95 SLO and is unfixable with indexes / closure tables.
4. Explanation-path queries between arbitrary entities ("why does this user trust that argument") become a feature.

If a trigger fires, write a new ADR (e.g. `0010-introduce-neo4j-as-secondary.md`) and reference this one as superseded for the relevant scope.

## Integration shape if/when introduced

Neo4j would be a **secondary read model**, never primary. Sync via CDC (Debezium → Kafka → Node consumer) or app-level dual-write inside the same DB transaction where consistency matters. Postgres remains source of truth.

## Consequences

- Backend developers do not learn Cypher in 2026.
- Some queries that would be one-line traversals in Neo4j are 10–20 lines of recursive CTE in Postgres. Acceptable.
- If a trigger condition fires later, we have done no premature work — the cost is purely the migration of that specific query path, not the unwind of an unnecessary integration.
