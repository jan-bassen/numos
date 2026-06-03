# CLAUDE.md — Numos Portfolio Migration

> This file is the durable context for this repo. It is loaded into every session.
> **Live status, the phase checklist, and the decision log live in
> [`docs/portfolio-migration.md`](docs/portfolio-migration.md).** Read that file at the
> start of any working session to see where we are. Keep both files current as we go.

## Mission

Numos is an older personal project. We are reviving **two of its apps** to host on
**Jan's portfolio**, running on a **Hetzner server via Coolify** (Docker). Each app is
deployed as its own Coolify application:

- **`apps/web`** — the marketing site + docs.
- **`apps/studio`** — the product: a visual node-editor for building dynamic/interactive
  digital assets. This is a *showcase demo*, not a real multi-tenant service.

The bar is: both apps build cleanly, run smoothly self-hosted, and a first-time visitor can
**"just tap around and get a feel"** for what studio does — with no signup, no external
accounts, and nothing broken in the path they'll click through.

## Working agreement (how we collaborate on this)

- This is a **gradual cleanup + targeted replacement** effort, not a rewrite. Keep diffs
  reviewable and the apps runnable between steps.
- Before starting work, check the **Status** section of `docs/portfolio-migration.md`.
  After finishing a meaningful step, tick its checkbox and append a line to the
  **Decision log** if a choice was made.
- When you hit a fork that changes scope or product behavior, stop and ask — record the
  answer in the decision log so we never re-litigate it.
- Prefer deleting dead/broken/unfinished code over hiding it. If something is half-built and
  not on the demo path, remove it rather than maintain it.

## Locked decisions (see decision log for full list)

1. **Studio storage** → fully **client-side & ephemeral** (localStorage/IndexedDB), seeded
   with demo content on load. No backend DB, resets per visitor. Supabase is removed.
2. **Studio auth** → **removed entirely**. No login wall, no middleware redirect; visitors
   land straight in the app. Account/profile features get stubbed or deleted.
3. **Prior branches** (`origin/localStorage`, `origin/showcase`) → **reference only**. They
   went a different direction (Vercel + Drizzle, web deleted) and their correctness is not
   trusted. Mine them for ideas; do **not** cherry-pick or treat as templates. We rebuild on
   the current `portfolio` monorepo.
4. **Hosting** → Coolify on Hetzner, Docker. Not Vercel. No Supabase/AWS/Alchemy/OpenAI
   accounts in the deployed apps unless explicitly re-introduced.
5. **Web drops Payload CMS entirely.** The landing page is fully static (driven by
   `dictionaries/en.json` + hand-written components); Payload only powered the unrouted
   `_docs` section. Removing it kills the Postgres + Blob storage + SMTP + admin-panel
   burden. No docs section for now (revisit as static MDX later if wanted).
6. **Trim the repo to what we ship, but keep the monorepo.** Remove `apps/hub`, `apps/core`,
   and `packages/email` (no dependents we keep). Keep `web`, `studio`, and
   `packages/{shared,ui,tsconfig}`. Turborepo + pnpm-workspace structure stays.

## Architecture map

Turborepo + pnpm workspaces. Next.js 15 / React 19. Biome for lint/format. TypeScript 5.7.

```
apps/
  web/      ← TARGET. Next.js marketing site. Static (dictionaries/en.json + components).
              Dropping Payload CMS; stripping HubSpot signup + PostHog.
  studio/   ← TARGET. Next.js node-editor app. Supabase (auth+db+storage, ~113 files),
              AWS S3/Lambda/SES, viem/Alchemy, AI SDK, Google Maps, HubSpot, PostHog.
  hub/      ← REMOVE. Separate Next.js app, out of scope.
  core/     ← REMOVE. AWS CDK backend (DynamoDB/Lambda), out of scope.
packages/
  shared/   ← KEEP. Used heavily by studio (~125 files): engine, types, schemas, utils.
  ui/       ← KEEP. Shared shadcn/ui component lib + icons (used by web + studio).
  email/    ← REMOVE. react-email; only dependent was hub.
  tsconfig/ ← KEEP. Shared tsconfig.
```

**Studio domain model** (current Supabase tables → to become client-side entities):
`accounts`, `profiles`, `collections`, `attributes`, `actions`, `action_nodes`,
`action_connections`, `layers`, `image_nodes`, `image_connections`, `versions`, `uploads`,
`folders`, `account_memberships`. The UI nests as
`collections → attributes / actions / layers`, with a **rete.js** node graph for action &
image logic. Data access today is via `'use server'` actions in `apps/studio/lib/supabase/db/*`.

## Commands

```sh
pnpm install                 # install (pnpm@9.1.4, node >=18)
pnpm dev                     # turbo dev (all apps)
turbo dev --filter=studio    # studio only
turbo dev --filter=web       # web only
turbo build                  # build all
pnpm lint                    # biome check
```

## Conventions

- **pnpm only** (enforced via `only-allow`). Use `pnpm i <pkg> --filter=<app>`.
- **Biome** owns formatting & linting — match existing style; don't introduce Prettier/ESLint
  config beyond what's there.
- Shared UI/types come from `@repo/ui` and `@repo/shared` — reuse before adding new deps.
- Studio server data functions are `'use server'`; replacements should keep call-sites stable
  where reasonable so the migration is incremental.

## Out of scope (do not work on unless asked)

`apps/hub`, `apps/core`, real auth, real payments (Stripe), real blockchain/RPC, email
sending, multi-tenant accounts, and any paid third-party integration in the deployed apps.
