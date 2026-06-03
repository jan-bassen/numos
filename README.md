# Numos

Monorepo for the **Numos** portfolio showcase. Two apps, self-hosted on
[Coolify](https://coolify.io/) (Hetzner, Docker):

- `web` — Next.js marketing site (static; no external services).
- `studio` — Next.js visual node-editor demo (client-side, ephemeral data; no signup).

> Migration in progress. See [`CLAUDE.md`](./CLAUDE.md) for durable context/decisions and
> [`docs/portfolio-migration.md`](./docs/portfolio-migration.md) for live status.

## Commands

```sh
pnpm install                 # install (pnpm@9.1.4, node >=18)
pnpm dev                     # turbo dev (all apps)
turbo dev --filter=studio    # studio only
turbo dev --filter=web       # web only
turbo build                  # build all
pnpm lint                    # biome check
```

Install a package into one app: `pnpm i <pkg> --filter=<app>`.

## What's inside?

### Apps
- `web`: Next.js marketing site (homepage; static via `dictionaries/en.json` + components).
- `studio`: Next.js node-editor app for building dynamic/interactive digital assets.

### Packages
- `@repo/shared`: shared datatypes, schemas, utils, and the node engine.
- `@repo/ui`: React component library (shadcn/ui), icons, and Tailwind config.
- `@repo/tsconfig`: shared TypeScript config.

## Tooling

- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) (15 / React 19) for the apps
- [Tailwind](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for static typing
- [Biome](https://biomejs.dev/) for linting and formatting
- [shadcn/ui](https://ui.shadcn.com/docs) for reusable components
- [rete.js](https://retejs.org/) for the studio node graph
- [zod](https://zod.dev/) for validation
- [decimal.js](https://mikemcl.github.io/decimal.js/) for maths, [luxon](https://moment.github.io/luxon/#/) for datetime
- [dnd-kit](https://dndkit.com/) for draggable UI
