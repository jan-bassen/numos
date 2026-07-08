# AGENTS CONTEXT

## Readme
@README.md

## Conventions

- **pnpm only** (enforced via `only-allow`). Use `pnpm i <pkg> --filter=<app>`.
- **Biome** owns formatting & linting — match existing style; don't introduce Prettier/ESLint
  config beyond what's there.
- Shared UI/types come from `@repo/ui` and `@repo/shared` — reuse before adding new deps.
