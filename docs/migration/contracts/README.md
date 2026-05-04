# Contracts (legacy backend traffic captures)

Phase 00 captures real request/response samples from the production frontend at `https://new.cyberpravda.dev` against the legacy backend, so the new backend can match shapes exactly.

## Conventions

- One file per endpoint, named after the resource and method (e.g. `topics-list.http`, `arguments-detail.http`, `opinions-submit.http`).
- Use VS Code REST Client / IntelliJ HTTP Client format (`.http` files) so they are runnable.
- Strip auth tokens, Clerk session IDs, and any PII before committing.
- Capture the **response** body in a sibling `.json` file (e.g. `topics-list.response.json`).

## What to capture

For each of the 20 endpoints listed in the migration plan §4 (Frontend → Backend Dependency Map):

1. The exact request: method, path, query params, headers (minus auth), body.
2. The exact response: status code, headers, body.
3. Any quirks: typos in field names (e.g. `verasity`, `perPageAprove`), inconsistent casing, optional fields actually returned.

## Status

To be populated during Phase 00. See [`../00-discovery.md`](../00-discovery.md).
