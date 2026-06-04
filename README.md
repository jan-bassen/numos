# Numos

> Bring digital assets to life.

Numos is a platform for creating **dynamic and interactive digital assets** — NFTs that can change over time and respond to real-world events. The Studio lets creators design and manage assets without writing code and launch them in days.

This is the main monorepo for Numos, managed with [Turborepo](https://turborepo.org/) and [pnpm](https://pnpm.io/) workspaces.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) `>=18`
- [pnpm](https://pnpm.io/) `9` (`corepack enable` will pick up the pinned version)

### Install

```sh
pnpm install
```

### Common commands

Build the entire stack:

```sh
pnpm build
```

Run everything in dev mode:

```sh
pnpm dev
```

Run a single app (e.g. just the studio):

```sh
turbo dev --filter=studio
```

Lint and format the whole repo:

```sh
pnpm lint
```

Add a dependency to a specific workspace (e.g. the homepage):

```sh
pnpm add <package> --filter=web
```

## What's inside?

### Apps

- `web`: a [Next.js](https://nextjs.org/) site with the homepage and docs
- `studio`: a Next.js app for creating and managing dynamic and interactive digital assets
- `hub`: a Next.js app where holders view, collect, and interact with assets
- `core`: an [AWS CDK](https://aws.amazon.com/cdk/) app for deploying the backend

### Packages

- `@repo/ui`: a React component library based on [shadcn/ui](https://ui.shadcn.com/docs), including icons and the shared Tailwind config
- `@repo/shared`: shared assets like datatypes and the node engine
- `@repo/email`: a [React Email](https://react.email/) project (not in use yet)
- `@repo/tsconfig`: shared TypeScript configs used throughout the monorepo

## Tooling

### Core

- [Turborepo](https://turborepo.org/) for monorepo management
- [Next.js](https://nextjs.org/) for frontend development
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for linting and formatting
- [shadcn/ui](https://ui.shadcn.com/docs) for reusable components
- [Payload](https://payloadcms.com/) as the CMS for the homepage

### Libraries

- [zod](https://zod.dev/) for validation
- [Drizzle](https://orm.drizzle.team/) for database access outside the Supabase SDK
- [viem](https://viem.sh/) for anything blockchain
- [AI SDK](https://sdk.vercel.ai/) for anything AI
- [sharp](https://sharp.pixelplumbing.com/) for image manipulation
- [Luxon](https://moment.github.io/luxon/) for dates and times
- [decimal.js](https://mikemcl.github.io/decimal.js/) for precise math
- [dnd-kit](https://dndkit.com/) for draggable UI
- [lodash](https://lodash.com/) for common utilities

### Services

- [Vercel](https://vercel.com) for hosting
- [Supabase](https://supabase.com/docs) as our backend-as-a-service
- [AWS](https://aws.amazon.com/) for email and hosting the core backend
- [Alchemy](https://www.alchemy.com/) for RPC and blockchain webhooks
- [Stripe](https://stripe.com/) for payments
- [PostHog](https://posthog.com/) for analytics and monitoring
- [Sentry](https://sentry.io/) for error monitoring
- [Linear](https://linear.app/) for development management
