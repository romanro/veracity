# CyberPravda Backend Migration Plan

> Evidence-based architecture & phased migration plan for building a new TypeScript backend for the CyberPravda platform. All conclusions cite paths in `/Users/roman.rozanov/private/cyberpravda-frontend-new`.

---

## Context

CyberPravda is a debate / consensus-building platform: users create **Topics**, propose **Versions**, write **Arguments**, and submit **Opinions** (which can confirm or refute arguments via tree-shaped proof structures). A frontend already exists in production at `https://new.cyberpravda.dev`, talking to an undocumented backend over a documented REST contract (see `README.md:32-89`). The team wants to **build a new TypeScript backend** to replace the legacy backend, reusing the contract surface that the frontend already depends on, while introducing modern conventions (typed DTOs, validation, observability, deployable infrastructure).

**Constraints from the user:**
- TypeScript backend, PostgreSQL as source of truth, Clerk for auth.
- No premature MongoDB or vector DB or graph DB.
- Phased rollout: infrastructure & deploy first, business logic last.
- Realistic incremental delivery — no big bang.
- **Brand-new repository, bootstrapped from scratch.** The current `cyberpravda-frontend-new` repo is *not* the future home — both apps live in a fresh monorepo.
- **Frontend is copied** (not git-history-preserved migrated) into the new monorepo as `apps/frontend`.
- **Frontend is upgraded to the latest Next.js** as part of the migration. Current: Next.js 15.3.3 + React 18. Target: latest stable Next.js (Next 16 line, which ships with React 19). The bundle-analyzer is already on `^16.0.1` in `package.json:51` — partial signal of intent.
- **The migration plan itself lives in the new repo**, not in any developer's home directory or external doc tool. Copied to `docs/migration/` on day 1.
- **AI-usage docs track step status.** `AGENTS.md` / `CLAUDE.md` at the repo root point to per-phase docs that record current status, owner, blockers, last-updated date — so any AI assistant (or human) opening the repo immediately understands where the migration stands.

---

## 1. Executive Summary

The frontend is a **Next.js 15 App Router** application with **17 routes**, **19 widget clusters**, **4 REST API classes**, and **~22 documented endpoints**. The backend contract is small, mostly CRUD over four resources (Topic, Version, Argument, Profile), plus two specialised endpoints (`/api/Ashvant2/opinions/...`) that handle the **opinion-tree submission flow** which is the most domain-complex part of the system.

**Headline recommendation:**

| Decision | Recommendation |
|---|---|
| Backend framework | **Fastify** (not NestJS) |
| Database | **PostgreSQL** only for MVP |
| ORM / query layer | **Drizzle ORM** (team already added `eslint-plugin-drizzle` to frontend — see `package.json:30`) |
| Auth | **Clerk JWT verification via `@clerk/backend`**, plus a `users` mirror table |
| Validation | **Zod** schemas, shared via a workspace package |
| Repo strategy | **Fresh monorepo from day 1** (Yarn 4 workspaces + Turborepo). Frontend copied into `apps/frontend` and upgraded to Next.js 16 + React 19 in parallel with backend bootstrap. |
| Graph DB | **Defer indefinitely.** Trees are bounded; recursive CTEs and a closure table cover the domain well. Only revisit if cross-topic argument graphs or user-trust propagation become product features. |
| Background jobs | None at MVP. Add `pg-boss` or BullMQ in Phase 7 only if veracity recomputation needs to be async. |

**Critical observations from the repository:**
1. **No backend validation today.** Frontend has no Zod/Yup; all data flows over loose TS types. The new backend is the team's chance to introduce contract-first validation.
2. **Two API namespaces exist on the legacy backend:** `/api/...` (clean CRUD) and `/api/Ashvant2/...` (opinion submission, person's name leaked into URL). The new backend should consolidate into a clean `/api/v1/...` namespace while preserving the *behaviour* of both during cutover.
3. **Mixed auth strategy in the frontend:** `client.ts:33-36` reads from `localStorage[KEY_ACCESS_TOKEN]` as a fallback before Clerk's `getToken()`. This is legacy debt — the new backend should accept only Clerk JWTs and the localStorage path can be removed.
4. **No tests, no API mocks, no zod schemas.** The new backend is the only place to harden contracts.
5. **Tree depth is unbounded but small in practice.** Opinion trees (`Opinion.model.ts:14`) are recursive; frontend builds them locally with utilities like `assignPaths` / `findNodeByPath` (see `widgets/PageWidgets/NewOpinionPageWidgets/`). PostgreSQL handles this via either `ltree`, recursive CTE, or a closure table — no graph DB needed.

---

## 2. Repository Overview (Observed)

### Tech stack (from `package.json`)
- **Next.js 15.3.3**, React 18, TypeScript 5, **Yarn 4.9.2** (Corepack)
- **Clerk** `@clerk/nextjs` ^6.1.3 — middleware in `src/middleware.tsx`, provider in `src/core/providers/RootProviders/RootProviders.tsx`
- **TanStack React Query v5** with prefetch/dehydrate SSR pattern
- **Redux Toolkit** for UI state — `src/store/userslice.ts`, `argumentsSlice.ts`, `toastSlice.ts`
- **Axios** HTTP client — `src/core/api/client.ts`
- **Tailwind v4** + SCSS Modules + classnames + tailwind-merge
- **i18next** (en, ru, es) — 9 namespaces in `public/locales/<locale>/`
- **react-hook-form**, **framer-motion**, **@dnd-kit/core**, **lucide-react**
- **No test framework configured** (no jest/vitest/playwright)
- **`eslint-plugin-drizzle` ^0.2.3** in deps (line 30) — early signal of intent

### App Router routes (17 main, all under `/[locale]/`)
```
/[locale]/                                                              Topics list (home)
/[locale]/search                                                        Search topics
/[locale]/new-opinion                                                   Create opinion (no topic context)
/[locale]/topics/[topicId]                                              Topic detail
/[locale]/topics/[topicId]/new-opinion                                  Opinion in topic context
/[locale]/topics/[topicId]/versions/[versionId]/[authorId]              Per-author consensus view
/[locale]/topics/[topicId]/versions/[versionId]/consensus               Version consensus
/[locale]/topics/[topicId]/versions/[versionId]/new-opinion             Opinion in version context
/[locale]/topics/[topicId]/versions/[versionId]/arguments/[argumentId]  Argument detail
/[locale]/topics/[topicId]/versions/[versionId]/arguments/[argumentId]/new-conf-ref
                                                                        Confirmation/refutation tree builder
/[locale]/arguments/[argumentId]                                        Standalone argument
/[locale]/arguments/[argumentId]/new-conf-ref                           Standalone conf/ref builder
/[locale]/versions/[versionId]/arguments/[argumentId]                   Argument in version context
/[locale]/versions/[versionId]/consensus                                Version consensus (no topic prefix)
/[locale]/versions/[versionId]/new-opinion                              Opinion in version (no topic prefix)
/sign/[[...rest]]/                                                      Clerk sign-in/sign-up
/                                                                       Locale redirect
```

**No `route.ts` files exist** in `src/app/api/` — the frontend never proxies; it hits the backend directly. This is good for deployment independence but means the **CORS configuration on the new backend must whitelist the frontend origins**.

### Path aliases (from `tsconfig.json`)
```
@/*        → src/*
@core/*    → src/core/*
@libs/*    → src/libs/*
@widgets/* → src/widgets/*
```

### Key infrastructure observations
- `next.config.mjs` has dev rewrites to `SERVER_API_BASE_URL` — **only used in development**, not in prod (frontend hits backend directly via `NEXT_HTTP_URL`).
- `withCredentials: true` on the axios instance (`client.ts:15`) — but the only backend cookie observable is `lang` (used for `X-Locale`). No session cookies. New backend should explicitly **not** rely on cookies for auth.
- `start:prod` script uses port **6062** + Next standalone build — operationally simple.
- No CI configuration is in the repo (`.github/workflows/` not committed); README of legacy claims "GitHub Actions on push to main (self-hosted runner)".

---

## 3. Product & Domain Reconstruction

### Inferred entity hierarchy
```
Topic
 └── Version            (multiple proposed answers / interpretations of a Topic)
      ├── Arguments     (claims supporting/refuting this Version)
      │    ├── Confirmations (proof trees: arguments that support this argument)
      │    └── Refutations   (proof trees: arguments that refute this argument)
      └── Opinions      (a user's tree of arguments expressing their stance)
            └── children (TOpinionItem → recursive)
```

**Confidence: high** — directly visible in `src/core/models/{Topic,Version,Argument,Opinion,Author,BookMark,Count}.model.ts`.

### Inferred user flows (from routes + widgets)
1. **Browse / search topics** — home page lists topics; `/search` filters them.
2. **View a topic** — shows versions; user picks a version.
3. **View a version** — shows arguments; user picks an argument or goes to consensus view.
4. **View an argument** — shows confirmations and refutations (paginated tabs).
5. **Submit an opinion** (multi-step wizard at `/new-opinion`): user composes a tree of arguments either reusing existing ones (drag-drop from "quote library") or writing new text. Tree is published via `POST /api/Ashvant2/opinions/arguments`.
6. **Confirm or refute an argument** (current branch focus): user builds a proof tree at `.../arguments/[id]/new-conf-ref?type=approve|refute`, published via the same opinion-arguments endpoint with `asProof: boolean`.
7. **Profile management** — `GET/POST /api/v1/profile`.
8. **Auth** — Clerk-hosted sign-in at `/sign/[[...rest]]`.

### Domain rules inferred (with confidence levels)
- **High confidence:**
  - Topics have many Versions (`TTopic.versions: TVersion[]`).
  - Versions have many Arguments (`TVersion.arguments: TArgument[]`).
  - Arguments have approve/refuse pagination split (`TArgument.approve`, `.refuse: TPaginatedOpinions`).
  - Opinions are trees (`TOpinionItem.children: TOpinionItem[]`).
  - Bookmarks per Topic (`TTopic.bookMark`) and per Version (`TVersion.bookMarks`).
  - Each entity carries `countConfirmations / countRefutations / countComments` (`Count.model.ts`).
  - Each Version has a numeric `reliability` (0–100 scale, rendered red/yellow/green by `VersionScore`).
  - Sorting by `'veracity' | 'favorite' | 'create'` (`Argument.api.models.ts:44`) implies the backend computes a veracity score.
- **Medium confidence:**
  - The `verasity` field on `TVersion` (typo retained from legacy) is a textual veracity assessment — possibly a derived label like "true / false / disputed". Not enough evidence from the repo to confirm semantics.
  - `Author.rating` is a numeric aggregate, but the formula is not visible in the frontend.
  - Multi-locale text on Opinions (`textEn`, `textRu` on `TOpinionItem` but only English/Russian, no Spanish) suggests **server-side translation or hand-translation** — Spanish is a UI locale but not an opinion-content locale.
- **Low confidence / unknown:**
  - Whether there is moderation, soft-delete, draft state. No evidence in models.
  - Whether arguments can be edited after they have downstream confirmations attached. `update` endpoint exists but no version-history fields visible.
  - Whether comments are first-class entities — `countComments` exists, but **no Comment API class is in the frontend**. The CommentTab widget exists; either comments are nested in argument responses or there is an undocumented endpoint. **This is a gap that must be answered before Phase 6.**

---

## 4. Frontend → Backend Dependency Map

### HTTP client (`src/core/api/client.ts`)
- `baseURL = process.env.NEXT_HTTP_URL`, `withCredentials: true`, `timeout: 10000`.
- Request interceptor (lines 24–51): **client-side only** (`typeof window !== 'undefined'` guard). On the server, axios fires without auth — this is fine because public reads don't need auth.
- Auth: localStorage `KEY_ACCESS_TOKEN` first, then Clerk `getToken()` overwrites it. **Legacy code path** — recommend removing the localStorage branch when migrating.
- 401 handler logs but doesn't redirect (line 60–61 commented out).

### Endpoint inventory (definitive table)

| # | Frontend caller (file) | Method | Path | Auth | Request | Response | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | `Topic.api.ts:9` | GET | `/api/topics` | No | `TSearchParams` | `TMultiResponse<TTopic>` | confirmed |
| 2 | `Topic.api.ts:13` | GET | `/api/topics/{id}` | No | locale header | `TTopic` | confirmed |
| 3 | `Topic.api.ts:17` | POST | `/api/topics` | Yes | `Partial<TTopic>` | `TTopic` | confirmed |
| 4 | `Topic.api.ts:21` | PUT | `/api/topics/{id}` | Yes | `Partial<TTopic>` | `TTopic` | confirmed |
| 5 | `Topic.api.ts:25` | DELETE | `/api/topics/{id}` | Yes | — | void | confirmed |
| 6 | `Version.api.ts:9` | GET | `/api/versions` | No | `TSearchParams` | `TMultiResponse<TVersion>` | confirmed |
| 7 | `Version.api.ts:13` | GET | `/api/versions/{id}` | No | locale header | `TVersion` | confirmed |
| 8 | `Version.api.ts:17` | POST | `/api/versions` | Yes | `Partial<TVersion>` | `TVersion` | confirmed |
| 9 | `Version.api.ts:21` | PUT | `/api/versions/{id}` | Yes | `Partial<TVersion>` | `TVersion` | confirmed |
| 10 | `Version.api.ts:25` | DELETE | `/api/versions/{id}` | Yes | — | void | confirmed |
| 11 | `Argument.api.ts:21` | GET | `/api/arguments` | No | `TArgumentRequestParams` | `TArgumentMultiResponse` | confirmed |
| 12 | `Argument.api.ts:28` | GET | `/api/arguments/{id}` | No | `TApproveRefusePagination + locale` | `TArgument` (with `.approve` & `.refuse` paginated) | confirmed |
| 13 | `Argument.api.ts:32` | POST | `/api/arguments` | Yes | `TArgumentCreateBody` | `TArgument` | confirmed |
| 14 | `Argument.api.ts:36` | POST | `/api/arguments2` | Yes | `TArgumentCreateAsProofBody` | `TArgument` | confirmed |
| 15 | `Argument.api.ts:40` | PUT | `/api/arguments/{id}` | Yes | `TArgumentPutBody` | `TArgument` | confirmed |
| 16 | `Argument.api.ts:44` | DELETE | `/api/arguments/{id}` | Yes | — | void | confirmed |
| 17 | `Argument.api.ts:57` | GET | `/api/Ashvant2/opinions/{versionId}/flat?userId=...` | Yes | `userId, page, perPage` | `TOpinionArgumentsResponse` | confirmed |
| 18 | `Argument.api.ts:64` | POST | `/api/Ashvant2/opinions/arguments` | Yes | `TOpinionArgumentsSubmitBody` | `TOpinionArgumentsSubmitResponse` | confirmed |
| 19 | `Profile.api.ts:8` | GET | `/api/v1/profile` | Yes | — | `TUserProfileResponse` | confirmed |
| 20 | `Profile.api.ts:11` | POST | `/api/v1/profile` | Yes | `TUserProfileBody` | `TUserProfileResponse` | confirmed |

### Inferred but unconfirmed endpoints
| Endpoint | Why suspected | Confidence |
|---|---|---|
| `GET /api/comments?...` or comment fields on argument response | `CommentTab` widget exists, `countComments` is in `TCount`, but no API class found | weakly inferred — **must clarify with team** |
| `POST /api/topics/{id}/bookmark` (toggle) | `bookMark`/`bookMarks` arrays on Topic & Version models | weakly inferred — no caller in repo |
| Notification / email endpoints | None visible | not inferred |
| Webhook from Clerk → backend (`user.created`, etc.) | Required for user sync; not visible in frontend | required by architecture, not in repo |

### Frontend SSR data prefetch points
- `src/core/api/apis/utils/getTopicVersionArgument/getTopicVersionArgument.ts`: server component utility that calls `TopicApi.getById` + `ArgumentApi.getById` and prefetches into the React Query cache before dehydrating. Used in `/topics/[topicId]/versions/[versionId]/arguments/[argumentId]/page.tsx`.

### Mocks & fixtures (UI only, not API)
- `src/widgets/PageWidgets/NewOpinionPageWidgets/.../NewOpinionArgumentsTree.mock.ts`: empty root structure for tree builder.
- `NewOpinionArgumentsList.mock.ts`, `ConfRefArgumentsList.mock.ts`: widget-level fixtures.
- **No API-level mocks exist** — the frontend talks to a real backend at all times.

---

## 5. API Surface Proposal (for the new backend)

### Naming convention
- **Consolidate** all routes under `/api/v1/...`.
- Retire the `Ashvant2` namespace (preserve behaviour at `/api/v1/opinions/...`).
- Keep camelCase JSON keys to match frontend types unchanged at MVP cutover.

### Module 1 — Topics (confirmed)
```
GET    /api/v1/topics                        list, with q, sort, page, perPage
GET    /api/v1/topics/:id                    detail (with versions, authors)
POST   /api/v1/topics                        auth required
PUT    /api/v1/topics/:id                    auth required, author-only
DELETE /api/v1/topics/:id                    auth required, author-only
```

### Module 2 — Versions (confirmed)
```
GET    /api/v1/versions                      with optional ?topicId
GET    /api/v1/versions/:id
POST   /api/v1/versions
PUT    /api/v1/versions/:id
DELETE /api/v1/versions/:id
```

### Module 3 — Arguments (confirmed)
```
GET    /api/v1/arguments                     with topicId, versionId, userId, sort
GET    /api/v1/arguments/:id                 with pageApprove, perPageApprove, pageRefuse, perPageRefuse
POST   /api/v1/arguments                     create as approving/refuting argument
POST   /api/v1/arguments/:id/proofs          replaces /api/arguments2 (cleaner shape)
PUT    /api/v1/arguments/:id
DELETE /api/v1/arguments/:id
```

### Module 4 — Opinions (confirmed; cleanup of Ashvant2)
```
GET    /api/v1/opinions/by-version/:versionId/flat?userId=
POST   /api/v1/opinions                      submit opinion tree
                                              body: { versionId, topicId?, items: TListDocument['items'] }
```

### Module 5 — Profile (confirmed)
```
GET    /api/v1/profile                       returns mirrored user record (id, name, languageCode, email)
PATCH  /api/v1/profile                       (recommend PATCH; legacy uses POST — accept both for compat)
```

### Module 6 — Webhooks (architecturally required, not in frontend)
```
POST   /api/v1/webhooks/clerk                Svix-signed Clerk webhook for user.created / .updated / .deleted
```

### Module 7 — Bookmarks (weakly inferred)
```
POST   /api/v1/topics/:id/bookmark           toggle
POST   /api/v1/versions/:id/bookmark         toggle
```
**Confirm with team before building** — frontend doesn't actually call these today.

### Module 8 — Comments (weakly inferred)
```
GET    /api/v1/arguments/:id/comments
POST   /api/v1/arguments/:id/comments
```
**Confirm with team** — `CommentTab` exists but no API caller. Could be embedded in `TArgument` response today.

### Health & ops (not in frontend, required for deploy)
```
GET    /api/v1/health/live                   200 always
GET    /api/v1/health/ready                  checks DB connection
GET    /api/v1/version                       returns build SHA
```

---

## 6. Data Model Proposal

All in PostgreSQL. UUIDs for primary keys. `created_at` / `updated_at` on every table. Soft-delete (`deleted_at`) on user-facing entities so we can preserve consensus history.

### Tables

```
users
  id             uuid pk
  clerk_id       text unique not null
  email          text
  name           text
  avatar_url     text
  language_code  text default 'en'
  rating         numeric default 0     -- derived; cached aggregate
  created_at, updated_at

topics
  id             uuid pk
  title          text not null
  subject        text
  src_img        text
  created_by     uuid → users.id
  created_at, updated_at, deleted_at

topic_authors                          -- many-to-many; "authors" array on TTopic
  topic_id       uuid → topics.id
  user_id        uuid → users.id
  PRIMARY KEY (topic_id, user_id)

versions
  id             uuid pk
  topic_id       uuid → topics.id
  title          text not null
  description    text
  src_img        text
  number_in_topic int                  -- TVersion.numberVersionInTheme
  reliability    numeric default 0     -- derived score 0–100
  veracity_label text                  -- TVersion.verasity (textual)
  created_by     uuid → users.id
  created_at, updated_at, deleted_at

version_authors
  version_id, user_id                  PK (version_id, user_id)

arguments
  id             uuid pk
  version_id     uuid → versions.id    NULL allowed if argument is "as proof" of another arg
  parent_argument_id uuid → arguments.id NULL                     -- for confirmation/refutation trees
  is_proof       boolean default false                            -- TArgumentCreateAsProofBody.asProof
  is_approval    boolean                                          -- TArgumentCreateBody.asApprove
  content        text not null                                    -- "title" / "text" in frontend
  description    text
  level_header   smallint                                         -- TArgument.levelHeader (1-3)
  name_header    text
  is_quoted      boolean default false
  rating         numeric default 0     -- derived
  status         text
  img_url        text
  created_by     uuid → users.id
  created_at, updated_at, deleted_at

argument_authors                        -- TArgument.authors[]
  argument_id, user_id                   PK

argument_topics                         -- denormalised join when arg has topicId+versionId
  argument_id, topic_id, version_id      PK (argument_id)

opinions
  id             uuid pk
  version_id     uuid → versions.id     -- top-level binding
  topic_id       uuid → topics.id       -- denormalised for query speed
  parent_opinion_id uuid → opinions.id  -- recursive tree (TOpinionItem.children)
  argument_ref_id uuid → arguments.id   -- when reusing an existing argument
  text           text                   -- localized; null if reusing argument
  text_en        text
  text_ru        text
  rating         numeric default 0
  img_url        text
  created_by     uuid → users.id
  created_at, updated_at

bookmarks
  id             uuid pk
  user_id        uuid → users.id
  topic_id       uuid NULL → topics.id
  version_id     uuid NULL → versions.id
  argument_id    uuid NULL → arguments.id
  created_at
  CHECK (exactly one of topic_id, version_id, argument_id is non-null)

comments                                -- placeholder until confirmed
  id, target_type, target_id, user_id, body, created_at, updated_at, deleted_at

argument_counts (materialised view OR cached columns on argument)
  argument_id pk
  count_confirmations, count_refutations, count_comments
  -- recomputed transactionally on opinion insert/delete

opinion_counts (materialised view)
  opinion_id pk, count_confirmations, count_refutations, count_comments
```

### Optional helper structure: closure table for opinion trees
```
opinion_paths                           -- supports fast subtree fetches & depth queries
  ancestor_id    uuid → opinions.id
  descendant_id  uuid → opinions.id
  depth          int
  PRIMARY KEY (ancestor_id, descendant_id)
```
Maintained transactionally on opinion insert/move. **Optional** — recursive CTEs are acceptable until query patterns prove expensive.

### What lives where
- **PostgreSQL (always):** all of the above. Source of truth.
- **In-process cache / Redis (Phase 7+, optional):** veracity scores, hot topic lists, profile lookups by `clerk_id`.
- **Neo4j (deferred):** would only contain a denormalised projection of `arguments → arguments` and `users → arguments` if Phase 8 evaluation justifies it.

### Derived / computed
- `users.rating`: aggregate over confirmations/refutations of arguments authored by the user.
- `versions.reliability`: aggregate over arguments under the version, weighted by author rating.
- `argument.count_*`: count of related opinions/comments.

These should start as **on-write triggers / transactional updates** in Phase 7. Move to async recomputation only if write contention proves it necessary.

---

## 7. Architecture Recommendation

### Stack comparison

| Option | Verdict | Notes |
|---|---|---|
| **A. Fastify + PostgreSQL + Drizzle** | ✅ **PRIMARY** | Smallest learning curve, Drizzle's recursive-CTE & raw-SQL escape hatch is needed for veracity calculations and tree queries. `eslint-plugin-drizzle` is already in the frontend (signal of intent). |
| B. NestJS + PostgreSQL + Drizzle | ⚠️ Acceptable fallback | DI container is overkill for ~7 modules and 4 devs; adds boilerplate. |
| C. Fastify + PostgreSQL + Prisma | ⚠️ Workable | Prisma 6 supports recursive CTEs only via `$queryRaw`. Drizzle is more honest about SQL. |
| D. NestJS + PostgreSQL + Prisma | ❌ Avoid | All cons of B and C combined. Heaviest option. |
| E. PostgreSQL + Neo4j hybrid | ❌ Premature | No graph traversal in frontend; trees are bounded. Don't pay the dual-store tax until product validates the need. |
| F. PostgreSQL only for MVP, postpone Neo4j | ✅ **Match this** | This is the recommendation. |
| G. Other (e.g. Hono, Elysia) | ❌ Skip | Fastify ecosystem (Zod, Helmet, rate-limit, swagger, Clerk) is more mature. |

### Why Fastify + Drizzle specifically
- **Fastify** has first-class JSON-schema (or Zod via `fastify-type-provider-zod`), which the frontend currently lacks. This is the single highest-leverage upgrade.
- **Fastify plugins** cover everything we need without reinventing: `@fastify/helmet`, `@fastify/cors`, `@fastify/rate-limit`, `@fastify/swagger`.
- **Drizzle** keeps SQL transparent (recursive CTEs for opinion tree traversal, lateral joins for paginated approve/refuse subqueries on the argument-detail endpoint), and Drizzle Kit handles migrations cleanly.
- **Drizzle's TypeScript inference** gives us shared types we can publish to a workspace package consumed by the frontend.

### Auth
- `@clerk/backend` ^1.x for JWT verification middleware.
- A `users` mirror table seeded by **Clerk webhooks** (Svix-signed) on `user.created` / `.updated` / `.deleted`.
- Backend never trusts client-supplied `userId` — always derives `req.user` from the verified Clerk JWT.
- Fastify decorator `request.user: { id: string, clerkId: string, ... }` populated by an `onRequest` hook.

### Validation strategy
- **Zod schemas everywhere.** Request body, query, params, and response (`fastify-type-provider-zod`'s `serializerCompiler`).
- Schemas live in `packages/shared-zod` (when monorepo lands) so the frontend can reuse them in forms via `zodResolver` (react-hook-form already a dep).

### Background jobs / queues
- **Not at MVP.** All veracity/rating recomputation is synchronous in Phase 7.
- If load justifies it later: `pg-boss` (uses the same PostgreSQL — no new infra) for veracity recomputation triggered by argument/opinion writes.

### Caching
- **Not at MVP.** Postgres + correct indexes will cover the load until product traction is real.
- When needed: Redis (or `@fastify/caching` with in-memory LRU) for `GET /api/v1/topics` (home page list).

### Deployment
- **Docker image** built in CI, deployed wherever the frontend already runs (the legacy GH Actions self-hosted runner is in use). Until infra story is clearer, target: Docker Compose in dev → Docker on the existing self-hosted host for staging → managed Postgres (Neon, Supabase, RDS) for prod.
- Health checks at `/api/v1/health/{live,ready}`.

---

## 8. Neo4j / Graph Strategy

Direct answers to the user's questions:

1. **Does the frontend demonstrate a need for graph-native queries?** **No.** All API responses observed are flat lists or single records with bounded nested children. The opinion tree is the only recursive structure, and it has a single root per opinion, not a many-to-many graph.
2. **Is the graph aspect central to the product?** Not based on the repo. The closest thing is the proof-tree under arguments (`isProof`, `parentArgumentId`), which is again a tree (single parent), not a graph.
3. **Can PostgreSQL reasonably support MVP and v1?** **Yes.** Recursive CTE for tree traversal, optionally a closure table when query patterns demand it. No graph DB primitives needed.
4. **What would justify Neo4j later?**
   - Cross-topic argument reuse becomes a first-class feature ("this argument cites three other arguments across two topics") — a real graph.
   - User-trust propagation: "users I trust who voted on this argument" — pagerank-style queries.
   - Explanation paths between two arbitrary entities ("why does this user trust that argument") — shortest-path queries.
   - None of these are visible in the current frontend.
5. **If introduced: primary, secondary, or analytical?** Strictly **secondary read model / analytical**. PostgreSQL stays source of truth. Replicate via CDC or async sync.
6. **Recommended timing:** **Not needed for MVP or v1.** Re-evaluate at end of Phase 7. **Phase 8 is an evaluation phase, not a build phase.**

**Verdict:** Skip Neo4j. Revisit only when concrete product features force the question.

---

## 9. Detailed Phased Migration Plan

### Phase 0 — Discovery & contract extraction (week 0, ~3 days)

- **Goals:** Lock the API contract before writing code. Resolve open ambiguities.
- **Tasks:**
  1. Capture network traffic from the running production frontend at `https://new.cyberpravda.dev` against the legacy backend → produce real request/response samples for all 20 endpoints in §4.
  2. Resolve the **Comments** ambiguity (is there an API or are comments embedded?).
  3. Resolve the **Bookmarks** ambiguity (does an endpoint exist in the legacy backend?).
  4. Confirm the legacy backend's veracity / reliability formulas (ask the team or read legacy code).
  5. Document the cutover plan (will both backends run simultaneously?).
- **Deliverables:** A `docs/contracts/` folder of recorded request/response JSON, an open-questions list, a written cutover plan.
- **Risks:** If the legacy backend is undocumented and unreachable, contract reconstruction is best-effort; we will rely on TS types + production traffic capture.
- **Validation:** All 20 endpoints have at least one recorded sample.
- **Frontend impact:** none — read-only discovery.

### Phase 1 — Backend bootstrap (week 1, ~2 days)

- **Goals:** A runnable, lint-clean Fastify service.
- **Tasks:**
  1. New repo `cyberpravda-backend` (separate from frontend for now — see §15).
  2. Fastify + TypeScript + tsx + Vitest scaffolding.
  3. ESLint flat config matching frontend conventions, Prettier, `simple-import-sort`.
  4. `src/app.ts` (Fastify factory), `src/server.ts` (listener), `.env.example`, `dotenv-flow`.
  5. `/api/v1/health/{live,ready}` and `/api/v1/version`.
  6. `Dockerfile`, `docker-compose.yml` (with Postgres service, even if unused in this phase).
- **Deliverables:** Repo, `yarn dev` works, `yarn test` passes a smoke test, Docker image builds.
- **Risks:** none material.
- **Validation:** `curl localhost:3001/api/v1/health/live` → 200.
- **Frontend impact:** none.

### Phase 2 — Deployment & environment (week 1, ~2 days)

- **Goals:** Backend deployable to staging before any business logic exists.
- **Tasks:**
  1. GitHub Actions pipeline: lint + test + build Docker image + push to registry.
  2. Define staging deployment target (likely the same self-hosted runner box; deploy via systemd unit and Docker Compose).
  3. Secrets strategy: `.env` files on host for now; document migration path to a secrets manager (Doppler / 1Password Connect / Vault).
  4. Structured logging with `pino` (Fastify's default).
  5. `@fastify/cors` configured to whitelist `https://new.cyberpravda.dev` and localhost.
  6. `@fastify/helmet`, `@fastify/rate-limit` defaults.
  7. Provision a staging Postgres (managed or Compose).
- **Deliverables:** A reachable `https://api-staging.cyberpravda.dev/api/v1/health/live` (or equivalent).
- **Risks:** Self-hosted runner config ambiguity (the legacy README mentions it; we may need to reverse-engineer the systemd unit on the box). **Block this on Phase 0 cutover-plan output.**
- **Validation:** Staging URL returns 200 from a CI smoke test.
- **Frontend impact:** none yet.

### Phase 3 — Clerk integration (week 2, ~3 days)

- **Goals:** End-to-end auth working: frontend → Clerk → backend verifies JWT.
- **Tasks:**
  1. Add `@clerk/backend`. Implement `authPlugin` (Fastify plugin) that decorates `request.user` from `Authorization: Bearer <jwt>`.
  2. Implement `requireAuth` preHandler hook for protected routes.
  3. Add Clerk webhook receiver `POST /api/v1/webhooks/clerk` — Svix signature verification, upsert into a not-yet-real `users` table (in-memory map for now).
  4. Implement `GET /api/v1/profile` against the in-memory store as the integration test target.
  5. Frontend: keep the existing `setTokenGetter` Clerk integration; verify it works against staging backend.
- **Deliverables:** Frontend can hit `/api/v1/profile` on staging backend and receive a 200 with a Clerk-derived user payload.
- **Risks:** Clerk JWT template configuration mismatch — fix by aligning JWT template `aud` with backend's expected audience.
- **Validation:** A Cypress/manual test from the frontend logs in via Clerk and successfully fetches the profile. 401 returned for missing/invalid token.
- **Frontend impact:** None to the contract — same shape for `/api/v1/profile`. Recommend (separate ticket) **deleting the localStorage `KEY_ACCESS_TOKEN` fallback** in `client.ts:33-36` since Clerk now covers everything.

### Phase 4 — PostgreSQL & Drizzle (week 2, ~3 days)

- **Goals:** A real database with a real `users` table.
- **Tasks:**
  1. Add Drizzle + Drizzle Kit. Configure `drizzle.config.ts`.
  2. Define `users` table schema (Drizzle TS).
  3. First migration: `0001_users.sql`.
  4. Replace the in-memory store from Phase 3 with real DB-backed user upsert.
  5. `/api/v1/health/ready` checks DB connectivity.
  6. CI: spin up Postgres in a service container, run migrations, run integration tests.
- **Deliverables:** Profile flow works against Postgres. Webhook → DB write works.
- **Risks:** Migration tooling choice (Drizzle Kit's `generate` vs `push` workflows) — pick `generate` (versioned migrations) for production safety.
- **Validation:** Integration test creates a user via webhook, fetches via profile, both pass.
- **Frontend impact:** none.

### Phase 5 — API foundation conventions (week 3, ~2 days)

- **Goals:** A documented pattern any module can follow.
- **Tasks:**
  1. Standard error model: `{ error: { code, message, details? } }`.
  2. Pagination shape matching frontend's `TPagination`: `{ page, perPage, pages, total, data }`.
  3. Zod schemas in `src/schemas/` (later → `packages/shared-zod`).
  4. Response serialiser via `fastify-type-provider-zod`.
  5. `@fastify/swagger` + `@fastify/swagger-ui` exposing OpenAPI at `/api/v1/docs`.
  6. Module template: `modules/_template/` showing routes + schemas + service + repository.
- **Deliverables:** A documented module template + OpenAPI page.
- **Risks:** Naming-convention drift — fix by code-reviewing the first real module against the template.
- **Validation:** OpenAPI page renders, profile module conforms to template.
- **Frontend impact:** None contractually; team can start consuming the OpenAPI spec to generate client types if desired.

### Phase 6 — Core read APIs (weeks 3–4)

- **Goals:** Frontend home page, topic page, version page, argument page **fully usable against the new backend**.
- **Tasks (in order):**
  1. **Topics module:** `GET /api/v1/topics`, `GET /api/v1/topics/:id`. Include version summaries and authors.
  2. **Versions module:** `GET /api/v1/versions`, `GET /api/v1/versions/:id`.
  3. **Arguments module:** `GET /api/v1/arguments` with filters; `GET /api/v1/arguments/:id` with paginated approve/refuse.
  4. **Opinions module:** `GET /api/v1/opinions/by-version/:versionId/flat?userId=`.
  5. Seed data fixtures (small, realistic) via Drizzle Kit's seeder.
- **Deliverables:** Frontend home + topic detail + argument detail flows render with no contract changes.
- **Risks:** Argument detail endpoint's twin pagination (`pageApprove/pageRefuse`) will need lateral joins in Drizzle; budget time for the SQL.
- **Validation:** Manual run-through of every read-only route in §2 against staging API.
- **Frontend impact:** **High value unlock** — users can browse the new backend.

### Phase 7 — Write APIs & business logic (weeks 4–5)

- **Goals:** Submission flows working: opinions, confirmations, refutations.
- **Tasks:**
  1. **Topics/Versions/Arguments POST/PUT/DELETE.** Author-only authorisation checks.
  2. **Argument proofs:** `POST /api/v1/arguments/:id/proofs` (replaces `/api/arguments2`).
  3. **Opinion submission:** `POST /api/v1/opinions`. **This is the single most complex endpoint** — it accepts a tree, persists it transactionally, and updates aggregate counts.
  4. **Veracity / reliability calculation:** Implement synchronously in a transaction. Recompute on every relevant write. Don't go async until proven necessary.
  5. **Soft-delete semantics** on Topic/Version/Argument (set `deleted_at`, hide from reads, keep data for historical opinions).
  6. **Bookmark + Comment endpoints**, only if Phase 0 confirmed they exist.
- **Deliverables:** Frontend submission flow (opinion tree, conf/ref tree) works.
- **Risks:**
  - Veracity formula uncertainty — locked by Phase 0 contract recovery.
  - Transactional integrity for tree submission — write integration tests covering partial failure.
- **Validation:** End-to-end: user submits an opinion tree from the frontend → see it appear in the right places.
- **Frontend impact:** Branch `feat/more-confirmation-page-changes` (current) becomes deployable end-to-end against the new backend.

### Phase 8 — Graph-DB evaluation (week 5, ~2 days, may be a no-op)

- **Goals:** Decide whether to introduce Neo4j or stay PostgreSQL-only.
- **Trigger checklist:**
  - Are there ≥2 query patterns in production that recursive CTE handles too slowly to meet a p95 SLO?
  - Has the product roadmap added cross-topic argument graphs, user-trust propagation, or shortest-path explanation features?
- **If both answers are no:** Document the decision in an ADR and move on.
- **If yes:** Design phase only — pick a CDC strategy (Debezium → Neo4j) or app-level dual-write. Do not implement in this phase.

### Phase 9 — Production hardening (week 6+)

- **Goals:** Production-grade operability.
- **Tasks:**
  1. Structured logs with request IDs (`@fastify/request-context`).
  2. Metrics: `prom-client` exposed at `/metrics`; basic Grafana dashboards.
  3. APM hooks (Sentry or OpenTelemetry).
  4. Rate limiting tightened on write endpoints.
  5. Backups & PITR for Postgres (managed provider gives this for free).
  6. Migration / rollback runbook.
  7. Cutover plan: swap `NEXT_HTTP_URL` from legacy to new backend in staging → soak for 1 week → swap in prod with DNS rollback ready.
- **Validation:** Synthetic monitor for the home page flow runs every 5 minutes, alerts on failure.

### Phased risk summary
| Phase | Highest risk | Mitigation |
|---|---|---|
| 0 | Legacy backend not reachable for traffic capture | Block Phase 6 on this; otherwise we risk shipping a broken contract |
| 3 | Clerk JWT audience mismatch | Test against staging Clerk environment first |
| 4 | Migration strategy mistakes | Use `drizzle-kit generate` (file-based), never `push` in CI/prod |
| 6 | Argument detail pagination complexity | Time-box the lateral-join SQL; if it slips, add a simpler `GET /api/v1/arguments/:id/approvals` and `/refusals` instead |
| 7 | Veracity formula divergence from legacy | Check Phase 0 outputs; if formula is unknown, ship a "v0" formula behind a feature flag |

---

## 10. Concrete MVP Scope

To unblock the current frontend with minimum complexity:

**Must build (in order):**
1. Health endpoints + deployable Docker image (Phases 1–2).
2. Clerk verification + `/api/v1/profile` GET/PATCH (Phase 3).
3. `users` table + Clerk webhook (Phase 4).
4. Topics list + detail GET (Phase 6, slice 1).
5. Versions GET (Phase 6, slice 2).
6. Arguments list + detail (Phase 6, slice 3).
7. Opinions GET by user (Phase 6, slice 4).
8. Opinion submission POST (Phase 7, slice 1).
9. Argument confirmation/refutation submission (Phase 7, slice 2). **This is what the current branch needs.**
10. Argument CRUD (Phase 7, slice 3).
11. Topic/Version CRUD (Phase 7, slice 4).

**Defer:**
- Bookmarks (until product confirms scope).
- Comments (until product confirms scope).
- Background recomputation jobs.
- Neo4j.
- Caching layer.
- Localised content storage strategy beyond `text_en` / `text_ru`.

---

## 11. Risks & Unknowns

### Ambiguities in the repository
- `TArgument.title` vs `.text` vs `.content` (`Argument.model.ts:15-21`) — three textual fields with overlapping semantics. **Risk:** the new backend may unify them, breaking the frontend. Resolution: pick the canonical name (`content`), but accept all three on write at MVP for compat.
- `TVersion.verasity` — typo retained from legacy. New backend should expose `veracityLabel` cleanly but **also alias `verasity` in responses** until the frontend is updated.
- `perPageAprove` (typo, `Pagination.model.ts`). Same approach.
- `userslice.ts` filename casing — minor; ignore.

### Missing contracts
- **Comments API** — undocumented. `CommentTab` widget exists, `countComments` is in models, but no API caller. **Block Phase 7 on this.**
- **Bookmark API** — similar.
- **Veracity formula** — unknown.
- **Author rating formula** — unknown.

### Frontend / domain divergences
- Spanish locale exists for UI but not for opinion content (`textEn`, `textRu` only). The new backend should either extend the schema (add `text_es`) or document the limitation.
- Frontend builds opinion trees in local React state with rich utilities (`assignPaths`, etc.); the backend submission shape (`TOpinionArgumentsSubmitBody`) flattens to `{ items: [...] }`. **The flattening logic is in the frontend** — make sure the backend can reconstruct trees correctly from this flat list.

### Backend assumptions that need validation
- Whether mutations should invalidate React Query caches on the frontend (currently they don't — `useUpdateProfile` does manual `setQueryData`, `useSubmitOpinionArguments` has invalidation commented out). **Recommend:** new backend returns the canonical state in the mutation response, so manual `setQueryData` keeps working.
- Whether reads should require auth. The frontend assumes public reads (`Topic.api.ts:9` doesn't pass a token). New backend should respect this for now and revisit when product needs ACLs.

### Code-smell call-outs that should *not* be replicated
- localStorage `KEY_ACCESS_TOKEN` fallback in `client.ts:33-36` — legacy. Plan to remove.
- `/api/Ashvant2/...` namespace — person's name in URL. Replace.
- `/api/arguments2` — duplicate-resource naming. Replace with `POST /api/v1/arguments/:id/proofs`.

---

## 12. Suggested Backend Folder Structure

```
cyberpravda-backend/
├── src/
│   ├── app.ts                      # Fastify factory (no listen)
│   ├── server.ts                   # listen + signal handlers
│   ├── config/
│   │   └── env.ts                  # zod-validated env
│   ├── plugins/
│   │   ├── cors.ts
│   │   ├── helmet.ts
│   │   ├── rate-limit.ts
│   │   ├── swagger.ts
│   │   ├── auth.ts                 # @clerk/backend wiring, decorates request.user
│   │   ├── db.ts                   # Drizzle instance
│   │   └── error-handler.ts
│   ├── modules/
│   │   ├── health/
│   │   │   └── routes.ts
│   │   ├── profile/
│   │   │   ├── routes.ts
│   │   │   ├── service.ts
│   │   │   ├── repository.ts
│   │   │   └── schemas.ts
│   │   ├── topics/
│   │   ├── versions/
│   │   ├── arguments/
│   │   ├── opinions/
│   │   └── webhooks/
│   │       └── clerk.routes.ts
│   ├── db/
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── topics.ts
│   │   │   ├── versions.ts
│   │   │   ├── arguments.ts
│   │   │   ├── opinions.ts
│   │   │   └── index.ts
│   │   ├── migrations/             # Drizzle Kit output
│   │   └── seed.ts
│   ├── lib/
│   │   ├── pagination.ts
│   │   ├── errors.ts
│   │   ├── ids.ts
│   │   └── tree.ts                 # CTE helpers
│   └── types.ts                    # shared TS aliases
├── tests/
│   ├── integration/
│   └── unit/
├── drizzle.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## 13. Suggested Initial SQL Schema / Modules

**Modules to ship in order:**
1. `health` — no DB tables.
2. `profile` + `users` table.
3. `topics` + `topic_authors`.
4. `versions` + `version_authors`.
5. `arguments` + `argument_authors`.
6. `opinions` (+ optional `opinion_paths` closure).
7. `bookmarks` (conditional on Phase 0).
8. `comments` (conditional on Phase 0).
9. `webhooks` (no own tables, writes to `users`).

Migrations should be linear and forward-only. Never edit a merged migration — always add a follow-up.

Indexes worth creating from day one:
- `users(clerk_id)` unique.
- `topics(deleted_at, created_at desc)` for home list.
- `versions(topic_id)`.
- `arguments(version_id, deleted_at)`.
- `arguments(parent_argument_id)` for proof-tree fetches.
- `opinions(version_id, created_by)` for the user-by-version flat endpoint.
- `opinions(parent_opinion_id)` for tree fetches.

---

## 14. Actionable Build Order (ticket-by-ticket)

**Sprint 0 (day 0–1) — monorepo bootstrap**
- MR-001: `git init` new repo; Yarn 4 + Turborepo + workspaces; root configs.
- MR-002: `packages/tsconfig` and `packages/eslint-config`.
- MR-003: `packages/shared-zod` + `packages/shared-types` (empty stubs).
- MR-004: Copy frontend → `apps/frontend`; bump Next 16 + React 19; run codemods; `yarn workspace frontend build` green.
- MR-005: Drop `next-i18next` dep; replace `start:prod` with Turborepo task.
- MR-006: Verify FE staging deploy from new repo path (still pointed at legacy backend).

**Sprint 1 (week 1) — backend bootstrap + docs**
- BE-001: Bootstrap Fastify + TS + ESLint + Prettier + Vitest in `apps/backend`.
- BE-002: Health + version endpoints.
- BE-003: Dockerfile + docker-compose.yml + .env.example.
- BE-004: GitHub Actions: `turbo run lint typecheck test build`; build & push backend image.
- BE-005: Provision staging Postgres + deploy backend skeleton to staging.
- BE-006: Create `docs/migration/` and copy migration plan to `docs/migration/README.md`.
- BE-007: Generate per-phase docs (`00-discovery.md` … `09-hardening.md`) with frontmatter status blocks per §18.
- BE-008: Write `AGENTS.md` + `CLAUDE.md` per §18.4.
- BE-009: Seed `STATUS.md` dashboard.

**Sprint 2 (week 2)**
- BE-010: Clerk auth plugin + `requireAuth` decorator.
- BE-011: Clerk webhook receiver (Svix verification) — in-memory at first.
- BE-012: Drizzle setup + `users` table + first migration.
- BE-013: Wire webhook → `users` upsert; wire `/api/v1/profile` GET/PATCH.
- BE-014: Integration test: webhook → profile.
- BE-015: API conventions: error model, pagination, Swagger UI.

**Sprint 3 (weeks 3–4)**
- BE-020: Topics module — schema + read endpoints.
- BE-021: Versions module — schema + read endpoints.
- BE-022: Arguments module — schema + read endpoints (incl. paginated approve/refuse).
- BE-023: Opinions module — schema + flat-by-user read endpoint.
- BE-024: Seed data + manual frontend smoke test against staging.

**Sprint 4 (weeks 4–5)**
- BE-030: Topics/Versions write endpoints.
- BE-031: Arguments write + proofs endpoint.
- BE-032: Opinion submission endpoint (transactional tree write).
- BE-033: Aggregate counts (transactional triggers / repo logic).
- BE-034: Author-only authorisation checks across all writes.
- BE-035: Veracity / reliability synchronous calculation v0.

**Sprint 5 (weeks 5–6)**
- BE-040: Phase 0 follow-ups (Bookmarks / Comments if confirmed).
- BE-041: Logging / metrics / Sentry.
- BE-042: Rate limit tuning.
- BE-043: Cutover dry run in staging.
- BE-044: Production cutover.
- BE-045: Decommission legacy `Ashvant2` namespace once frontend updated.

**Frontend follow-up tickets**
- FE-001: Remove `localStorage[KEY_ACCESS_TOKEN]` fallback in `client.ts:33-36`.
- FE-002: Migrate Argument API caller from `/api/Ashvant2/...` to `/api/v1/opinions/...` (when backend exposes both).
- FE-003: Wire React Query invalidation in `useSubmitOpinionArguments` and `useUpdateProfile`.
- FE-004: Drop the `verasity` typo and switch to `veracityLabel` (after backend exposes both).

---

## 15. Repository Strategy (decided: fresh monorepo from day 1)

Per the user's clarification: **a brand-new monorepo is bootstrapped from scratch; the frontend is copied in (not history-migrated) and upgraded to the latest Next.js.** The decision below is recorded for reference and to highlight the trade-offs accepted.

### Comparison (for the record)

| Dimension | Separate repos | **Fresh monorepo from day 1 (chosen)** | Transitional hybrid |
|---|---|---|---|
| Day-1 deployability | ✅ FE untouched | ⚠️ FE redeployed from new path; one-time setup | ✅ FE untouched |
| Type sharing | ❌ Duplicated | ✅ Shared from day 1 | ⚠️ Duplicated weeks 1–4 |
| Contract stability | Forced via artifacts | Atomic FE+BE PRs | Forced via OpenAPI |
| CI complexity | Two simple pipelines | One Turborepo pipeline | Two now, one later |
| Coordination cost | High over time | Low | Low after week 4 |
| Day-1 restructuring | None | Medium (build/deploy reconfig) | Medium (deferred to week 5) |
| Frontend Next.js upgrade | Independent | **Combined with monorepo move** | Independent |

### Why this works for CyberPravda

- **Yarn 4.9.2 already in use** (`package.json:86`) → Yarn workspaces are the natural primitive; no tooling change for the FE team.
- **The frontend is being upgraded to Next.js 16 + React 19 anyway.** Combining the monorepo move with the framework upgrade is cheaper than doing them sequentially — both touch the same files, same scripts, same CI.
- **No git history is preserved** for the frontend in the new repo (per user clarification). This removes the only operational reason to use `git subtree` and simplifies bootstrap to a flat copy + clean commit.
- **Backend has zero code today**; building it inside the monorepo costs no more than a separate repo.
- **`start:prod` script** (`package.json:12`, port 6062, Next standalone) needs reconfiguring anyway because of the Next 16 upgrade — fold this into the monorepo migration.

### Tooling

- **Yarn 4 workspaces** with `nodeLinker: node-modules` (preserves the FE's existing dependency assumptions; PnP would be a separate fight).
- **Turborepo** for `lint` / `build` / `test` pipelines + remote cache (free tier for now).
- **Single ESLint flat config** at root (`packages/eslint-config`); apps extend it.
- **Single Prettier config**, **single base tsconfig** (`packages/tsconfig/base.json`) extended per app.
- **Husky + lint-staged** at root — neither exists in the FE today; this is a quality-of-life upgrade that costs little.
- **Changesets** is *not* recommended yet — no published packages to version.

### Frontend migration sub-track (Next.js 15 → 16, React 18 → 19)

This runs **in parallel with backend Phase 1** (week 1) but is a separate workstream. Concrete tasks:

1. Copy `cyberpravda-frontend-new/` into `apps/frontend/` (flat copy, fresh git history).
2. Bump `next` to latest 16.x; bump `react` and `react-dom` to 19.x.
3. Re-align `@next/eslint-plugin-next` (currently `^15.2.3`) with the new Next major.
4. Audit Clerk: `@clerk/nextjs ^6.1.3` is compatible with Next 16; verify against current release notes.
5. Audit React 19 compatibility for: `@reduxjs/toolkit`, `@tanstack/react-query`, `framer-motion`, `react-hook-form`, `react-image-crop`, `@dnd-kit/core`, `react-select`. All major libs ship React 19 support; pin minimum versions.
6. **Drop `next-i18next`** — it targets Pages Router. The codebase already uses `react-i18next` + `i18next-http-backend` directly; remove the dead dep.
7. Run `npx @next/codemod@latest` for the official 15→16 codemods (async request APIs, image migrations, etc.).
8. Verify Tailwind v4 compatibility (already on v4 — should pass).
9. Replace the `start:prod` script (full of FE-specific copy commands) with Turborepo `turbo run start --filter=frontend`.
10. Verify the existing dev rewrites in `next.config.mjs` still work.

**Acceptance:** `yarn workspace frontend dev` runs locally; `yarn workspace frontend build` completes; staging deploy of FE serves the existing pages (still pointed at legacy backend API at this stage).

**Risk:** React 19 strict-mode tightening can surface effect-cleanup bugs in widgets like `NewConfRefContainer` (uses heavy local reducer state). Budget 1–2 days for triage.

---

## 16. Suggested Repository Layout (day 1)

```
cyberpravda/                            # NEW REPO (e.g. github.com/<org>/cyberpravda)
├── apps/
│   ├── frontend/                       # copied from cyberpravda-frontend-new, upgraded to Next 16
│   │   ├── src/                        # unchanged structure (app/, core/, libs/, widgets/, store/, i18n/)
│   │   ├── public/
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json               # extends ../../packages/tsconfig/next.json
│   │   ├── eslint.config.mjs           # extends ../../packages/eslint-config/next.js
│   │   └── package.json
│   └── backend/                        # built fresh in this repo
│       ├── src/                        # see §12 for full layout
│       ├── drizzle.config.ts
│       ├── Dockerfile
│       ├── tsconfig.json               # extends ../../packages/tsconfig/node.json
│       ├── eslint.config.mjs           # extends ../../packages/eslint-config/node.js
│       └── package.json
├── packages/
│   ├── shared-zod/                     # Zod request/response schemas — single source of truth
│   ├── shared-types/                   # TS types inferred from Zod (z.infer<>)
│   ├── eslint-config/                  # flat configs: base, next, node
│   └── tsconfig/                       # base.json, next.json, node.json
├── docs/
│   └── migration/                      # see §18 — the migration plan lives in the repo
│       ├── README.md                   # top-level migration plan (this document, in-repo)
│       ├── STATUS.md                   # phase status dashboard
│       ├── 00-discovery.md             # per-phase doc with status header
│       ├── 01-bootstrap.md
│       ├── 02-deployment.md
│       ├── 03-clerk.md
│       ├── 04-postgres.md
│       ├── 05-api-foundation.md
│       ├── 06-read-apis.md
│       ├── 07-write-apis.md
│       ├── 08-graph-evaluation.md
│       ├── 09-hardening.md
│       ├── decisions/                  # ADRs
│       │   ├── 0001-fastify-over-nest.md
│       │   ├── 0002-drizzle-over-prisma.md
│       │   ├── 0003-monorepo-layout.md
│       │   └── 0004-defer-neo4j.md
│       └── contracts/                  # Phase 0 captured request/response samples
├── AGENTS.md                           # AI-usage entry point; pointers to /docs/migration
├── CLAUDE.md                           # alias of AGENTS.md (Claude Code looks for both)
├── docker-compose.yml                  # local Postgres + backend dev
├── turbo.json
├── package.json                        # workspaces: ["apps/*", "packages/*"]
├── .yarnrc.yml                         # Yarn 4 config (nodeLinker: node-modules)
├── .nvmrc                              # node version pin
├── .github/
│   └── workflows/
│       ├── ci.yml                      # turbo run lint + typecheck + test + build
│       ├── deploy-backend.yml
│       └── deploy-frontend.yml
└── README.md                           # rewritten — public-facing project overview
```

**Bootstrap recipe (Phase 1, Day 1):**

1. `mkdir cyberpravda && cd cyberpravda && git init`
2. Initialise Yarn 4: `yarn set version 4.9.2`, write `.yarnrc.yml` with `nodeLinker: node-modules`.
3. Root `package.json` with `"workspaces": ["apps/*", "packages/*"]` and `"private": true`.
4. Add Turborepo: `yarn add -D turbo`, write `turbo.json` with `lint`, `typecheck`, `test`, `build` pipelines.
5. Create `packages/tsconfig/{base,next,node}.json` and `packages/eslint-config/{base,next,node}.js`.
6. **Copy this migration plan** to `docs/migration/README.md` and create the per-phase status docs (see §18).
7. **Copy the frontend:** `cp -R ../cyberpravda-frontend-new/{src,public,next.config.mjs,...} apps/frontend/` (no `.git`, no `node_modules`, no `.next`). Update `apps/frontend/package.json` to extend the shared configs and bump Next/React majors.
8. Run the Next codemods, verify `yarn workspace frontend build` succeeds.
9. **Bootstrap the backend** in `apps/backend/` per §12.
10. Write `AGENTS.md` + `CLAUDE.md` (see §18) so AI tooling can discover phase status.
11. First commit: "chore: bootstrap monorepo with frontend copy + backend skeleton".

**Rejected:**
- **Yarn workspaces without Turborepo** — works for two apps but loses parallelism in CI.
- **pnpm** — would force the FE off Yarn 4; not worth the churn.
- **Nx** — overkill for two apps + four config packages.
- **Preserving frontend git history via `git subtree` / `git filter-repo`** — explicitly waived by the user. Saves 1–2 days of fiddly git work.

---

## 17. Optional Phase-2+ Neo4j Extension Plan

**Trigger conditions** (any one is enough to start):
- Cross-topic argument graph becomes a product feature.
- User-trust propagation / pagerank-style scoring is on the roadmap.
- A specific recursive query in PostgreSQL has been measured to exceed p95 SLO and is unfixable with indexes / closure tables.

**Integration shape (when triggered):**
- Neo4j as **secondary read model**, never primary.
- Sync model: change-data capture from PostgreSQL via Debezium → Kafka → a small Node consumer that maintains the Neo4j projection. Alternative: app-level dual-write inside the same DB transaction where consistency is critical (rare).
- What stays in Postgres: **everything**. PostgreSQL is the source of truth.
- What moves to Neo4j: a denormalised graph projection of `(:User)-[:AUTHORED]->(:Argument)`, `(:Argument)-[:SUPPORTS|REFUTES]->(:Argument)`, `(:Argument)-[:UNDER]->(:Version)-[:OF]->(:Topic)`. Used only for graph algorithms; the API hits Neo4j only for those specific endpoints.

---

## 18. In-Repo Migration Docs & AI Usage Tracking

The migration plan and its execution state are first-class artefacts inside the new repo. They are how both humans and AI assistants understand "where are we in this migration right now" without having to ask.

### 18.1. Layout under `docs/migration/`

```
docs/migration/
├── README.md                # this entire migration plan (copied from ~/.claude/plans/...)
├── STATUS.md                # auto-skimmed dashboard — one row per phase
├── 00-discovery.md          # one file per phase; contains status block + tasks
├── 01-bootstrap.md
├── 02-deployment.md
├── 03-clerk.md
├── 04-postgres.md
├── 05-api-foundation.md
├── 06-read-apis.md
├── 07-write-apis.md
├── 08-graph-evaluation.md
├── 09-hardening.md
├── decisions/               # ADRs — one per architectural choice
│   ├── 0001-fastify-over-nest.md
│   ├── 0002-drizzle-over-prisma.md
│   ├── 0003-monorepo-layout.md
│   ├── 0004-defer-neo4j.md
│   └── 0005-clerk-jwt-only.md
└── contracts/               # captured legacy backend traffic (Phase 0 output)
    ├── topics.http
    ├── arguments.http
    └── ...
```

### 18.2. Per-phase doc template

Every `NN-phase.md` file starts with a YAML frontmatter status block. AI tools and humans both read this block first.

```markdown
---
phase: 03
title: Clerk integration
status: in-progress       # one of: not-started | in-progress | blocked | done | deferred
owner: <github-handle>
started: 2026-05-04
last-updated: 2026-05-08
target-completion: 2026-05-10
blockers:
  - waiting on Clerk JWT template config from product
  - needs staging URL for webhook (depends on Phase 2)
---

# Phase 03 — Clerk integration

## Goals
…

## Task checklist
- [x] Add `@clerk/backend` dependency
- [x] Implement `authPlugin` Fastify plugin
- [ ] Wire `request.user` decorator
- [ ] Add Svix-signed webhook receiver
- [ ] End-to-end test: FE login → BE `/api/v1/profile` → 200

## Decisions made in this phase
- See `decisions/0005-clerk-jwt-only.md`

## Open questions / risks
- …

## Acceptance criteria
- See §9 Phase 3 in [README.md](./README.md)
```

**Rules:**
- `status` values are normative (not free-form); only the five listed.
- `last-updated` must be bumped on every meaningful change.
- Task checklist mirrors the Build Order in §14 of the main plan.
- Every "decision made" must reference an ADR file in `decisions/`.

### 18.3. `STATUS.md` — at-a-glance dashboard

Top of `docs/migration/STATUS.md`:

```markdown
# Migration Status

_Last regenerated: 2026-05-08_

| Phase | Title | Status | Owner | Target | Blockers |
|-------|-------|--------|-------|--------|----------|
| 00 | Discovery & contract extraction | done | @rrozanov | 2026-05-03 | — |
| 01 | Backend bootstrap | done | @rrozanov | 2026-05-04 | — |
| 02 | Deployment & environment | in-progress | @rrozanov | 2026-05-09 | self-hosted runner config |
| 03 | Clerk integration | in-progress | @rrozanov | 2026-05-10 | JWT template |
| 04 | PostgreSQL & Drizzle | not-started | — | 2026-05-12 | depends on 03 |
| 05 | API foundation conventions | not-started | — | 2026-05-15 | — |
| 06 | Core read APIs | not-started | — | 2026-05-22 | — |
| 07 | Write APIs & business logic | not-started | — | 2026-05-29 | answers from Appendix A |
| 08 | Graph-DB evaluation | not-started | — | TBD | — |
| 09 | Production hardening | not-started | — | TBD | — |

## Frontend migration sub-track
| Step | Status | Notes |
|------|--------|-------|
| Copy frontend to apps/frontend | done | 2026-05-04 |
| Bump Next 15 → 16 | in-progress | codemod run; one effect-cleanup bug found in NewConfRefContainer |
| Bump React 18 → 19 | in-progress | — |
| Drop next-i18next | not-started | — |
| Verify Clerk + Next 16 | not-started | — |
| Replace start:prod | not-started | — |
```

`STATUS.md` can be either hand-edited or regenerated from each phase doc's frontmatter via a small script (`scripts/regenerate-status.ts` — optional, ship later).

### 18.4. `AGENTS.md` (and `CLAUDE.md`) at repo root

Single entry point for AI tooling. Short — the heavy detail lives under `docs/migration/`.

```markdown
# AGENTS.md

This is the cyberpravda monorepo. Two apps live here: `apps/frontend` (Next.js 16) and `apps/backend` (Fastify + Drizzle + PostgreSQL).

## Where to start

If you're an AI assistant working on this repo:

1. **Read the migration plan** at `docs/migration/README.md` for the full architecture and rationale.
2. **Check current status** at `docs/migration/STATUS.md` to know which phase is active.
3. **For the active phase**, open the matching `docs/migration/NN-*.md` file. The frontmatter shows status, owner, blockers; the body lists tasks.
4. **For architecture questions**, read the relevant ADR in `docs/migration/decisions/`.
5. **For the Phase 0 captured contract**, see `docs/migration/contracts/`.

## Ground rules

- Do not change the API contract surface without updating both `packages/shared-zod` AND the relevant phase doc's "Decisions made" section.
- When you finish a task in the active phase, update the checkbox in the phase doc AND bump `last-updated` in the frontmatter AND update `STATUS.md`.
- When you make an architectural decision, write an ADR in `docs/migration/decisions/` (next sequential number, kebab-cased title).
- Conventions: §12 of the migration plan defines backend folder structure; the frontend keeps its existing `src/` layout from the legacy repo.

## Repo conventions

- Yarn 4 workspaces. Run scripts via `yarn workspace <name> <script>` or via Turborepo: `yarn turbo run <task>`.
- Path aliases (frontend): `@/*`, `@core/*`, `@libs/*`, `@widgets/*` (preserved from legacy).
- TypeScript strict mode everywhere.
- ESLint + Prettier + simple-import-sort enforced in CI.
```

`CLAUDE.md` is a one-line file: `<!-- See AGENTS.md -->`. (Or copy `AGENTS.md` content; both files are conventional.)

### 18.5. Lifecycle / how docs stay current

- Every PR that completes a task in an active phase must include:
  1. The checkbox flip in `docs/migration/NN-*.md`.
  2. A `last-updated:` bump in the frontmatter.
  3. A `STATUS.md` update if the phase status itself changed.
- Each Friday, the migration owner reviews `STATUS.md` and adjusts `target-completion` dates.
- ADRs are append-only — never edit a merged ADR; supersede it with a new one (`0006-supersedes-0002.md`).
- Phase doc status `deferred` means "scoped out, not abandoned" (e.g. comments API if Phase 0 confirms there isn't one yet).

### 18.6. Why this layout (not Notion / Confluence / Jira)

- **Co-located with code:** the plan version-tracks alongside what it describes. A PR can update both code and plan atomically.
- **AI-discoverable:** `AGENTS.md` is the de-facto convention; Claude Code reads `CLAUDE.md`. No external system access required.
- **Diffable:** `git log docs/migration/` shows the actual history of decisions, not a wiki revision graph.
- **Read-only fallback:** a Jira mirror (or Notion) can be a *projection* of `STATUS.md`, but the source of truth stays in-repo.

### 18.7. Tasks added to Phase 1 to make this real

(reflected in §14 build order — restated here for visibility):

- BE-006: Create `docs/migration/` structure; copy this plan to `README.md`.
- BE-007: Generate per-phase docs from the plan with frontmatter blocks.
- BE-008: Write `AGENTS.md` and `CLAUDE.md`.
- BE-009: Initial `STATUS.md` snapshot (all phases not-started except 00 + bootstrap-in-progress).

These are tiny, but doing them in week 1 means all subsequent work is automatically documented as it happens.

---

## Appendix A — Phase 4 prerequisites (open questions to answer before starting)

1. Does the production legacy backend expose a Comments API? If so, what shape?
2. Does it expose a Bookmarks toggle endpoint?
3. What is the formula for `versions.reliability` in the legacy backend?
4. What is the formula for `users.rating`?
5. Is there a moderation pipeline (admin role, content takedown)?
6. Is there an "edit history" feature being built that we are unaware of?
7. What happens when an argument with downstream confirmations is deleted? Hard delete vs orphan?
8. Where is the legacy backend deployed and what does its CI/deploy look like? (Needed for cutover.)
9. Is the `/sign/[[...rest]]/` route hosting Clerk's UI or a custom shell? (Affects how we configure Clerk JWT templates.)
10. What is the Clerk JWT template config — do JWTs include the user's `id`, `email`, and `languageCode`?

---

## Appendix B — Two-week & six-week milestone summary

### Weeks 1–2 (MVP Bootstrap)
- ✅ Backend repo with Fastify + Drizzle skeleton.
- ✅ Deployed to staging with health checks.
- ✅ Clerk auth working end-to-end.
- ✅ `users` table + webhook + `/profile` flow.
- ✅ Phase 0 unknowns answered.

### Weeks 3–6 (Read APIs → Write APIs → Hardening)
- ✅ Topics / Versions / Arguments / Opinions read endpoints — frontend reads from new backend.
- ✅ Opinions submission + confirmation/refutation submission — frontend writes to new backend.
- ✅ Topics/Versions/Arguments CRUD.
- ✅ Veracity v0 + author rating v0.
- ✅ Cutover from legacy backend in staging.
- ✅ Monorepo migration (week 5).
- ✅ Production cutover (end of week 6 or shortly after).

---

## Appendix C — Tasks parallelisable between FE and BE teams

| FE work | BE work (parallel) |
|---|---|
| Phase 0 traffic capture | Phase 1 backend bootstrap |
| Phase 0 contract documentation | Phase 2 deployment |
| FE-001 (remove localStorage fallback) | Phase 3 Clerk plugin |
| FE-003 (wire React Query invalidation) | Phase 7 write endpoints |
| Add OpenAPI-generated client (optional) | Phase 5 OpenAPI publishing |
| Drop `verasity` typo (FE-004) | Backend exposes both names temporarily |

The BE team can run **autonomously through Phase 5 (week 3)** without FE support. Phases 6–7 require FE co-validation but no FE code changes.

---

## Appendix D — Deployment-first sequence (the shortest path to "running in prod")

1. **Day 1:** Repo + Fastify hello-world + Dockerfile.
2. **Day 2:** GH Actions builds image; manual deploy to staging host.
3. **Day 3:** Health endpoints + structured logging + CORS + Helmet.
4. **Day 4:** `@clerk/backend` plugin + a single protected `GET /api/v1/whoami` endpoint.
5. **Day 5:** Postgres up, Drizzle wired, `users` table.
6. **Day 6–7:** Webhook + `/api/v1/profile`.
7. **Day 8+:** Begin Phase 6 read endpoints.

By the end of Day 7 the backend is in staging, talking to Clerk and Postgres, and serving authenticated profile reads. Every subsequent endpoint is an additive change. **No big bang.**

---

## Verification Strategy

How to know the plan worked:

1. **Phase 1–2:** `curl https://api-staging.cyberpravda.dev/api/v1/health/live` → 200.
2. **Phase 3:** Manual Clerk login from frontend; profile fetch returns 200 with the right user.
3. **Phase 4:** Insert via webhook (Svix CLI) → profile fetch reflects the data.
4. **Phase 5:** Open `/api/v1/docs` and see the full schema.
5. **Phase 6:** Run the existing frontend pointed at staging API; every read-only route renders.
6. **Phase 7:** Submit an opinion tree from the frontend → verify all rows in DB; verify counts updated; verify it appears in subsequent GETs.
7. **Phase 9:** Synthetic monitor green for 7 days against staging; flip prod; monitor for 24h.

Tests (in BE repo):
- Unit: schemas, pure veracity calculation logic.
- Integration: per-module routes against ephemeral Postgres.
- Contract: replay Phase 0 captured requests; assert response shape with Zod.
