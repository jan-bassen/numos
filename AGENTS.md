# AGENTS CONTEXT

## Readme
@README.md

## Conventions

- **pnpm only** (enforced via `only-allow`). Use `pnpm i <pkg> --filter=<app>`.
- **Biome** owns formatting & linting — match existing style; don't introduce Prettier/ESLint
  config beyond what's there.
- Shared UI/types come from `@repo/ui` and `@repo/shared` — reuse before adding new deps.

## Studio demo context

- `apps/studio` is a no-code visual node-editor demo. Showcase work should usually improve
  seeded collections, attributes, uploads, actions, layers, and saved node graphs rather than
  adding bespoke app-level game/UI flows.
- Default demo content lives in the client-side IndexedDB seed path under `apps/studio/lib/data`.
  Seeded action/image graphs should remain editable in the existing Rete editor and runnable via
  the simulation sidebar.
