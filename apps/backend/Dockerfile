# syntax=docker/dockerfile:1.7
# Build context: repository root (so Yarn 4 workspaces resolve).
#   docker build -f apps/backend/Dockerfile -t cyberpravda-backend .

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat tini && corepack enable
WORKDIR /workspace
ENV CI=true

# ---- deps: install all workspace deps (immutable) -----------------------
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/shared-zod/package.json ./packages/shared-zod/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
RUN yarn install --immutable

# ---- build: compile TS to dist ------------------------------------------
FROM deps AS build
COPY turbo.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN yarn workspace @cyberpravda/backend build

# ---- prune: production-only node_modules --------------------------------
FROM deps AS prune
RUN yarn workspaces focus @cyberpravda/backend --production

# ---- runtime: minimal image ---------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runtime
RUN apk add --no-cache tini && addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prune --chown=app:app /workspace/node_modules ./node_modules
COPY --from=build --chown=app:app /workspace/apps/backend/dist ./dist
COPY --chown=app:app apps/backend/package.json ./package.json
USER app
EXPOSE 3001
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
