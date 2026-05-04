# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CyberPravda is a debate/opinion platform where users create **topics**, propose **versions**, write **arguments**, and submit **opinions**. This repo is the Next.js frontend; it talks to an external REST API backend (no CMS in this repo).

## Commands

```bash
yarn dev              # Start dev server (http://localhost:3000)
yarn build            # Production build (standalone output + sitemap)
yarn build:analyze    # Production build with bundle analyzer
yarn start            # Start production server
yarn lint             # ESLint (flat config, eslint.config.mjs)
yarn prettier:verify  # Check formatting
yarn prettier:fix     # Auto-fix formatting
```

No test framework is configured.

## Tech Stack

- **Next.js 15** (App Router, standalone output) + **React 18** + **TypeScript 5**
- **Yarn 4.9.2** (Corepack) — never use npm
- **Clerk** for auth — middleware in `src/middleware.tsx`, provider in `RootProviders`
- **TanStack React Query v5** — prefetch+dehydrate in Server Components, `useQuery`/`useMutation` on client
- **Axios** HTTP client (`src/core/api/client.ts`), base URL from `NEXT_HTTP_URL` env var
- **Redux Toolkit** for UI state (`src/store/`) — slices: user, arguments, toast
- **Tailwind CSS v4** (`@theme` tokens in `globals.scss`) + **SCSS Modules** + `classnames` + `tailwind-merge`
- **i18next** + react-i18next — locales: `en`, `ru`, `es` — JSON files in `public/locales/`
- **Framer Motion**, **@dnd-kit**, **lucide-react** icons

## Architecture

```
src/
├── app/              # App Router: routes, layouts, global styles, fonts
│   ├── [locale]/     # Locale-prefixed routes
│   └── styles/       # SCSS theme partials (_colors, _typo, _radius, _shadows, _paddings)
├── core/             # Shared infrastructure
│   ├── api/          # Axios client, API classes (TopicApi, ArgumentApi, VersionsApi, ProfileApi), hooks, models
│   ├── models/       # Domain models (Topic, Argument, Version, Opinion, Author)
│   ├── providers/    # ReactQuery, Redux Store, Root (Clerk) providers
│   └── utils/        # Cookies, meta generation, path helpers
├── i18n/             # i18next config — client/server init, locale manager
├── libs/             # Reusable utilities
│   ├── hooks/        # Shared hooks (useDebouncedValue, useLocaleRouter, useQueryParams, etc.)
│   └── ui-components/# Primitive UI (Card, Button, Modal, Skeleton, Tabs, Toast, etc.)
├── store/            # Redux store + slices (userslice, argumentsSlice, toastSlice)
├── widgets/          # Domain-specific composite UI (AppHeader, Arguments*, Versions*, Opinion*, PageWidgets/)
└── middleware.tsx     # Clerk auth middleware
```

### Path Aliases

- `@/*` → `src/*`
- `@core/*` → `src/core/*`
- `@libs/*` → `src/libs/*`
- `@widgets/*` → `src/widgets/*`

Always use path aliases in imports.

### Data Fetching Pattern

- **Server Components:** Call API classes directly → `prefetchQuery` → `dehydrate` → pass to `SSRReactQueryProvider`
- **Client Components:** `useQuery` / `useMutation` hooks from `src/core/api/hooks/`
- **API classes** are static: `TopicApi.getTopics()`, `ArgumentApi.getArguments()`, etc.
- **Auth on API calls:** `useAuth().getToken()` → `withAuth(token)` passed to API methods

### Naming Conventions

- **Components:** PascalCase dirs and files — `ComponentName.tsx`
- **Co-located files:** `ComponentName.module.scss`, `ComponentName.models.ts`, `ComponentName.utils.ts`, `ComponentName.reducer.ts`
- **Barrel exports:** `index.ts` re-exporting from main file
- New UI primitives → `src/libs/ui-components/`; domain widgets → `src/widgets/`
- New API endpoints: static method on class in `src/core/api/apis/`, React Query hook in `src/core/api/hooks/`
- New domain types → `src/core/models/`; API response types → `src/core/api/models/`

### Styling

- **Tailwind utility classes** for layout/spacing + **SCSS Modules** for complex component styles
- Design tokens as CSS custom properties in `src/app/styles/theme/`; Tailwind v4 tokens in `@theme {}` block in `globals.scss`
- Combine classes with `classnames` or `tailwind-merge`

### i18n

- Namespaces: `common`, `metadata`, `mainPage`, `topicVersion`, `searchPage`, `consensusPage`, `argumentPage`, `newOpinionPage`
- Server: `initServerI18n` for metadata generation
- Client: `useTranslation` with namespace

## Linting & Formatting

- **ESLint 9** flat config (`eslint.config.mjs`) — TypeScript, React, Next, `simple-import-sort`, `unused-imports`
- **Prettier:** single quotes, JSX single quotes, 120 char print width, trailing comma es5, Tailwind class sorting plugin
- `no-console` is `warn` in `.ts` files, `error` in `.tsx` files (console.warn/error allowed)
- Unused vars with `_` prefix are allowed (`argsIgnorePattern: ^_`)
- No pre-commit hooks (no husky/lint-staged)

## Environment Variables

- `NEXT_HTTP_URL` — Backend API base URL (Axios baseURL)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk public key
- `CLERK_SECRET_KEY` — Clerk secret
- `SERVER_API_BASE_URL` — Dev-only: proxy target for `/api/*` rewrites

## Deployment

- GitHub Actions on push to `main` (self-hosted runner)
- Build: `yarn install` → `yarn build` → copy `public/` and `.next/static/` into standalone → systemd restart on port 6062
- Production URL: `https://new.cyberpravda.dev`
