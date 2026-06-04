# Portfolio Migration — Plan & Status

Living document. Update the **Status** block and tick checkboxes as work lands.
Durable context (architecture, conventions, locked decisions) lives in
[`CLAUDE.md`](../CLAUDE.md).

---

## Status — You are here

- **Phase:** 3 — in progress. **3a + 3b + 3c complete**, **3d mostly complete** (static
  pass done; interactive browser walk still pending). Studio builds green with zero external
  services/SDKs and boots straight into a seeded demo (no auth).
- **Last done:** Phase 3d (2026-06-04): pruned unfinished/broken scaffolding. Audited the ~33
  `TODO/FIXME` markers — removed the dead **API-Keys** settings block (3 files, only reachable
  from a commented-out segment; its delete button was a no-op stub) + the orphaned **Max
  Supply** input, and the unimplemented **uploads** `addBetweenToSelection` shift-range-select
  (it only `console.error`ed) and dead `deleteSelection`; shift-click now degrades to a plain
  add-to-selection. Left the remaining markers (benign "clean up"/"fix types" notes — none
  gate a demo-path feature). Fixed two copy bugs: the delete-action dialog said "delete this
  attribute?" and the shared delete dialog claimed it removes data "from our servers" (no
  server here). `turbo build --filter=studio` **green**. See [3d checklist](#3d-prune-unfinished--broken).
- **Earlier:** Phase 3c (2026-06-04): stripped the last external integrations. Deleted the
  orphaned **AWS** (`lib/core/*`) and **blockchain** (`lib/blockchain/*`) code; deleted the
  **AI** cron generator (`lib/ai/cron.ts`) and removed the AI tab from `cron-input.tsx`
  (manual cron entry remains); **Google Maps** location datatype degraded to plain lat/lng
  inputs (`location-input`/`location-display` rewritten, map components deleted). Dropped 8
  deps (`@ai-sdk/openai`, `ai`, `@aws-sdk/client-{lambda,s3,ses}`, `viem`,
  `@vis.gl/react-google-maps`, `react-geocode`, `@types/google-map-react`). `turbo build
  --filter=studio` **green**; no source refs to any removed module/dep remain. See
  [3c checklist](#3c-strip-non-demo-external-integrations).
- **Earlier:** Phase 3a+3b (2026-06-03): replaced the entire Supabase data layer (~108
  `'use server'` fns) with a **client-side IndexedDB store** (`lib/data/*`) mirroring the old
  function signatures; added a **seed** (`lib/data/seed.ts`) + `DataBootProvider` so a fresh
  visitor lands on a non-empty "Demo Collection". Converted the ~19 data-fetching server
  layouts/pages to **client components** (`useParams` + `useAsyncResource`). **Removed auth
  entirely**: deleted `middleware.ts`, `/login`,`/signup`,`/auth/*`,`/account`,
  `/api/keep-alive`,`/test`, and `lib/supabase/*`; stubbed `UserProvider` with a demo user.
  Uploads now store **client-side blobs** (object URLs via `SupabaseImage` blob resolution).
  Stripped PostHog/HubSpot from the root layout/providers (mirror of web Phase 2) and dropped
  `@supabase/*`,`@uppy/*`,`tus-js-client`,`posthog-*`,`@hubspot/api-client` deps + the
  `typegen` script. `turbo build --filter=studio` is **green with zero env**; `next start`
  serves `/`→`/collections` and all route shells 200 with no server errors. See
  [Phase 3 notes](#phase-3-notes).
- **Next up:** **Phase 3e** (friendly first-run state; obvious entry into the node editor;
  wire a "start over / reset demo" affordance — `clearAll()` already exists in
  `lib/data/store.ts`). Plus the still-pending **interactive browser verification** of the
  happy path (Chrome wasn't connected during any build session) — seed renders,
  attribute/action/image editors, rete graphs, uploads add. This is the only thing left in 3d.
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

- [x] **Remove Payload entirely:** the `app/(payload)/*` route group, `payload.config.ts`,
      `payload-types.ts`, `collections/*`, `lib/payload/*`, and all `@payloadcms/*` + `payload`
      + `graphql` deps. Also removed the `typegen`/`importgen` payload scripts, the
      `withPayload` wrapper in `next.config.ts`, and the `@payload-config` tsconfig path.
      _(No `pg`/`@payloadcms/db-postgres` left; `components/admin/*` (Payload admin avatar)
      and `components/lexical/*` (docs-only rich-text) removed too.)_
- [x] **Remove the docs section** (`app/(web)/_docs/*`) since it was Payload-driven and
      unrouted. (Revisit later as static MDX if docs are wanted — out of scope for now.)
- [x] **HubSpot:** remove the signup→HubSpot integration (`lib/hubspot/*`, the HubSpot bits
      of `providers.tsx`, the `hs-script-loader` `<Script>` in `layout.tsx`). Signup CTA now
      shows a success toast ("portfolio demo, nothing was sent"); the form UI is kept so the
      hero/nav dialog and beta section still look complete.
- [x] **PostHog:** removed `lib/posthog/*`, the `PostHogProvider`/init in `providers.tsx`,
      `PostHogPageView` in `layout.tsx`, and the analytics-only cookie banner.
- [x] Prune now-dead deps; update what remains; get `next build` green.
- [x] Verify all landing-page sections render with no env vars set.

### Phase 2 notes

- **`web` is now external-service-free:** zero `process.env.*` in source (`grep` confirms).
  No DB, blob storage, SMTP, analytics, or CMS. `next build` → `/` is `○ (Static)`.
- **Tweets section bug (fixed):** `react-tweet@3.2.1`'s `enrichTweet` does
  `for (const e of tweet.entities.<arr>)` unguarded, but Twitter's syndication API now omits
  empty `hashtags`/`urls`/`symbols`/`user_mentions` arrays → `TypeError: entities is not
  iterable`, which crashed static prerender of `/`. Was previously masked by the Payload
  build failure. Fixed by normalizing missing entity arrays to `[]` in
  `tweets/custom-tweet.tsx` before calling `enrichTweet`. (Note: this section still fetches
  from Twitter's syndication API at build time — the one remaining build-time network call in
  `web`. It degrades to "Tweet not found" cards if unreachable, so it won't break the build.)
- **`_pricing/*`** (unrouted, underscore-prefixed) left in place — it's static components, not
  Payload-driven, and harmless. Footer/nav still have commented/dead `/docs`,`/pricing` links
  (pre-existing); not touched in this phase.
- Kept `sharp` (Next.js image optimization) and `react-canvas-confetti` (used by the unused-
  but-present `Example` component) — neither is an external service.

---

## Phase 3 — `studio` migration (the big one)

Goal: Supabase fully removed; client-side ephemeral data; no auth; only working features
remain; smooth tap-around demo.

### 3a. Decouple from Supabase data layer
- [x] Map every `lib/supabase/db/*` server action to the entity it touches.
- [x] Design a **client-side data layer** (IndexedDB) mirroring those entities with the same
      function signatures. Lives in `lib/data/*`; `lib/data/store.ts` is a hand-rolled
      IndexedDB wrapper (one object store per entity + an `upload_blobs` store). No new dep.
- [x] Provide a **seed dataset** (`lib/data/seed.ts` → `seedIfEmpty()`) loaded on first visit
      via `app/(providers)/data-boot-provider.tsx` so the app opens on a non-empty collection.
- [x] Replace `'use server'` DB actions with client-side equivalents; rewrote ~50 call-site
      imports `@/lib/supabase/db/*` → `@/lib/data/*`; deleted `lib/supabase/db/*`. The ~19
      data-fetching server layouts/pages became client components (`useParams` +
      `lib/data/use-async-resource.ts`).

### 3b. Remove Supabase auth + storage
- [x] Delete auth middleware redirect (`middleware.ts`) and `/login`, `/signup`, `/auth/*`
      (also `/account`, `/api/keep-alive`, `/test`).
- [x] Remove `lib/supabase/clients/*`, `lib/supabase/auth/*`. `components/supabase/*` kept but
      rewired: `SupabaseImage` now resolves stored blobs → object URLs; `editable-image`/
      `avatar` use the new uploaders. `UserProvider` stubbed with a demo user
      (`lib/data/demo-constants.ts`).
- [x] Replace image storage with client-side blobs / object URLs (`lib/data/uploaders.ts` +
      `upload.ts` store `File`s in IndexedDB; uppy/tus removed). Uploads feature kept.
- [x] Drop `@supabase/*`, `@uppy/*`, `tus-js-client`, `posthog-*`, `@hubspot/api-client` deps
      + the `typegen` script. (PostHog/HubSpot removal from the root layout/providers was
      folded in here since they blocked boot — mirrors web Phase 2.)

### 3c. Strip non-demo external integrations
- [x] **AWS** (`@aws-sdk/*` — S3/Lambda/SES): **deleted** `lib/core/*` (`test-button`,
      `api/create-api-key`, `clients/lambda`) — all orphaned (only the deleted `/test` route
      used them). Dropped `@aws-sdk/client-{lambda,s3,ses}`.
- [x] **Blockchain** (`viem`, Alchemy, Etherscan): **deleted** `lib/blockchain/*` (`wallet`,
      `abi-button`, `abi`, `client`, `test`) — all orphaned. Dropped `viem`; the `ALCHEMY`/
      `ETHERSCAN` env vars are now unreferenced.
- [x] **AI SDK** (`@ai-sdk/openai`, `ai`): **deleted** `lib/ai/cron.ts` and the **AI tab** in
      `cron-input.tsx`; the cron popover now only offers **manual** schedule + description
      entry. Dropped `@ai-sdk/openai` + `ai`. (`cron-validate` kept — still used by
      `lib/schemas/actions/triggers/time.ts`.)
- [x] **Google Maps** (`@vis.gl/react-google-maps`): **degraded gracefully** — kept the
      `location` datatype (it's a `@repo/shared` `ValueType`, can't be cleanly removed) but
      rewrote `location-input` to plain lat/lng number fields and `location-display` to show
      coordinates; deleted the map components (`address.ts`, `map-picker.tsx`). Dropped
      `@vis.gl/react-google-maps`, `react-geocode`, `@types/google-map-react`; `GOOGLE_MAPS`
      env now unreferenced.
- [x] **HubSpot / PostHog:** already removed in 3b (they blocked boot) — nothing left.

### 3d. Prune unfinished / broken
- [x] Audited the ~33 `TODO/FIXME` markers. The `Maintanance` screen and `/test` route were
      already gone (3b). The remainder split into: **(a) dead/broken scaffolding → removed**,
      **(b) benign code-quality notes → left in place** (e.g. "clean up", "fix these types",
      "add sorting" — none gate a demo-path feature; chasing them is a rewrite, not a prune).
      Removed in (a): the **API-Keys** settings block (`api-keys.tsx`, `create-key-button.tsx`,
      `delete-key-button.tsx` — only reachable from a commented-out `<Segment>` in the
      collection `page.tsx`; `DeleteKeyButton` was a dead-end that only `console.log`ged) and
      its sibling commented-out **Max Supply** segment + the orphaned
      `collection-max-supply-input.tsx` (vestigial NFT-minting concept; the `max_supply` data
      field stays — it's still in the seed/create form). In the **uploads tree**, deleted the
      unimplemented `addBetweenToSelection` (shift-click range-select that only
      `console.error`ed "not implemented") and the commented-out `deleteSelection`; shift-click
      now falls back to a plain add-to-selection (like ⌘-click) instead of erroring.
- [~] Static happy-path pass done (no interactive browser yet — Chrome still not connected).
      Confirmed **zero source refs** remain to any module/dep deleted in 3a–3c. All four
      entity delete buttons call the real `lib/data` deletes; fixed two copy bugs surfaced
      along the way: the **delete-action** dialog said *"delete this attribute?"* (→ `action`),
      and the shared delete dialog claimed it would *"remove all the data from our servers"*
      (→ *"remove all of its data"* — there is no server in this demo). `turbo build
      --filter=studio` **green**. **Still pending:** the click-through verification of seed →
      attribute/action/image editors → rete graphs → uploads, which needs the Chrome extension
      connected.

### 3e. Polish for "tap around"
- [ ] Friendly empty/first-run state; obvious entry point into the node editor.
- [ ] Reset/"start over" affordance (clear local data). _Store helper `clearAll()` already
      exists in `lib/data/store.ts`; just needs a UI hook._
- [x] `next build` green (zero env). Console-on-demo-path check still pending browser verify.

### Phase 3 notes (3a + 3b)

- **Data layer = `lib/data/*`**, a faithful re-implementation of the old `lib/supabase/db/*`
  surface (same function names/signatures) over IndexedDB. Reads return typed rows / throw
  `FetchError`; writes return `ReturnInfo`. `revalidatePath` became a no-op (contexts hold
  authoritative local state via `use-context-state`); `redirect`/`notFound` from
  `next/navigation` are kept (they work in client components).
- **`insertCollection` now also creates the editable version** — the old Postgres trigger did
  this implicitly, and without it freshly created collections 404'd. Deletes cascade manually
  (no FK cascade in IndexedDB).
- **Server→client:** studio is now effectively client-rendered. Build still lists the dynamic
  routes as `ƒ`, but they render a thin shell and fetch from IndexedDB on the client.
- **Images:** every image blob is stored keyed by its last path segment (upload id / uuid).
  `SupabaseImage` renders direct URLs (object/data/http/`/public`) as-is and otherwise
  resolves the key → an object URL from the blob store. Collection-image upload keeps the uuid
  contract so `updateCollectionSchema`'s `image: uuid` still validates.
- **Seed graphs are empty** (nodes/connections `[]`) so the rete editors render a usable empty
  canvas without risking a crash from a mis-shaped seed node — seeding richer example graphs
  is a 3e polish item.
- **Dead code removed along the way:** `lib/supabase/db/nodes.ts` (no consumers),
  `lib/node-migration.ts`, `app/.../to-be-page*.tsx`, `app/maintanance.tsx`.
- **Known follow-ups:** interactive happy-path verification (Chrome was offline this session);
  `lib/{ai,blockchain,core/api}` still hold `'use server'` actions for 3c features (compile
  fine, off the demo path); object URLs from `getUploadsTree` aren't revoked (page-scoped leak,
  fine for a demo).

---

## Phase 4 — Deployment (Coolify / Hetzner)

- [x] Dockerfile for `web`, monorepo-aware (`turbo prune` + Next standalone). Verified: image
      builds clean-room and serves HTTP 200 + static assets. Studio Dockerfile still TODO.
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
- 2026-06-04 — **Deploy via per-app Dockerfile, not Nixpacks.** — Coolify's Nixpacks
  autodetect ran `npm i` against `apps/web` and choked on the `workspace:*` protocol; it also
  can't resolve workspace deps from a subfolder. `apps/web/Dockerfile` uses `turbo prune web
  --docker` (excludes studio's heavy deps) + Next `output: 'standalone'`, built from the repo
  root. In Coolify set Build Pack = Dockerfile, Base Directory = `/`, Dockerfile =
  `apps/web/Dockerfile`. Also fixed a stale `web#build` turbo dep on `@repo/shared` (web
  doesn't import shared; it transpiles `@repo/ui` from source).
- 2026-06-03 — **Web signup CTA = keep the form UI, submit shows a "portfolio demo" toast.**
  — Rather than a mailto or deleting the beta section, keep the visual design intact and make
  submit a no-op acknowledgement. No backend/CRM, nothing to host or secure.
- 2026-06-03 — **Keep the Tweets section but harden it** (normalize missing entity arrays
  before `enrichTweet`). — It's a confirmed landing component; the crash was an upstream
  react-tweet/syndication data-shape bug, not a reason to drop the section. Still a build-time
  network call, but it degrades gracefully so it can't break the build.
- 2026-06-03 — **Studio data layer = IndexedDB via a hand-rolled wrapper in `lib/data/*`** (no
  new dep), mirroring the old `lib/supabase/db` signatures. — Graph + blob data exceed
  localStorage's ~5MB and uploads need blob storage; a thin custom wrapper avoids a dependency
  while keeping call-sites stable.
- 2026-06-03 — **Studio becomes client-rendered: the ~19 data-fetching layouts/pages are now
  client components** (`useParams` + `useAsyncResource`). — Browser-only storage can't be read
  in RSCs; acceptable for a tap-around demo and keeps the existing Provider/context tree.
- 2026-06-03 — **Uploads kept as client-side blobs** (object URLs), per the locked decision. —
  Preserves a visibly complete uploads tab + image layers with no backend.
- 2026-06-03 — **Auth removed by deleting routes, not stubbing them**: `middleware.ts`,
  `/login`,`/signup`,`/auth/*`,`/account`,`/api/keep-alive`,`/test`, and `lib/supabase/*` are
  gone; `UserProvider` serves a fixed demo user. — "Delete > disable"; visitors land straight
  in the app.
- 2026-06-04 — **AWS + blockchain code deleted outright** (`lib/core/*`, `lib/blockchain/*`).
  — Both were orphaned (only the now-deleted `/test` route referenced them); off the demo path
  with no consumers, so "delete > disable" applies cleanly.
- 2026-06-04 — **AI cron generator removed; cron-input keeps manual entry only.** — The AI tab
  needed OpenAI; the manual schedule + description fields fully cover the demo, so we dropped
  `@ai-sdk/openai`/`ai` and the AI tab rather than gating a key-less no-op.
- 2026-06-04 — **Google Maps `location` datatype degraded, not removed** (plain lat/lng number
  inputs; map + geocode UI deleted). — `location` is a `@repo/shared` `ValueType` wired into
  the engine/schemas/rete nodes, so deleting it would be a cross-package change out of 3c
  scope; degrading keeps the datatype usable in the demo with zero deps/keys.
- 2026-06-04 — **3d TODO audit: prune only the dead/broken markers, keep code-quality notes.**
  — Of the ~33 `TODO/FIXME`s, only a handful marked actually-broken demo-path code (API-Keys
  block, uploads range-select, a no-op delete-key button); those were removed. The rest are
  ordinary "clean up / fix types" notes that don't gate any feature — fixing them is a rewrite,
  not the targeted prune this phase calls for, so they stay.
- 2026-06-04 — **Uploads shift-click degrades to add-to-selection** instead of the
  unimplemented range-select. — Range-select was never finished (only `console.error`ed); for a
  tap-around demo a plain add (matching ⌘-click) is a convincing, non-erroring behavior, and
  "delete > disable" removes the half-built code rather than leaving a dead branch.

---

## Open questions

- _(Resolved 3c)_ **Which studio features make the demo cut?** Uploads → kept as client-side
  blobs. AWS + blockchain → deleted (orphaned). AI cron → removed, manual entry kept. Google
  Maps location → degraded to plain lat/lng inputs.

---

## Prior-art branches (reference only — verify before trusting)

- `origin/localStorage` — furthest along: flattened studio to a single Next.js app, removed
  Supabase (0 refs), moved to Drizzle + Vercel Blob + `schema.sql`, added `.cursor` rules,
  deleted web/hub/core. Useful to *see how they untangled Supabase*; wrong infra direction
  for us.
- `origin/showcase` — earlier point on the same line of work.
- `origin/maintenance` — folded into current baseline.
