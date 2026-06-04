# Monorepo-aware Dockerfile for apps/web.
# Build context MUST be the repo root (so the pnpm workspace + lockfile are visible).
# In Coolify: Build Pack = Dockerfile, Base Directory = /, Dockerfile = apps/web/Dockerfile.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- Prune the monorepo down to just web + its workspace deps ----
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.4.4 prune web --docker

# ---- Install deps from the pruned manifests (cached on the lockfile) ----
FROM base AS installer
COPY --from=pruner /app/out/json/ ./
RUN pnpm install --frozen-lockfile

# ---- Build only the web app ----
FROM installer AS builder
COPY --from=pruner /app/out/full/ ./
RUN pnpm turbo build --filter=web
# Next standalone output lands at apps/web/.next/standalone (monorepo layout).

# ---- Minimal runtime image ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
