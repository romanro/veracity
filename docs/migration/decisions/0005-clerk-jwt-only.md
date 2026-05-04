# 0005 — Clerk JWT only (drop legacy localStorage path)

- **Status:** accepted
- **Date:** 2026-05-03
- **Supersedes:** —
- **Superseded by:** —

## Context

The legacy frontend has a dual auth path in `src/core/api/client.ts:33-36`:

```ts
const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);
if (accessToken) {
  config.headers.Authorization = `Bearer ${accessToken}`;
}

if (tokenGetter) {
  const token = await tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // overwrites the localStorage value
  }
}
```

This is leftover from a pre-Clerk implementation. It still functions because `tokenGetter` (set up by Clerk's `useAuth()`) overrides the localStorage value, but it leaves a dangerous dead code path: anyone writing to `localStorage[KEY_ACCESS_TOKEN]` in dev tools would short-circuit auth for non-Clerk-bound requests.

## Decision

The new backend accepts **only Clerk-issued JWTs** (verified via `@clerk/backend`). The legacy localStorage path will be removed from the frontend during the Phase 03 follow-up.

## Rationale

- One auth source = one threat model. Two paths means two surfaces to secure and two ways for them to drift.
- Clerk is already the production auth provider; no other token issuer exists.
- The localStorage path was never load-bearing — it predates Clerk integration.
- Removing it simplifies the frontend `client.ts` interceptor by ~10 lines.

## Implementation plan

- **Backend (Phase 03):** `authPlugin` accepts only Clerk JWTs. No fallback to a custom Bearer token.
- **Frontend (Phase 03 follow-up, ticket FE-001):** delete the `localStorage.getItem(KEY_ACCESS_TOKEN)` block from `apps/frontend/src/core/api/client.ts`. Delete the `KEY_ACCESS_TOKEN` constant from `api.consts`. Verify nothing else references it.
- **Cookies / `withCredentials`:** keep `withCredentials: true` for now (only used for the `lang` cookie); revisit if any backend cookie auth is ever introduced.

## Consequences

- Slightly less flexibility for "let me test the API with a manually crafted token" workflows. Workaround: paste the token via dev-tools into the Clerk session, or use a direct `curl` with a Clerk-issued JWT.
- `setTokenGetter` becomes the single way to set auth — name remains accurate.
- 401 handling on the frontend can be tightened (the current `client.ts:60-62` `// window.location.href = '/login'` is commented out; once we are Clerk-only, an explicit `signOut()` makes more sense).
