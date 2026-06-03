# Portfolio Migration — Plan & Status

Living document. Update the **Status** block and tick checkboxes as work lands.
Durable context (architecture, conventions, locked decisions) lives in
[`CLAUDE.md`](../CLAUDE.md).

---

## Status — You are here

- **Phase:** 1 — complete. Repo trimmed to the two target apps + 3 kept packages.
- **Last done:** Phase 1 (2026-06-03): deleted `apps/hub`, `apps/core`, `packages/email`;
  removed orphaned `hub#*`/`core#*` tasks from `turbo.json`; rewrote `README.md` to the
  two-app reality. `pnpm install` clean; both builds still fail **only** at the pre-existing
  baseline points (web → Payload `/api/graphql`, studio → `next.config.ts`), i.e. the trim
  added no new breakage. (Phase 0 baseline before this: see [findings](#phase-0-findings).)
- **Next up:** Phase 2 — `web` migration: remove Payload entirely (gets web building), then
  HubSpot + PostHog.
- **Blockers / open questions:** see [Open questions](#open-questions).

> Update this block at the end of each session: Phase, Last done, Next up, Blockers.

---

## Guiding principles

1. **Demo-first.** Studio is a tap-around showcase. If a feature needs a real backend, key,
   or account to work, either stub it convincingly or remove it from the demo path.
2. **Always runnable.** Each phase leaves both apps buildable. No long-lived broken `main`.
3. **Delete > disable.** Remove dead/unfinished/broken code rather than hiding it.
4. **Incremental swaps.** Replace external deps behind stable call-sites so we can migrate
   file-by-file instead of big-bang.
5. **No new paid deps in deployed apps.** Self-hostable on Coolify or it doesn't ship.

---

## Phase 0 — Baseline & ground truth

Goal: know exactly what builds, runs, and breaks today before changing anything.

- [x] `pnpm install` clean on current Node/pnpm; record any failures.
- [x] `turbo build --filter=web` — does it build? Capture errors.
- [x] `turbo build --filter=studio` — does it build? Capture errors.
- [x] Boot each app in dev with placeholder/empty env; note which screens load vs crash.
- [x] Inventory required env vars per app (start from `CLAUDE.md` + `grep process.env`).
- [x] Write down the "happy path" we want a visitor to click through in studio (drives what
      must work end-to-end).

### Phase 0 findings

_Captured 2026-06-03. Toolchain: Node v26.1.0, pnpm 9.1.4 (matches `packageManager`)._

**Build / run baseline**

- `pnpm install` — clean, lockfile up to date, all 9 workspace projects in scope.
- **web** `next build` — *compiles successfully*, then fails at "Collecting page data" with
  `Error: DATABASE_URI is not set` from `app/(payload)/api/graphql/route.js`. So the only
  thing blocking a green web build is **Payload** (its routes + DB). Confirms the Phase 2
  plan: removing Payload should get web building with zero services.
- **studio** `next build` — fails *earlier*, at config load: `next.config.ts` throws
  `Missing database service key environment variable` because
  `NEXT_PUBLIC_SUPABASE_PROJECT_ID` is unset (used only to whitelist the Supabase storage
  image host). Studio can't even start a build/dev without Supabase env → first Phase 3
  unblock is decoupling `next.config.ts` from Supabase. `next.config.ts` also has a
  commented-out Sentry wizard block to delete.
- Neither app has a `.env.example`; no local `.env` present.

**Env var inventory** (source only, excludes `.next`/`node_modules`)

- **web:** `DATABASE_URI`, `PAYLOAD_SECRET` (Payload); `BLOB_READ_WRITE_TOKEN` (Payload media
  blob); `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` (Payload email); `HUBSPOT_ACCESS_TOKEN`
  (signup); `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` (analytics). All slated for
  removal. Keep only generic `NODE_ENV` / `ENVIRONMENT` / `NEXT_PUBLIC_ENVIRONMENT`.
- **studio:** `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` /
  `NEXT_PUBLIC_SUPABASE_PROJECT_ID` / `SUPABASE_SERVICE_KEY` (Supabase);
  `NEXT_PUBLIC_ALCHEMY_PROJECT_ID` / `ETHERSCAN_API_KEY` (blockchain);
  `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (maps); `HUBSPOT_ACCESS_TOKEN`; `NEXT_PUBLIC_POSTHOG_*`;
  `CRON_SECRET` (the `/api/keep-alive` Supabase keep-alive cron). All slated for removal/stub.

**Studio route map** (`apps/studio/app`)

- Demo core (keep): `/` → redirects to `/collections`; `/collections`,
  `/collections/[collection]`, `.../attributes[/[attribute]]`,
  `.../actions[/[action]][/logic]`, `.../image/[layer][/logic]`, `.../uploads`.
- Auth/account (remove): `/login`, `/signup`, `/auth/*`, `/account`.
- Scaffolding (remove): `/test`, `/api/keep-alive`, `middleware.ts` (redirects any
  unauthenticated request to `/login` via Supabase session check).

**Demo happy path** (what a first-time visitor should be able to tap through)

1. Land on `/` → auto-redirect to `/collections`; see a **seeded** sample collection (not
   empty).
2. Open the collection → see its **attributes**, **actions**, and **image layers**.
3. Open an **attribute** → view/tweak it.
4. Open an **action** → open its **logic** tab → see/drag the **rete.js** node graph.
5. Open an **image layer** → open its **logic** tab → see the image node graph compose a
   result.
6. (Optional) Have a **"start over / reset demo"** affordance that reseeds local data.

Anything off this path that needs a key/backend (maps, blockchain, AI, real uploads) is a
candidate to stub, degrade, or remove in Phase 3c.

---

## Phase 1 — Repo scope trim

Goal: shrink to the two target apps + the shared packages they use. **Keep the monorepo
structure** (Turborepo + pnpm workspaces) — we're losing dead weight, not flattening.

Keep: `apps/web`, `apps/studio`, `packages/{shared,ui,tsconfig}`.
Remove: `apps/hub`, `apps/core`, `packages/email` (verified: only `hub` depended on `email`).

- [x] Delete `apps/hub`, `apps/core`, `packages/email`.
- [x] Drop any now-orphaned root deps / pnpm overrides tied only to removed apps.
      _(Removed `hub#*`/`core#*` task blocks from `turbo.json`. Root `pnpm.overrides` are all
      `@radix-ui/*` used by `ui`/`web`/`studio` → kept. Root devDeps are generic → kept.)_
- [x] Trim `README.md` to the two-app portfolio reality.
- [x] Confirm `turbo.json` / `pnpm-workspace.yaml` globs don't reference removed apps.
      _(`pnpm-workspace.yaml` uses `apps/*` + `packages/*` globs — no explicit refs.)_
- [x] `pnpm install` + `turbo build` still green after trim.
      _(Install clean. Builds fail only at the pre-existing baseline points — no new breakage
      from the trim; full green comes with Phases 2/3.)_

---

## Phase 2 — `web` migration

Goal: marketing site builds and runs self-hosted as a **static-ish Next.js app with zero
external services** — no DB, no blob storage, no SMTP, no analytics.

> Confirmed: the landing page renders entirely from `dictionaries/en.json` + hand-written
> components (Hero/Architecture/Highlights/Pricing/Team/Tweets). Payload only powered the
> `_docs` section, which is an unrouted private folder (`_docs`/`_pricing` are underscore-
> prefixed, so not live). Nothing public depends on the CMS → we drop Payload wholesale.

- [ ] **Remove Payload entirely:** the `app/(payload)/*` route group, `payload.config.ts`,
      `payload-types.ts`, `collections/*`, `lib/payload/*`, and all `@payloadcms/*` + `payload`
      + `graphql` + `@payloadcms/db-postgres`/`pg` deps. Also remove the `typegen`/`importgen`
      payload scripts.
- [ ] **Remove the docs section** (`app/(web)/_docs/*`) since it was Payload-driven and
      unrouted. (Revisit later as static MDX if docs are wanted — out of scope for now.)
- [ ] **HubSpot:** remove the signup→HubSpot integration (`lib/hubspot/*`,
      `components/sign-up/*`, the HubSpot bits of `app/(web)/providers.tsx`). Replace the
      signup CTA with a no-op / mailto / "coming soon" appropriate for a portfolio.
- [ ] **PostHog:** remove or make fully no-op when keys are absent (`lib/posthog/*`,
      `app/(web)/layout.tsx`, `providers.tsx`, cookie banner).
- [ ] Prune now-dead deps; update what remains; get `next build` green.
- [ ] Verify all landing-page sections render with no env vars set.

---

## Phase 3 — `studio` migration (the big one)

Goal: Supabase fully removed; client-side ephemeral data; no auth; only working features
remain; smooth tap-around demo.

### 3a. Decouple from Supabase data layer
- [ ] Map every `lib/supabase/db/*` server action to the entity it touches.
- [ ] Design a **client-side data layer** (localStorage/IndexedDB) mirroring those entities
      with the same function signatures where possible, so call-sites change minimally.
      _Idea source (verify, don't copy): `origin/localStorage` branch's data layer._
- [ ] Provide a **seed dataset** (a sample collection with attributes/actions/layers) loaded
      on first visit so the app is non-empty.
- [ ] Replace `'use server'` DB actions with client-side equivalents (these become client
      calls; remove server-only assumptions). Migrate folder-by-folder.

### 3b. Remove Supabase auth + storage
- [ ] Delete auth middleware redirect (`middleware.ts`) and `/login`, `/signup`, `/auth/*`.
- [ ] Remove `lib/supabase/clients/*`, `lib/supabase/auth/*`, `components/supabase/*`.
- [ ] Replace image storage (Supabase storage) with client-side blobs / object URLs
      (`lib/supabase/storage/*`, uppy/tus uploads → local handling or drop upload feature).
- [ ] Drop `@supabase/*`, `supabase`, `pg` deps once references are gone.

### 3c. Strip non-demo external integrations
- [ ] **AWS** (`@aws-sdk/*` — S3/Lambda/SES, ~2 files): remove or stub.
- [ ] **Blockchain** (`viem`, Alchemy, Etherscan, ~3 files): remove or stub the feature.
- [ ] **AI SDK** (`@ai-sdk/openai`, `ai`): remove, or gate behind absent-key no-op.
- [ ] **Google Maps** (`@vis.gl/react-google-maps`): remove the maps feature or make it
      degrade gracefully without a key.
- [ ] **HubSpot / PostHog:** remove or make optional/no-op (mirror web).

### 3d. Prune unfinished / broken
- [ ] Audit ~35 TODO/FIXME/maintenance markers; remove the `Maintanance` screen path if not
      needed; delete `/test` route and other scaffolding not on the demo path.
- [ ] Walk the happy path from Phase 0; fix or remove anything that errors or dead-ends.

### 3e. Polish for "tap around"
- [ ] Friendly empty/first-run state; obvious entry point into the node editor.
- [ ] Reset/"start over" affordance (clear local data).
- [ ] `next build` green; no console errors on the demo path.

---

## Phase 4 — Deployment (Coolify / Hetzner)

- [ ] Dockerfile (or Nixpacks config) per app, monorepo-aware (build only the target).
- [ ] Coolify app for `web` (static-ish — no DB, storage, or other services needed).
- [ ] Coolify app for `studio` (stateless — client-side data, so no DB service needed).
- [ ] Env/secret wiring per app; domains; HTTPS.
- [ ] Smoke test both deployed apps; confirm studio demo path works for a fresh visitor.

---

## Decision log

Append-only. Newest at bottom. Format: `YYYY-MM-DD — decision — rationale`.

- 2026-06-02 — **Studio storage = client-side & ephemeral** (localStorage/IndexedDB, seeded
  demo data, resets per visitor). — Best fit for a tap-around portfolio demo; no backend to
  host or secure on Coolify.
- 2026-06-02 — **Studio auth removed entirely** (no login wall, no middleware redirect). —
  Visitors should land straight in the app; this is a demo, not a real service.
- 2026-06-02 — **Prior branches (`localStorage`, `showcase`) are reference-only.** — They
  dropped web and targeted Vercel+Drizzle, and their correctness isn't trusted; we rebuild on
  the `portfolio` monorepo and only borrow ideas.
- 2026-06-02 — **Host on Coolify/Hetzner (Docker), keep web + studio as separate apps.** —
  Project goal; no Vercel, no Supabase/AWS/Alchemy/OpenAI accounts in deployed apps.
- 2026-06-02 — **Drop Payload CMS from web entirely; remove the (unrouted) docs section.** —
  Verified nothing public depends on the CMS (landing page is static via `en.json`). Kills
  the Postgres + Blob + SMTP + admin burden; web becomes a zero-service static-ish app.
- 2026-06-02 — **Remove `apps/hub`, `apps/core`, `packages/email`; keep the monorepo.** —
  Out of scope and the only `@repo/email` dependent was hub. Keep `web`, `studio`,
  `packages/{shared,ui,tsconfig}` and the Turborepo/pnpm-workspace structure.

---

## Open questions

- **Which studio features make the demo cut?** Maps, blockchain, AI, and uploads each need a
  key/backend today — confirm per-feature whether to stub, degrade, or remove. (Phase 3c)
- **Image uploads in studio:** keep as client-side blobs, or drop the upload feature for the
  demo? (Phase 3b)

---

## Prior-art branches (reference only — verify before trusting)

- `origin/localStorage` — furthest along: flattened studio to a single Next.js app, removed
  Supabase (0 refs), moved to Drizzle + Vercel Blob + `schema.sql`, added `.cursor` rules,
  deleted web/hub/core. Useful to *see how they untangled Supabase*; wrong infra direction
  for us.
- `origin/showcase` — earlier point on the same line of work.
- `origin/maintenance` — folded into current baseline.
